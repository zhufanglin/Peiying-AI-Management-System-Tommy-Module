from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from app.database import Base


class ArchiveDocument(Base):
    __tablename__ = "tommy_archive_documents"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    file_name = Column(String(500), nullable=False, comment="原始文件名")
    file_path = Column(String(1000), nullable=False, comment="文件存储路径")
    file_size = Column(Integer, nullable=False, default=0, comment="文件大小（字节）")
    file_type = Column(String(50), nullable=False, comment="文件类型（pdf/png/jpg等）")

    # OCR 结果
    ocr_text = Column(Text, nullable=True, comment="OCR 识别出的全文")

    # AI 结果
    ai_category = Column(String(100), nullable=True, comment="AI 分类结果")
    ai_suggested_name = Column(String(500), nullable=True, comment="AI 建议的文件名")
    ai_amount = Column(String(100), nullable=True, comment="AI 提取的金额")
    ai_expiry_date = Column(String(100), nullable=True, comment="AI 提取的到期日")
    ai_confidence = Column(Float, nullable=True, comment="AI 置信度（0-1）")

    # 用户确认结果
    user_confirmed_name = Column(String(500), nullable=True, comment="用户确认/修改后的文件名")
    user_confirmed_category = Column(String(100), nullable=True, comment="用户确认/修改后的分类")
    user_confirmed_amount = Column(String(100), nullable=True, comment="用户确认/修改后的金额")
    user_confirmed_expiry_date = Column(String(100), nullable=True, comment="用户确认/修改后的到期日")

    # 状态与备注
    status = Column(
        String(20),
        nullable=False,
        default="pending",
        comment="状态：pending（待复核）/ archived（已归档）/ abnormal（异常）",
    )
    remark = Column(Text, nullable=True, comment="备注")

    # 时间
    uploaded_at = Column(DateTime, nullable=False, default=datetime.now, comment="上传时间")
    archived_at = Column(DateTime, nullable=True, comment="归档时间")
