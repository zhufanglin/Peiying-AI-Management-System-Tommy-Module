"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Button,
  Card,
  Row,
  Col,
  Table,
  Tag,
  Upload,
  Space,
  Tooltip,
  message,
  Spin,
  Badge,
} from "antd";
import {
  UploadOutlined,
  FilterOutlined,
  ReloadOutlined,
  FileTextOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FolderOpenOutlined,
  ExclamationCircleOutlined,
  ScanOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import ArchiveReviewPanel from "@/components/modules/tommy/ArchiveReviewPanel";
import ArchiveActionsModal from "@/components/modules/tommy/ArchiveActionsModal";
import ArchiveDetailModal from "@/components/modules/tommy/ArchiveDetailModal";
import EmptyState from "@/components/ui/EmptyState";
import {
  STATUS_CONFIG,
  CATEGORY_COLORS,
} from "@/components/modules/tommy/types";
import type { ArchiveDocument } from "@/components/modules/tommy/types";

const { Title, Text } = Typography;
const API_BASE = "http://localhost:8000/api";

// ==================== Status badge ====================
function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <Tag
      color={cfg.tagColor}
      style={{ borderRadius: 16, padding: "2px 10px", fontSize: 12, fontWeight: 600, margin: 0 }}
    >
      {status === "pending" && <ClockCircleOutlined style={{ marginRight: 4 }} />}
      {status === "archived" && <CheckCircleOutlined style={{ marginRight: 4 }} />}
      {status === "abnormal" && <ExclamationCircleOutlined style={{ marginRight: 4 }} />}
      {cfg.text}
    </Tag>
  );
}

// ==================== Category tag ====================
function CategoryTag({ category }: { category: string | null }) {
  if (!category) return <Text type="secondary">-</Text>;
  return (
    <Tag color={CATEGORY_COLORS[category] || "#8c8c8c"} style={{ borderRadius: 6, fontWeight: 600 }}>
      {category}
    </Tag>
  );
}

// ==================== Stat card ====================
function StatCard({
  label,
  value,
  icon,
  accentColor,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accentColor: string;
}) {
  return (
    <Card
      hoverable
      styles={{ body: { padding: "16px 20px" } }}
      style={{
        borderRadius: 12,
        border: "none",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: `linear-gradient(180deg, ${accentColor}88, ${accentColor})`,
          borderRadius: "0 2px 2px 0",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
            {label}
          </Text>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: accentColor,
              marginTop: 4,
              lineHeight: 1.2,
            }}
          >
            {value}
          </div>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            display: "grid",
            placeItems: "center",
            background: `${accentColor}15`,
            color: accentColor,
            fontSize: 20,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

// ==================== Main Page ====================
export default function ArchivePage() {
  const [documents, setDocuments] = useState<ArchiveDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<ArchiveDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  // Stats
  const stats = {
    todayUpload: documents.filter(
      (d) => new Date(d.uploaded_at).toDateString() === new Date().toDateString()
    ).length,
    pending: documents.filter((d) => d.status === "pending").length,
    archived: documents.filter((d) => d.status === "archived").length,
    abnormal: documents.filter((d) => d.status === "abnormal").length,
  };

  // ==================== API ====================
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const url = filterStatus
        ? `${API_BASE}/documents?status=${filterStatus}`
        : `${API_BASE}/documents`;
      const res = await fetch(url);
      const json = await res.json();
      setDocuments(json.data || []);
    } catch {
      message.error("獲取文件列表失敗");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  const fetchDocumentDetail = useCallback(async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/documents/${id}`);
      const json = await res.json();
      setSelectedDoc(json);
    } catch {
      message.error("獲取文件詳情失敗");
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // ==================== Upload ====================
  const handleUpload: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("上傳失敗");
      const result = await res.json();
      message.success({
        content: `「${result.file_name}」上傳成功，AI 分析完成`,
        icon: <CheckCircleOutlined style={{ color: "#389e0d" }} />,
        duration: 3,
      });
      onSuccess?.(result);
      await fetchDocuments();
    } catch {
      message.error("上傳失敗，請重試");
      onError?.(new Error("上傳失敗"));
    } finally {
      setUploading(false);
    }
  };

  // ==================== Actions ====================
  const handleUpdateAndConfirm = async () => {
    if (!selectedDoc) return;
    setActionLoading(true);
    try {
      await fetch(`${API_BASE}/documents/${selectedDoc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_confirmed_name: selectedDoc.user_confirmed_name,
          user_confirmed_category: selectedDoc.user_confirmed_category,
          user_confirmed_amount: selectedDoc.user_confirmed_amount,
          user_confirmed_expiry_date: selectedDoc.user_confirmed_expiry_date,
        }),
      });
      const res = await fetch(`${API_BASE}/documents/${selectedDoc.id}/confirm`, {
        method: "PUT",
      });
      const json = await res.json();
      message.success({
        content: json.message,
        icon: <CheckCircleOutlined style={{ color: "#389e0d" }} />,
      });
      await fetchDocuments();
      await fetchDocumentDetail(selectedDoc.id);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAbnormal = async () => {
    if (!selectedDoc) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/documents/${selectedDoc.id}/abnormal`, {
        method: "PUT",
      });
      const json = await res.json();
      message.warning(json.message);
      await fetchDocuments();
      await fetchDocumentDetail(selectedDoc.id);
    } finally {
      setActionLoading(false);
    }
  };

  // ==================== Columns ====================
  const columns: ColumnsType<ArchiveDocument> = [
    {
      title: "文件名",
      dataIndex: "file_name",
      key: "file_name",
      ellipsis: true,
      render: (name: string, record: ArchiveDocument) => (
        <Button
          type="link"
          style={{
            padding: 0,
            textAlign: "left",
            color: "#1d2939",
            fontWeight: selectedDoc?.id === record.id ? 600 : 400,
          }}
          onClick={() => fetchDocumentDetail(record.id)}
        >
          <Space size={6}>
            <FileTextOutlined style={{ color: "#8c8c8c", fontSize: 14 }} />
            <span>{name}</span>
          </Space>
        </Button>
      ),
    },
    {
      title: "分類",
      dataIndex: "ai_category",
      key: "ai_category",
      width: 120,
      responsive: ["md" as const],
      render: (cat: string | null) => <CategoryTag category={cat} />,
    },
    {
      title: "建議檔名",
      dataIndex: "ai_suggested_name",
      key: "ai_suggested_name",
      ellipsis: true,
      responsive: ["lg" as const],
      render: (name: string | null) => name || <Text type="secondary">-</Text>,
    },
    {
      title: "金額",
      dataIndex: "ai_amount",
      key: "ai_amount",
      width: 110,
      responsive: ["sm" as const],
      render: (v: string | null) =>
        v ? (
          <Text style={{ fontWeight: 500, fontFamily: "monospace" }}>{v}</Text>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: "到期日",
      dataIndex: "ai_expiry_date",
      key: "ai_expiry_date",
      width: 110,
      responsive: ["sm" as const],
      render: (v: string | null) => v || <Text type="secondary">-</Text>,
    },
    {
      title: "狀態",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => <StatusBadge status={status} />,
    },
  ];

  const hasSelected = !!selectedDoc;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: "100%" }}>
      {/* ===== Header ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Tag color="#a55b2a" style={{ borderRadius: 4, fontWeight: 700, fontSize: 11, lineHeight: "20px", margin: 0 }}>
              TOMMY
            </Tag>
            <Text style={{ color: "#a55b2a", fontWeight: 600, fontSize: 13 }}>
              文件智能歸檔
            </Text>
          </div>
          <Title level={3} style={{ margin: 0, fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, color: "#1d2939" }}>
            掃描件分類、命名與關鍵資料提取
          </Title>
          <Text type="secondary" style={{ marginTop: 4, display: "block", fontSize: 14 }}>
            上傳文件後，系統會自動 OCR、分類、建議檔名，並在人工確認後完成歸檔。
          </Text>
        </div>
        <Space size={10} wrap>
          <Tooltip title="篩選、批量操作等更多功能">
            <Button
              icon={<FilterOutlined />}
              onClick={() => setMoreModalOpen(true)}
              style={{ borderRadius: 8, display: "inline-flex", alignItems: "center" }}
            >
              更多操作
            </Button>
          </Tooltip>
          <Upload
            customRequest={handleUpload}
            showUploadList={false}
            accept=".pdf,.png,.jpg,.jpeg,.bmp,.tiff"
            disabled={uploading}
          >
            <Button
              type="primary"
              icon={<UploadOutlined />}
              loading={uploading}
              size="large"
              style={{
                background: "linear-gradient(135deg, #23675f 0%, #2d8a7b 100%)",
                borderColor: "#23675f",
                borderRadius: 8,
                boxShadow: "0 2px 6px rgba(35, 103, 95, 0.3)",
                fontSize: 14,
                fontWeight: 600,
                height: 42,
              }}
            >
              上傳文件
            </Button>
          </Upload>
        </Space>
      </div>

      {/* ===== Stats Cards (responsive grid) ===== */}
      <Row gutter={[12, 12]}>
        <Col xs={12} sm={12} md={6}>
          <StatCard label="今日上傳" value={stats.todayUpload} icon={<UploadOutlined />} accentColor="#23675f" />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard label="待複核" value={stats.pending} icon={<ClockCircleOutlined />} accentColor="#d48806" />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard label="已歸檔" value={stats.archived} icon={<FolderOpenOutlined />} accentColor="#389e0d" />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard label="異常文件" value={stats.abnormal} icon={<ExclamationCircleOutlined />} accentColor="#cf1322" />
        </Col>
      </Row>

      {/* ===== Main Workspace ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 16,
        }}
        className="archive-workspace"
      >
        {/* Left: File Table */}
        <Card
          style={{ borderRadius: 12, border: "1px solid #e8e8e8", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          styles={{ body: { padding: 0 } }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 20px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Space size={8}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: "#23675f15",
                  display: "grid",
                  placeItems: "center",
                  color: "#23675f",
                }}
              >
                <FileTextOutlined style={{ fontSize: 14 }} />
              </div>
              <Text strong style={{ fontSize: 15 }}>
                文件列表
              </Text>
              <Tag
                style={{
                  borderRadius: 10,
                  background: "#f5f5f5",
                  border: "none",
                  fontWeight: 600,
                  marginLeft: 0,
                }}
              >
                {documents.length}
              </Tag>
            </Space>
            <Space size={12}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {stats.pending > 0 ? `${stats.pending} 份等待複核` : "全部已處理"}
              </Text>
              <Tooltip title="刷新列表">
                <Button
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={fetchDocuments}
                  loading={loading}
                  style={{ borderRadius: 6 }}
                />
              </Tooltip>
            </Space>
          </div>

          {documents.length === 0 && !loading ? (
            <EmptyState
              icon={<InboxOutlined />}
              title="暫無文件"
              description="點擊上方「上傳文件」按鈕開始使用"
            />
          ) : (
            <Table
              dataSource={documents}
              columns={columns}
              rowKey="id"
              loading={
                loading
                  ? { indicator: <Spin size="small" /> }
                  : undefined
              }
              pagination={documents.length > 10 ? { pageSize: 10, size: "small", showSizeChanger: false } : false}
              size="middle"
              locale={{ emptyText: <span /> }}
              onRow={(record) => ({
                onClick: () => fetchDocumentDetail(record.id),
                style: {
                  cursor: "pointer",
                  transition: "background 0.15s",
                  background: selectedDoc?.id === record.id ? "#e6f7f4" : undefined,
                },
              })}
              scroll={{ x: "max-content", y: 420 }}
            />
          )}
        </Card>

        {/* Right: Review Panel — full width on mobile, sidebar on desktop */}
        <div className="review-panel-wrapper">
          <ArchiveReviewPanel
            selectedDoc={selectedDoc}
            actionLoading={actionLoading}
            onUpdateDoc={setSelectedDoc}
            onConfirm={handleUpdateAndConfirm}
            onMarkAbnormal={handleMarkAbnormal}
            onOpenDetail={() => setDetailModalOpen(true)}
          />
        </div>
      </div>

      {/* ===== Modals ===== */}
      <ArchiveActionsModal
        open={moreModalOpen}
        filterStatus={filterStatus}
        onClose={() => setMoreModalOpen(false)}
        onFilterChange={setFilterStatus}
      />

      <ArchiveDetailModal
        open={detailModalOpen}
        doc={selectedDoc}
        onClose={() => setDetailModalOpen(false)}
      />

      {/* Responsive CSS */}
      <style>{`
        @media (min-width: 1024px) {
          .archive-workspace {
            grid-template-columns: 1fr minmax(420px, 480px) !important;
          }
        }
        .review-panel-wrapper {
          min-width: 0;
        }
      `}</style>
    </div>
  );
}
