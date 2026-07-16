"use client";

import React from "react";
import { Modal, Typography, Space, Divider } from "antd";
import {
  HistoryOutlined,
  UploadOutlined,
  ScanOutlined,
  FileSearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { STATUS_CONFIG } from "./types";
import type { ArchiveDocument } from "./types";

const { Text } = Typography;

interface ArchiveDetailModalProps {
  open: boolean;
  doc: ArchiveDocument | null;
  onClose: () => void;
}

const auditIcons: Record<string, React.ReactNode> = {
  archived: <CheckCircleOutlined />,
  abnormal: <CloseCircleOutlined />,
  pending: <ClockCircleOutlined />,
};

export default function ArchiveDetailModal({ open, doc, onClose }: ArchiveDetailModalProps) {
  return (
    <Modal
      title={
        <Space size={8}>
          <HistoryOutlined />
          <span>文件詳情與審計記錄</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      destroyOnClose
      styles={{
        mask: { background: "rgba(0,0,0,0.35)" },
        body: { paddingTop: 16 },
      }}
    >
      {doc ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Summary */}
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>
              摘要
            </label>
            <div
              style={{
                padding: 10,
                background: "#f8f9fb",
                borderRadius: 8,
                border: "1px solid #f0f0f0",
                fontSize: 13,
                color: "#434343",
                lineHeight: 1.6,
              }}
            >
              {doc.ai_suggested_name ||
                `${doc.ai_category || "未分類"}文件 - ${doc.file_name}`}
            </div>
          </div>

          {/* AI Results Grid */}
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 8 }}>
              AI 識別結果
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 8,
              }}
            >
              {[
                { label: "分類", value: doc.ai_category },
                { label: "建議檔名", value: doc.ai_suggested_name },
                { label: "金額", value: doc.ai_amount || "-" },
                { label: "到期日", value: doc.ai_expiry_date || "-" },
                {
                  label: "信心度",
                  value: doc.ai_confidence ? `${Math.round(doc.ai_confidence * 100)}%` : "-",
                },
                {
                  label: "狀態",
                  value: STATUS_CONFIG[doc.status]?.text || doc.status,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: "6px 10px",
                    background: "#fafafa",
                    borderRadius: 6,
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
                    {item.label}
                  </Text>
                  <Text style={{ fontSize: 13, fontWeight: 500 }}>{item.value}</Text>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Log */}
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 8 }}>
              審計記錄
            </label>
            <div
              style={{
                background: "#fafafa",
                borderRadius: 8,
                border: "1px solid #f0f0f0",
                padding: 12,
              }}
            >
              {[
                {
                  time: new Date(doc.uploaded_at).toLocaleTimeString("zh-HK"),
                  text: `${doc.file_name} 上傳`,
                  icon: <UploadOutlined />,
                },
                {
                  time: "—",
                  text: "OCR Worker 完成文字識別",
                  icon: <ScanOutlined />,
                },
                {
                  time: "—",
                  text: `AI Worker 建議分類為「${doc.ai_category || "未知"}」`,
                  icon: <FileSearchOutlined />,
                },
                {
                  time: "—",
                  text:
                    doc.status === "archived"
                      ? "Tommy 已確認歸檔"
                      : doc.status === "abnormal"
                      ? "Tommy 標記為異常"
                      : "等待 Tommy 人工確認",
                  icon: auditIcons[doc.status] || <ClockCircleOutlined />,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "6px 0",
                    borderBottom: idx < 3 ? "1px solid #f0f0f0" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: "#f0f0f0",
                      display: "grid",
                      placeItems: "center",
                      color: "#8c8c8c",
                      fontSize: 12,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13 }}>{item.text}</Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {item.time}
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
