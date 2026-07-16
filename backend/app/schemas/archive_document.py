from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class DocumentListItem(BaseModel):
    """文件列表项（不返回大段 ocr_text）"""
    id: int
    file_name: str
    file_type: str
    file_size: int
    ai_category: Optional[str] = None
    ai_suggested_name: Optional[str] = None
    ai_amount: Optional[str] = None
    ai_expiry_date: Optional[str] = None
    ai_confidence: Optional[float] = None
    status: str
    uploaded_at: datetime

    model_config = {"from_attributes": True}


class DocumentDetail(BaseModel):
    """文件详情（含 ocr_text）"""
    id: int
    file_name: str
    file_path: str
    file_type: str
    file_size: int
    ocr_text: Optional[str] = None
    ai_category: Optional[str] = None
    ai_suggested_name: Optional[str] = None
    ai_amount: Optional[str] = None
    ai_expiry_date: Optional[str] = None
    ai_confidence: Optional[float] = None
    user_confirmed_name: Optional[str] = None
    user_confirmed_category: Optional[str] = None
    user_confirmed_amount: Optional[str] = None
    user_confirmed_expiry_date: Optional[str] = None
    status: str
    remark: Optional[str] = None
    uploaded_at: datetime
    archived_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class DocumentUpdate(BaseModel):
    """用户修改文件信息"""
    user_confirmed_name: Optional[str] = None
    user_confirmed_category: Optional[str] = None
    user_confirmed_amount: Optional[str] = None
    user_confirmed_expiry_date: Optional[str] = None
    remark: Optional[str] = None


class DocumentListResponse(BaseModel):
    data: list[DocumentListItem]
    total: int


class ConfirmResponse(BaseModel):
    message: str
    document: DocumentDetail
