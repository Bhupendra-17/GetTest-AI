from fastapi import APIRouter, Request, HTTPException, UploadFile, File
from pydantic import BaseModel
from bson import ObjectId
from typing import Optional
import shutil
import os

router = APIRouter()

# ---------- Models ----------

class UserProfileUpdate(BaseModel):
  name: str
  profilePic: Optional[str] = None

# ---------- Get User Profile ----------

@router.get("/user/{user_id}")
async def get_user_profile(user_id: str, request: Request):
  db = request.app.database
  user = await db["users"].find_one({"_id": ObjectId(user_id)})
  if not user:
    raise HTTPException(status_code=404, detail="User not found")

  user["_id"] = str(user["_id"]) # Convert ObjectId to string
  return {"username": user.get("name"), "email": user.get("email")}

# ---------- Update User Profile ----------

@router.put("/user/{user_id}")
async def update_user_profile(user_id: str, data: UserProfileUpdate, request: Request):
  db = request.app.database

  update_data = {k: v for k, v in data.dict(exclude_unset=True).items() if v is not None}
  if not update_data:
    raise HTTPException(status_code=400, detail="No valid fields to update")

  result = await db["users"].update_one(
    {"_id": ObjectId(user_id)},
    {"$set": update_data}
  )
  if result.matched_count == 0:
    raise HTTPException(status_code=404, detail="User not found")

  return {"message": "Profile updated", "status_code": 200}

# ---------- Upload Profile Picture ----------

@router.post("/user/{user_id}/upload-profile-pic")
async def upload_profile_pic(request: Request, user_id: str, file: UploadFile = File(...)):
  try:
    if not file.content_type.startswith("image/"):
      raise HTTPException(status_code=400, detail="Invalid file type. Only images allowed.")

    ext = file.filename.split('.')[-1]
    filename = f"profile_{user_id}.{ext}"
    upload_folder = "static/profile_pics"
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, filename)

    with open(filepath, "wb") as buffer:
      shutil.copyfileobj(file.file, buffer)

    # Generate the URL (in production, this would be a CDN or S3 URL)
    profile_url = f"/static/profile_pics/{filename}"

    await request.app.database["users"].update_one(
      {"_id": ObjectId(user_id)},
      {"$set": {"profilePic": profile_url}}
    )

    return {"message": "Profile picture uploaded", "url": profile_url, "status_code": 200}

  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
