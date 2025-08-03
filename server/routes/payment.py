from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from typing import Optional
from uuid import uuid4
from datetime import datetime, date, timedelta
import os
import httpx
from supabase import create_client, Client
from utils.jwt_handler import decode_token  # your custom JWT decoder

router = APIRouter()

# Load env vars
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
CASHFREE_APP_ID = os.getenv("CASHFREE_APP_ID")
CASHFREE_SECRET = os.getenv("CASHFREE_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL")
CASHFREE_BASE_URL = os.getenv("CASHFREE_BASE_URL")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

PLAN_DAYS = {
    "weekly": 7,
    "monthly": 30,
    "bimonthly": 60
}

CASHFREE_BASE_URL = "https://sandbox.cashfree.com/"

class PaymentRequest(BaseModel):
    plan_id: str  # weekly, monthly, bimonthly
    amount: float
    phone: Optional[str] = None

@router.post("/create-payment")
async def create_payment(payload: PaymentRequest, request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing auth header")

    token = auth_header.replace("Bearer ", "")
    try:
        user = decode_token(token)
        email = user["email"]
        user_id = user["user_id"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    order_id = str(uuid4())
    duration_days = PLAN_DAYS.get(payload.plan_id, 7)
    start_date = date.today()
    end_date = start_date + timedelta(days=duration_days)

    # Get Cashfree access token
    async with httpx.AsyncClient() as client:
        auth_res = await client.post(
            f"{CASHFREE_BASE_URL}/v1/auth/tokens",
            json={
                "client_id": CASHFREE_APP_ID,
                "client_secret": CASHFREE_SECRET
            },
            headers={"Content-Type": "application/json"}
        )
        if auth_res.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to authenticate with Cashfree")
        auth_token = auth_res.json()["data"]["token"]

    payment_payload = {
        "order_id": order_id,
        "order_amount": payload.amount,
        "order_currency": "INR",
        "customer_details": {
            "customer_id": email,
            "customer_email": email,
            "customer_phone": payload.phone or ""
        },
        "order_note": f"Subscription for {payload.plan_id} plan",
        "order_meta": {
            "return_url": f"{FRONTEND_URL}/payment-success?order_id={order_id}",
            "notify_url": f"{FRONTEND_URL}/payment-webhook"
        }
    }

# POST /v2/orders with Bearer token
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{CASHFREE_BASE_URL}/v2/orders",
            json=payment_payload,
            headers={
                "Authorization": f"Bearer {auth_token}",
                "Content-Type": "application/json",
                "x-api-version": "2022-09-01"  # recommend specifying version
            }
        )
        if res.status_code not in [200, 201]:
            raise HTTPException(status_code=500, detail="Payment creation failed")
        payment_data = res.json()
        payment_link = payment_data["payment_session_id"]  # or res.json()["data"]["payment_link"]

    await supabase.table("transactions").insert({
        "email": email,
        "user_id": user_id,
        "plan_id": payload.plan_id,
        "amount": payload.amount,
        "phone": payload.phone,
        "status": "INITIATED",
        "order_id": order_id,
        "payment_link": payment_data["payment_link"],
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "is_active": True
    }).execute()

    return {"success": True, "payment_link": payment_data["payment_link"]}


# Webhook Handler
class WebhookPayload(BaseModel):
    order_id: str
    order_status: str
    payment_time: Optional[str] = None

@router.post("/cashfree-webhook")
async def cashfree_webhook(request: Request):
    payload = await request.json()
    order_id = payload["order"]["order_id"]
    order_status = payload["order"]["order_status"]
    # ... validate signature here if needed ...
    supabase.table("transactions").update({
        "status": order_status,
        "confirmation_time": payload.get("payment_time", datetime.utcnow().isoformat()),
        "is_active": order_status in ["PAID", "SUCCESS"]
    }).eq("order_id", order_id).execute()
    return {"success": True}


    # Optional route to check subscription status
@router.get("/me/subscription")
async def get_subscription(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing auth header")
    token = auth_header.replace("Bearer ", "")
    user = decode_token(token)
    user_id = user["user_id"]

    result = supabase.from_("transactions").select("*") \
        .eq("user_id", user_id) \
        .eq("is_active", True) \
        .order("end_date", desc=True) \
        .limit(1).execute()

    if result.data:
        return {"active_subscription": result.data[0]}
    return {"active_subscription": None}

@router.get("/verify-payment")
async def verify_payment(order_id: str, request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing auth header")

    token = auth_header.replace("Bearer ", "")
    try:
        user = decode_token(token)
        user_id = user["user_id"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    result = supabase.from_("transactions").select("*") \
        .eq("user_id", user_id) \
        .eq("order_id", order_id) \
        .limit(1).execute()

    if result.data and result.data[0]["status"].upper() in ["PAID", "SUCCESS"]:
        return {"success": True}
    else:
        return {"success": False}