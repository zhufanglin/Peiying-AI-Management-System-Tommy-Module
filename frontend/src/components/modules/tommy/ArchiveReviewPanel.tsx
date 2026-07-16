"use client";

import React from "react";
import {
  Card,
  Typography,
  Button,
  Select,
  Input,
  Tag,
  Space,
  Divider,
  Tooltip,
  Empty,
} from "antd";
import {
  FileTextOutlined,
  FileSearchOutlined,
  ScanOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  UploadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import ConfidenceBar from "@/components/ui/ConfidenceBar";
import FieldSource from "@/components/ui/FieldSource";
import type { ArchiveDocument } from "./types";

const { Text } = Typography;
const { TextArea } = Input;

const CATEGORY_OPTIONS = [
  { label: "財務", value: "財務" },
  { label: "人事", value: "人事" },
  { label: "租務", value: "租務" },
  { label: "教育局通告", value: "教育局通告" },
  { label: "會議", value: "會議" },
  { label: "其他", value: "其他" },
];

interface ArchiveReviewPanelProps {
  selectedDoc: ArchiveDocument | null;
  actionLoading: boolean;
  onUpdateDoc: (doc: ArchiveDocument) => void;
  onConfirm: () => void;
  onMarkAbnormal: () => void;
  onOpenDetail: () => void;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
    pending: { color: "warning", text: "待複核", icon: <ClockCircleOutlined /> },
    archived: { color: "success", text: "已歸檔", icon: <CheckCircleOutlined /> },
    abnormal: { color: "error", text: "異常", icon: <CloseCircleOutlined /> },
  };
  const cfg = config[status];
  if (!cfg) return null;
  return (
    <Tag color={cfg.color} style={{ borderRadius: 16, fontWeight: 600, margin: 0 }}>
      <Space size={4}>
        {cfg.icon}
        <span>{cfg.text}</span>
      </Space>
    </Tag>
  );
}

const fileTypeIcon = (type: string) => {
  const isPdf = type === "pdf";
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 8,
        background: isPdf ? "#ff4d4f15" : "#108ee915",
        display: "grid",
        placeItems: "center",
        fontSize: 24,
        color: isPdf ? "#ff4d4f" : "#108ee9",
        flexShrink: 0,
      }}
    >
      <FileTextOutlined />
    </div>
  );
};

export default function ArchiveReviewPanel({
  selectedDoc,
  actionLoading,
  onUpdateDoc,
  onConfirm,
  onMarkAbnormal,
  onOpenDetail,
}: ArchiveReviewPanelProps) {
  const hasSelected = !!selectedDoc;
  const selectedStatus = selectedDoc?.status;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* ===== OCR Preview Panel ===== */}
      <Card
        style={{
          borderRadius: 12,
          border: "1px solid #e8e8e8",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
        styles={{ body: { padding: 16 } }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Space size={8}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: "#23675f15",
                display: "grid",
                placeItems: "center",
                color: "#23675f",
              }}
            >
              <FileSearchOutlined style={{ fontSize: 12 }} />
            </div>
            <Text strong style={{ fontSize: 14 }}>
              文件預覽 / OCR 原文
            </Text>
          </Space>
          {hasSelected && <StatusBadge status={selectedDoc!.status} />}
        </div>

        {hasSelected ? (
          <>
            {/* File info */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginBottom: 12,
                padding: 12,
                background: "#fafafa",
                borderRadius: 8,
                border: "1px solid #f0f0f0",
              }}
            >
              {fileTypeIcon(selectedDoc!.file_type)}
              <div style={{ minWidth: 0 }}>
                <Text strong style={{ fontSize: 13, display: "block" }}>
                  {selectedDoc!.file_name}
                </Text>
                <Space size={12} style={{ marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {(selectedDoc!.file_size / 1024).toFixed(1)} KB
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {selectedDoc!.file_type.toUpperCase()}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(selectedDoc!.uploaded_at).toLocaleString("zh-HK")}
                  </Text>
                </Space>
              </div>
            </div>

            {/* OCR text */}
            <div
              style={{
                border: "1px solid #e8e8e8",
                background: "#f8f9fb",
                borderRadius: 8,
                padding: 12,
                maxHeight: 140,
                overflow: "auto",
                whiteSpace: "pre-wrap",
                fontSize: 13,
                color: "#434343",
                lineHeight: 1.6,
                fontFamily: "monospace",
              }}
            >
              {selectedDoc!.ocr_text || (
                <Text type="secondary">（暫無 OCR 結果）</Text>
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px 24px",
              color: "#8c8c8c",
            }}
          >
            <FileSearchOutlined style={{ fontSize: 40, opacity: 0.35, marginBottom: 12 }} />
            <Text strong style={{ color: "#595959" }}>
              選擇一份文件
            </Text>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4 }}>
              從左側文件列表中點選查看詳情
            </Text>
          </div>
        )}
      </Card>

      {/* ===== AI Classification Panel ===== */}
      <Card
        style={{
          borderRadius: 12,
          border: "1px solid #e8e8e8",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
        styles={{ body: { padding: 16 } }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Space size={8}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: "#a55b2a15",
                display: "grid",
                placeItems: "center",
                color: "#a55b2a",
              }}
            >
              <ScanOutlined style={{ fontSize: 12 }} />
            </div>
            <Text strong style={{ fontSize: 14 }}>
              AI 分類結果確認
            </Text>
          </Space>
          <Button
            size="small"
            icon={<HistoryOutlined />}
            onClick={onOpenDetail}
            disabled={!hasSelected}
            style={{ borderRadius: 6, fontSize: 12 }}
          >
            詳情
          </Button>
        </div>

        {hasSelected ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Confidence banner */}
            <div
              style={{
                padding: "10px 12px",
                border: "1px solid #fff1b8",
                background: "linear-gradient(135deg, #fffbe6 0%, #fff7e6 100%)",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <Space size={6}>
                  <ScanOutlined style={{ color: "#d48806", fontSize: 14 }} />
                  <Text strong style={{ color: "#874d00", fontSize: 13 }}>
                    AI 識別信心
                  </Text>
                </Space>
                <Tag
                  color={
                    (selectedDoc!.ai_confidence ?? 0) >= 0.7
                      ? "success"
                      : (selectedDoc!.ai_confidence ?? 0) >= 0.4
                      ? "warning"
                      : "error"
                  }
                  style={{ borderRadius: 8, fontSize: 11, fontWeight: 600, margin: 0 }}
                >
                  {(selectedDoc!.ai_confidence ?? 0) >= 0.7
                    ? "高"
                    : (selectedDoc!.ai_confidence ?? 0) >= 0.4
                    ? "中"
                    : "低"}
                </Tag>
              </div>
              <ConfidenceBar confidence={selectedDoc!.ai_confidence} />
              <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: "block" }}>
                請確認下方信息無誤後再執行歸檔。
              </Text>
            </div>

            {/* Form Fields */}
            <div>
              <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 4 }}>
                分類
              </label>
              <Select
                value={selectedDoc!.user_confirmed_category || selectedDoc!.ai_category}
                onChange={(val) =>
                  onUpdateDoc({ ...selectedDoc!, user_confirmed_category: val })
                }
                style={{ width: "100%" }}
                options={CATEGORY_OPTIONS}
                size="middle"
              />
              <FieldSource text="來源：AI 分類識別" />
            </div>

            <div>
              <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 4 }}>
                建議檔名
              </label>
              <Input
                value={selectedDoc!.user_confirmed_name || selectedDoc!.ai_suggested_name || ""}
                onChange={(e) =>
                  onUpdateDoc({ ...selectedDoc!, user_confirmed_name: e.target.value })
                }
                placeholder="YYYY-MM-DD_類別_標題"
                size="middle"
              />
              <FieldSource text="格式：YYYY-MM-DD_類別_標題" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 4 }}>
                  金額
                </label>
                <Input
                  value={selectedDoc!.user_confirmed_amount || selectedDoc!.ai_amount || ""}
                  onChange={(e) =>
                    onUpdateDoc({ ...selectedDoc!, user_confirmed_amount: e.target.value })
                  }
                  placeholder="HK$"
                  size="middle"
                  prefix="HK$"
                />
                <FieldSource text="來源：OCR 金額抽取" />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 4 }}>
                  到期日
                </label>
                <Input
                  type="date"
                  value={selectedDoc!.user_confirmed_expiry_date || selectedDoc!.ai_expiry_date || ""}
                  onChange={(e) =>
                    onUpdateDoc({
                      ...selectedDoc!,
                      user_confirmed_expiry_date: e.target.value,
                    })
                  }
                  size="middle"
                />
                <FieldSource text="來源：OCR 日期抽取" />
              </div>
            </div>

            <Divider style={{ margin: "4px 0" }} />

            {/* Actions */}
            {selectedStatus === "pending" ? (
              <div style={{ display: "flex", gap: 8 }}>
                <Button
                  type="primary"
                  onClick={onConfirm}
                  loading={actionLoading}
                  icon={<CheckCircleOutlined />}
                  style={{
                    flex: 1,
                    background: "linear-gradient(135deg, #23675f 0%, #2d8a7b 100%)",
                    borderColor: "#23675f",
                    borderRadius: 8,
                    height: 38,
                    fontWeight: 600,
                    boxShadow: "0 2px 6px rgba(35, 103, 95, 0.25)",
                  }}
                >
                  確認並歸檔
                </Button>
                <Tooltip title="標記為異常，稍後人工處理">
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={onMarkAbnormal}
                    loading={actionLoading}
                    style={{ borderRadius: 8, height: 38 }}
                  >
                    異常
                  </Button>
                </Tooltip>
              </div>
            ) : (
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: selectedStatus === "archived" ? "#f6ffed" : "#fff2f0",
                  border: `1px solid ${selectedStatus === "archived" ? "#b7eb8f" : "#ffccc7"}`,
                  textAlign: "center",
                }}
              >
                <Space>
                  {selectedStatus === "archived" ? (
                    <>
                      <CheckCircleOutlined style={{ color: "#389e0d" }} />
                      <Text style={{ color: "#389e0d", fontWeight: 600 }}>
                        已於{" "}
                        {selectedDoc!.archived_at
                          ? new Date(selectedDoc!.archived_at).toLocaleString("zh-HK")
                          : ""}{" "}
                        完成歸檔
                      </Text>
                    </>
                  ) : (
                    <>
                      <CloseCircleOutlined style={{ color: "#cf1322" }} />
                      <Text style={{ color: "#cf1322", fontWeight: 600 }}>
                        已標記為異常
                      </Text>
                    </>
                  )}
                </Space>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "32px 24px",
              color: "#8c8c8c",
            }}
          >
            <ScanOutlined style={{ fontSize: 40, opacity: 0.35, marginBottom: 12 }} />
            <Text strong style={{ color: "#595959" }}>
              暫無 AI 結果
            </Text>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4 }}>
              從左側選擇文件查看 AI 分析
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
}
