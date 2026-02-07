import os
import uuid
from fastapi import UploadFile
from typing import Optional

class UploadService:
    def __init__(self, upload_dir: str = None):
        if upload_dir is None:
            # Get the project root (2 levels up from this file)
            project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            self.upload_dir = os.path.join(project_root, "uploads")
        else:
            self.upload_dir = upload_dir
        if not os.path.exists(self.upload_dir):
            os.makedirs(self.upload_dir)

    ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".mp4", ".webm", ".mov", ".pdf"}

    async def save_file_local(self, file: UploadFile) -> str:
        # Validate file extension
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in self.ALLOWED_EXTENSIONS:
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail=f"File type not allowed. Allowed types: {', '.join(self.ALLOWED_EXTENSIONS)}")

        # Generate unique filename to avoid collisions
        unique_filename = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(self.upload_dir, unique_filename)

        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Return the relative URL path
        return f"/uploads/{unique_filename}"

    async def delete_file_local(self, file_url: str):
        if file_url.startswith("/uploads/"):
            filename = file_url.replace("/uploads/", "")
            file_path = os.path.join(self.upload_dir, filename)
            if os.path.exists(file_path):
                os.remove(file_path)

upload_service = UploadService()
