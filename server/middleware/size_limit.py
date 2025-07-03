from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

MAX_UPLOAD_SIZE = 5 * 1024 * 1024  # 5 MB

class LimitUploadSizeMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > MAX_UPLOAD_SIZE:
            return JSONResponse(
                {"detail": f"File too large. Max allowed size is {MAX_UPLOAD_SIZE // (1024 * 1024)} MB"},
                status_code=413,
            )
        return await call_next(request)
