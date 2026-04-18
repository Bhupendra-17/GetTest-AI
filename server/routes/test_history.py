from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from bson import ObjectId, errors as bson_errors

router = APIRouter()

@router.get("/history/{user_id}", tags=["Test History"])
async def get_user_history(user_id: str, request: Request):
    try:
        db = request.app.database
        
        # Try ObjectId, fallback to string
        try:
            query_id = ObjectId(user_id)
        except bson_errors.InvalidId:
            query_id = user_id

        results_cursor = db.test_results.find({"user_id": query_id}).sort("date", -1)
        results = await results_cursor.to_list(length=100)

        formatted_results = []
        for r in results:
            formatted_results.append({
                "id": str(r["_id"]),
                "user_id": str(r["user_id"]),
                "title": r.get("title", "Untitled"),
                "score": r.get("score", 0),
                "total": r.get("total", 0),
                "date": r.get("date", datetime.utcnow()).isoformat(),
                "timeTaken": r.get("timeTaken"),
            })

        return {"tests": formatted_results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/test/{test_id}", tags=["Test History"])
async def get_test_by_id(test_id: str, request: Request):
    try:
        db = request.app.database
        result = await db.test_results.find_one({"_id": ObjectId(test_id)})

        if not result:
            raise HTTPException(status_code=404, detail="Test not found")

        result["_id"] = str(result["_id"])
        result["user_id"] = str(result["user_id"])

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))