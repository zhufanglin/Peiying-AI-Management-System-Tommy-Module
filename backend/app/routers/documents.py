from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.archive_document import ArchiveDocument
from app.schemas.archive_document import (
    DocumentListItem,
    DocumentDetail,
    DocumentUpdate,
    DocumentListResponse,
    ConfirmResponse,
)

router = APIRouter()


@router.get("/documents", response_model=DocumentListResponse)
def list_documents(
    status: str = Query(None, description="筛选状态：pending / archived / abnormal"),
    db: Session = Depends(get_db),
):
    query = db.query(ArchiveDocument).order_by(ArchiveDocument.uploaded_at.desc())

    if status:
        query = query.filter(ArchiveDocument.status == status)

    docs = query.all()
    items = [DocumentListItem.model_validate(doc) for doc in docs]

    return DocumentListResponse(data=items, total=len(items))


@router.get("/documents/{doc_id}", response_model=DocumentDetail)
def get_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(ArchiveDocument).filter(ArchiveDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="文件不存在")
    return DocumentDetail.model_validate(doc)


@router.put("/documents/{doc_id}", response_model=DocumentDetail)
def update_document(doc_id: int, update: DocumentUpdate, db: Session = Depends(get_db)):
    doc = db.query(ArchiveDocument).filter(ArchiveDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="文件不存在")

    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(doc, key, value)

    db.commit()
    db.refresh(doc)
    return DocumentDetail.model_validate(doc)


@router.put("/documents/{doc_id}/confirm", response_model=ConfirmResponse)
def confirm_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(ArchiveDocument).filter(ArchiveDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="文件不存在")

    # 如果用户没有手动修改过，使用 AI 建议值作为确认值
    if not doc.user_confirmed_name and doc.ai_suggested_name:
        doc.user_confirmed_name = doc.ai_suggested_name
    if not doc.user_confirmed_category and doc.ai_category:
        doc.user_confirmed_category = doc.ai_category
    if not doc.user_confirmed_amount and doc.ai_amount:
        doc.user_confirmed_amount = doc.ai_amount
    if not doc.user_confirmed_expiry_date and doc.ai_expiry_date:
        doc.user_confirmed_expiry_date = doc.ai_expiry_date

    doc.status = "archived"
    doc.archived_at = datetime.now()

    db.commit()
    db.refresh(doc)

    return ConfirmResponse(
        message="已确认归档",
        document=DocumentDetail.model_validate(doc),
    )


@router.put("/documents/{doc_id}/abnormal", response_model=ConfirmResponse)
def mark_abnormal(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(ArchiveDocument).filter(ArchiveDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="文件不存在")

    doc.status = "abnormal"
    db.commit()
    db.refresh(doc)

    return ConfirmResponse(
        message="已标记异常",
        document=DocumentDetail.model_validate(doc),
    )
