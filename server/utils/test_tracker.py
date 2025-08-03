from datetime import datetime, timedelta
from pymongo.collection import Collection

def get_start_of_week() -> datetime:
    today = datetime.utcnow()
    start = today - timedelta(days=today.weekday())
    return datetime(start.year, start.month, start.day)

def can_take_test(user_id: str, db: Collection):
    start_of_week = get_start_of_week()
    record = db.find_one({"user_id": user_id})

    if not record:
        # New user or no record yet
        db.insert_one({
            "user_id": user_id,
            "tests_this_week": 0,
            "week_start": start_of_week
        })
        return True, 0

    # If new week, reset counter
    if record["week_start"] < start_of_week:
        db.update_one({"user_id": user_id}, {
            "$set": {
                "tests_this_week": 0,
                "week_start": start_of_week
            }
        })
        return True, 0

    if record["tests_this_week"] >= 3:
        return False, record["tests_this_week"]

    return True, record["tests_this_week"]
