"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Card,
  Table,
  Tag,
  Button,
  Space,
  Tooltip,
  message,
  Spin,
  DatePicker,
  Select,
} from "antd";
import {
  FolderOpenOutlined,
  FileTextOutlined,
  SearchOutlined,
  ExportOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  HistoryOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import EmptyState from "@/components/ui/EmptyState";

const { Title, Text } = Typography;
const API_BASE = "http://localhost:8000/api";

interface ArchiveRecord {
  id: number;
  file_name: string;
  ai_category: string | null;
  ai_suggested_name: string | null;
  ai_amount: string | null;
  ai_expiry_date: string | null;
  status: string;
  uploaded_at: string;
  archived_at: string | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  財務: "#108ee9",
  人事: "#7c3aed",
  租務: "#d48806",
  教育局通告: "#389e0d",
  會議: "#eb2f96",
};

export default function RecordsPage() {
  const [records, setRecords] = useState<ArchiveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const url = filterStatus
        ? `${API_BASE}/documents?status=${filterStatus}`
        : `${API_BASE}/documents`;
      const res = await fetch(url);
      const json = await res.json();
      setRecords(json.data || []);
    } catch {
      message.error("獲取歸檔記錄失敗");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const columns: ColumnsType<ArchiveRecord> = [
    {
      title: "文件名",
      dataIndex: "file_name",
      key: "file_name",
      ellipsis: true,
      render: (name: string) => (
        <Space size={6}>
          <FileTextOutlined style={{ color: "#8c8c8c" }} />
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: "分類",
      dataIndex: "ai_category",
      key: "ai_category",
      width: 120,
      responsive: ["md" as const],
      render: (cat: string | null) =>
        cat ? (
          <Tag color={CATEGORY_COLORS[cat] || "#8c8c8c"} style={{ borderRadius: 6, fontWeight: 600 }}>
            {cat}
          </Tag>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: "歸檔名稱",
      dataIndex: "ai_suggested_name",
      key: "ai_suggested_name",
      ellipsis: true,
      responsive: ["lg" as const],
    },
    {
      title: "金額",
      dataIndex: "ai_amount",
      key: "ai_amount",
      width: 110,
      responsive: ["sm" as const],
    },
    {
      title: "上傳時間",
      dataIndex: "uploaded_at",
      key: "uploaded_at",
      width: 160,
      responsive: ["sm" as const],
      render: (t: string) => new Date(t).toLocaleString("zh-HK"),
    },
    {
      title: "狀態",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (s: string) => {
        const cfg: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
          pending: { color: "warning", text: "待複核", icon: <ClockCircleOutlined /> },
          archived: { color: "success", text: "已歸檔", icon: <CheckCircleOutlined /> },
          abnormal: { color: "error", text: "異常", icon: <ExclamationCircleOutlined /> },
        };
        return (
          <Tag color={cfg[s]?.color} style={{ borderRadius: 16, fontWeight: 600, margin: 0 }}>
            {cfg[s]?.text}
          </Tag>
        );
      },
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Tag color="#a55b2a" style={{ borderRadius: 4, fontWeight: 700, fontSize: 11, lineHeight: "20px", margin: 0 }}>
              TOMMY
            </Tag>
            <Text style={{ color: "#a55b2a", fontWeight: 600, fontSize: 13 }}>
              歸檔記錄
            </Text>
          </div>
          <Title level={3} style={{ margin: 0, fontSize: "clamp(18px, 2.5vw, 24px)" }}>
            查閱歷史歸檔記錄
          </Title>
          <Text type="secondary" style={{ marginTop: 4, display: "block" }}>
            瀏覽所有已處理文件的歸檔歷史。
          </Text>
        </div>
        <Space size={10} wrap>
          <Select
            value={filterStatus || "all"}
            size="middle"
            onChange={(val) => setFilterStatus(val === "all" ? undefined : val)}
            style={{ width: 130, borderRadius: 8 }}
            options={[
              { label: "全部狀態", value: "all" },
              { label: "待複核", value: "pending" },
              { label: "已歸檔", value: "archived" },
              { label: "異常", value: "abnormal" },
            ]}
          />
          <Button icon={<ExportOutlined />} style={{ borderRadius: 8 }}>
            導出
          </Button>
        </Space>
      </div>

      {/* Records table */}
      <Card
        style={{ borderRadius: 12, border: "1px solid #e8e8e8", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          dataSource={records}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 15, size: "small", showSizeChanger: false }}
          size="middle"
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: (
              <EmptyState
                icon={<FolderOpenOutlined />}
                title="暫無歸檔記錄"
                description="上傳文件並完成歸檔後，記錄將顯示在此處。"
              />
            ),
          }}
        />
      </Card>
    </div>
  );
}
