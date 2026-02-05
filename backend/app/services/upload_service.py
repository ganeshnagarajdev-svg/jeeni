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

    async def save_file_local(self, file: UploadFile) -> str:
        # Generate unique filename to avoid collisions
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
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
