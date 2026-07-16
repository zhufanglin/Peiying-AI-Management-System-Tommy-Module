"use client";

import React, { useState } from "react";
import {
  Typography,
  Card,
  Table,
  Tag,
  Button,
  Space,
  Progress,
  Modal,
  Descriptions,
  Tooltip,
  message,
  DatePicker,
} from "antd";
import {
  BellOutlined,
  HomeOutlined,
  DollarOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import EmptyState from "@/components/ui/EmptyState";

const { Title, Text } = Typography;

// Mock rental data
interface RentalContract {
  id: number;
  property: string;
  unit: string;
  tenant: string;
  monthlyRent: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  contactPhone: string;
  daysUntilDue: number;
}

const mockRentals: RentalContract[] = [
  { id: 1, property: "俊傑花園", unit: "A座 8樓 B室", tenant: "陳先生", monthlyRent: 18500, dueDate: "2026-07-31", status: "pending", contactPhone: "6123-4567", daysUntilDue: 15 },
  { id: 2, property: "冠華大廈", unit: "3樓 C室", tenant: "李女士", monthlyRent: 12000, dueDate: "2026-07-25", status: "pending", contactPhone: "6234-5678", daysUntilDue: 9 },
  { id: 3, property: "美景花園", unit: "12座 6樓 A室", tenant: "張先生", monthlyRent: 22000, dueDate: "2026-07-20", status: "overdue", contactPhone: "6345-6789", daysUntilDue: -4 },
  { id: 4, property: "海悅豪園", unit: "B座 15樓 D室", tenant: "王小姐", monthlyRent: 15800, dueDate: "2026-07-10", status: "paid", contactPhone: "6456-7890", daysUntilDue: -6 },
  { id: 5, property: "翠怡花園", unit: "9座 2樓 E室", tenant: "劉先生", monthlyRent: 13500, dueDate: "2026-08-05", status: "pending", contactPhone: "6567-8901", daysUntilDue: 20 },
];

const columns = [
  {
    title: "物業",
    dataIndex: "property",
    key: "property",
    render: (p: string, r: RentalContract) => (
      <Space>
        <HomeOutlined style={{ color: "#23675f" }} />
        <span>
          {p} / {r.unit}
        </span>
      </Space>
    ),
  },
  {
    title: "租戶",
    dataIndex: "tenant",
    key: "tenant",
    responsive: ["sm" as const],
  },
  {
    title: "月租",
    dataIndex: "monthlyRent",
    key: "monthlyRent",
    render: (v: number) => (
      <Text style={{ fontWeight: 600, fontFamily: "monospace" }}>
        HK$ {v.toLocaleString()}
      </Text>
    ),
  },
  {
    title: "到期日",
    dataIndex: "dueDate",
    key: "dueDate",
    responsive: ["sm" as const],
    render: (d: string, r: RentalContract) => (
      <Space size={4}>
        <CalendarOutlined style={{ color: "#8c8c8c" }} />
        <span>{d}</span>
      </Space>
    ),
  },
  {
    title: "剩餘天數",
    dataIndex: "daysUntilDue",
    key: "daysUntilDue",
    render: (d: number) => {
      if (d < 0) return <Tag color="error">逾期 {Math.abs(d)} 天</Tag>;
      if (d <= 7) return <Tag color="warning">{d} 天</Tag>;
      return <Tag>{d} 天</Tag>;
    },
  },
  {
    title: "狀態",
    dataIndex: "status",
    key: "status",
    render: (s: string) => {
      const cfg: Record<string, { color: string; text: string }> = {
        paid: { color: "success", text: "已繳" },
        pending: { color: "warning", text: "待繳" },
        overdue: { color: "error", text: "逾期" },
      };
      return <Tag color={cfg[s]?.color}>{cfg[s]?.text}</Tag>;
    },
  },
  {
    title: "操作",
    key: "actions",
    render: (_: unknown, r: RentalContract) => (
      <Space size={4}>
        <Tooltip title={`致電 ${r.tenant}`}>
          <Button size="small" icon={<PhoneOutlined />} shape="circle" type="text" />
        </Tooltip>
        <Tooltip title="發送提醒">
          <Button size="small" icon={<MailOutlined />} shape="circle" type="text" />
        </Tooltip>
      </Space>
    ),
  },
];

export default function RentPage() {
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<RentalContract | null>(null);

  const totalRent = mockRentals.reduce((sum, r) => sum + r.monthlyRent, 0);
  const pendingRent = mockRentals
    .filter((r) => r.status !== "paid")
    .reduce((sum, r) => sum + r.monthlyRent, 0);
  const overdueCount = mockRentals.filter((r) => r.status === "overdue").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Tag color="#a55b2a" style={{ borderRadius: 4, fontWeight: 700, fontSize: 11, lineHeight: "20px", margin: 0 }}>
            TOMMY
          </Tag>
          <Text style={{ color: "#a55b2a", fontWeight: 600, fontSize: 13 }}>
            租務提醒
          </Text>
        </div>
        <Title level={3} style={{ margin: 0, fontSize: "clamp(18px, 2.5vw, 24px)" }}>
          租金到期的提醒與追蹤
        </Title>
        <Text type="secondary" style={{ marginTop: 4, display: "block" }}>
          管理 8 住宅 + 9 車位租約，追蹤繳費狀態與逾期提醒。
        </Text>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        <Card styles={{ body: { padding: "14px 18px" } }} style={{ borderRadius: 10, border: "1px solid #e8e8e8" }}>
          <Space>
            <DollarOutlined style={{ color: "#23675f", fontSize: 20 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 12, display: "block" }}>本月租金總額</Text>
              <Text strong style={{ fontSize: 20, color: "#23675f" }}>
                HK$ {totalRent.toLocaleString()}
              </Text>
            </div>
          </Space>
        </Card>
        <Card styles={{ body: { padding: "14px 18px" } }} style={{ borderRadius: 10, border: "1px solid #e8e8e8" }}>
          <Space>
            <WarningOutlined style={{ color: "#d48806", fontSize: 20 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 12, display: "block" }}>待收租金</Text>
              <Text strong style={{ fontSize: 20, color: "#d48806" }}>
                HK$ {pendingRent.toLocaleString()}
              </Text>
            </div>
          </Space>
        </Card>
        <Card styles={{ body: { padding: "14px 18px" } }} style={{ borderRadius: 10, border: "1px solid #e8e8e8" }}>
          <Space>
            <ExclamationCircleOutlined style={{ color: "#cf1322", fontSize: 20 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 12, display: "block" }}>逾期合約</Text>
              <Text strong style={{ fontSize: 20, color: "#cf1322" }}>
                {overdueCount} 份
              </Text>
            </div>
          </Space>
        </Card>
        <Card styles={{ body: { padding: "14px 18px" } }} style={{ borderRadius: 10, border: "1px solid #e8e8e8" }}>
          <Space>
            <CheckCircleOutlined style={{ color: "#389e0d", fontSize: 20 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 12, display: "block" }}>已繳</Text>
              <Text strong style={{ fontSize: 20, color: "#389e0d" }}>
                {mockRentals.filter((r) => r.status === "paid").length} 份
              </Text>
            </div>
          </Space>
        </Card>
      </div>

      {/* Rental table */}
      <Card
        style={{ borderRadius: 12, border: "1px solid #e8e8e8", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          dataSource={mockRentals}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="middle"
          onRow={(record) => ({
            onClick: () => {
              setSelectedRental(record);
              setDetailOpen(true);
            },
            style: { cursor: "pointer" },
          })}
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: (
              <EmptyState icon={<BellOutlined />} title="暫無租務記錄" description="所有租金已繳清，暫無待提醒項目。" />
            ),
          }}
        />
      </Card>

      {/* Detail modal */}
      <Modal
        title={
          <Space>
            <HomeOutlined />
            <span>租約詳情</span>
          </Space>
        }
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width={520}
        styles={{ mask: { background: "rgba(0,0,0,0.35)" } }}
      >
        {selectedRental && (
          <Descriptions column={1} size="small" bordered style={{ marginTop: 12 }}>
            <Descriptions.Item label="物業">{selectedRental.property}</Descriptions.Item>
            <Descriptions.Item label="單位">{selectedRental.unit}</Descriptions.Item>
            <Descriptions.Item label="租戶">{selectedRental.tenant}</Descriptions.Item>
            <Descriptions.Item label="月租">
              HK$ {selectedRental.monthlyRent.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="到期日">{selectedRental.dueDate}</Descriptions.Item>
            <Descriptions.Item label="聯絡電話">{selectedRental.contactPhone}</Descriptions.Item>
            <Descriptions.Item label="狀態">
              <Tag
                color={
                  selectedRental.status === "paid"
                    ? "success"
                    : selectedRental.status === "overdue"
                    ? "error"
                    : "warning"
                }
              >
                {selectedRental.status === "paid" ? "已繳" : selectedRental.status === "overdue" ? "逾期" : "待繳"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
