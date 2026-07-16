import os
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.archive_document import ArchiveDocument
from app.services.ai_mock import generate_mock_ai_result

router = APIRouter()

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 保存文件
    file_ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "bin"
    unique_name = f"{uuid.uuid4().hex}.{file_ext}"
    file_path = UPLOAD_DIR / unique_name

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    file_size = len(content)

    # Mock AI 结果
    ai_result = generate_mock_ai_result(file.filename)

    # 创建数据库记录
    doc = ArchiveDocument(
        file_name=file.filename,
        file_path=str(file_path),
        file_size=file_size,
        file_type=file_ext,
        ocr_text=ai_result["ocr_text"],
        ai_category=ai_result["ai_category"],
        ai_suggested_name=ai_result["ai_suggested_name"],
        ai_amount=ai_result["ai_amount"],
        ai_expiry_date=ai_result["ai_expiry_date"],
        ai_confidence=ai_result["ai_confidence"],
        status="pending",
    )

    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {
        "message": "上传成功",
        "document_id": doc.id,
        "file_name": doc.file_name,
        "file_size": doc.file_size,
        "file_type": doc.file_type,
    }
