"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Tag,
  Space,
  Spin,
  Statistic,
  Progress,
  Timeline,
  List,
  Badge,
  Button,
} from "antd";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  FolderOpenOutlined,
  ExclamationCircleOutlined,
  BellOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ScanOutlined,
  InboxOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/ui/EmptyState";

const { Title, Text } = Typography;
const API_BASE = "http://localhost:8000/api";

interface DocSummary {
  id: number;
  file_name: string;
  ai_category: string | null;
  status: string;
  uploaded_at: string;
}

export default function TommyOverviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);
  const [pendingDocs, setPendingDocs] = useState<DocSummary[]>([]);
  const [archivedCount, setArchivedCount] = useState(0);
  const [abnormalCount, setAbnormalCount] = useState(0);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/documents`);
      const json = await res.json();
      const docs: DocSummary[] = json.data || [];

      const now = new Date();
      setTodayCount(
        docs.filter(
          (d) => new Date(d.uploaded_at).toDateString() === now.toDateString()
        ).length
      );
      setPendingDocs(docs.filter((d) => d.status === "pending").slice(0, 5));
      setArchivedCount(docs.filter((d) => d.status === "archived").length);
      setAbnormalCount(docs.filter((d) => d.status === "abnormal").length);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 300,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const totalDocs = todayCount + pendingDocs.length + archivedCount + abnormalCount;
  const reviewProgress = totalDocs > 0
    ? Math.round(((archivedCount) / totalDocs) * 100)
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Tag color="#a55b2a" style={{ borderRadius: 4, fontWeight: 700, fontSize: 11, lineHeight: "20px", margin: 0 }}>
            TOMMY
          </Tag>
          <Text style={{ color: "#a55b2a", fontWeight: 600, fontSize: 13 }}>
            總覽
          </Text>
        </div>
        <Title level={3} style={{ margin: 0, fontSize: "clamp(18px, 2.5vw, 24px)", color: "#1d2939" }}>
          早安，Tommy
        </Title>
        <Text type="secondary" style={{ marginTop: 4, display: "block", fontSize: 14 }}>
          以下是今日的工作摘要，快速掌握待處理事項。
        </Text>
      </div>

      {/* Stats row */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card
            hoverable
            onClick={() => router.push("/dashboard/tommy/archive")}
            styles={{ body: { padding: "18px 20px" } }}
            style={{ borderRadius: 12, border: "1px solid #e8e8e8", cursor: "pointer" }}
          >
            <Statistic
              title={<span style={{ fontSize: 13, color: "#667085" }}>今日上傳</span>}
              value={todayCount}
              prefix={<InboxOutlined style={{ color: "#23675f", marginRight: 4 }} />}
              valueStyle={{ color: "#23675f", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            hoverable
            onClick={() => router.push("/dashboard/tommy/archive")}
            styles={{ body: { padding: "18px 20px" } }}
            style={{ borderRadius: 12, border: "1px solid #e8e8e8", cursor: "pointer" }}
          >
            <Statistic
              title={<span style={{ fontSize: 13, color: "#667085" }}>待複核</span>}
              value={pendingDocs.length}
              prefix={<ClockCircleOutlined style={{ color: "#d48806", marginRight: 4 }} />}
              valueStyle={{ color: "#d48806", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            styles={{ body: { padding: "18px 20px" } }}
            style={{ borderRadius: 12, border: "1px solid #e8e8e8" }}
          >
            <Statistic
              title={<span style={{ fontSize: 13, color: "#667085" }}>已歸檔</span>}
              value={archivedCount}
              prefix={<FolderOpenOutlined style={{ color: "#389e0d", marginRight: 4 }} />}
              valueStyle={{ color: "#389e0d", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            styles={{ body: { padding: "18px 20px" } }}
            style={{ borderRadius: 12, border: "1px solid #e8e8e8" }}
          >
            <Statistic
              title={<span style={{ fontSize: 13, color: "#667085" }}>異常文件</span>}
              value={abnormalCount}
              prefix={<ExclamationCircleOutlined style={{ color: "#cf1322", marginRight: 4 }} />}
              valueStyle={{ color: "#cf1322", fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Progress & pending list */}
      <Row gutter={[16, 16]}>
        {/* Progress */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <CheckCircleOutlined style={{ color: "#23675f" }} />
                <span style={{ fontSize: 15, fontWeight: 600 }}>處理進度</span>
              </Space>
            }
            style={{ borderRadius: 12, border: "1px solid #e8e8e8", height: "100%" }}
            styles={{ header: { borderBottom: "1px solid #f0f0f0" } }}
          >
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <Progress
                type="dashboard"
                percent={reviewProgress}
                strokeColor={{
                  "0%": "#23675f",
                  "100%": "#2d8a7b",
                }}
                size={140}
              />
              <div style={{ marginTop: 12 }}>
                <Text strong style={{ fontSize: 16 }}>
                  歸檔完成率
                </Text>
              </div>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {archivedCount} / {totalDocs} 份文件
              </Text>
            </div>
          </Card>
        </Col>

        {/* Pending items */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined style={{ color: "#d48806" }} />
                <span style={{ fontSize: 15, fontWeight: 600 }}>待複核文件</span>
                {pendingDocs.length > 0 && (
                  <Tag color="warning" style={{ borderRadius: 10, fontWeight: 600 }}>
                    {pendingDocs.length}
                  </Tag>
                )}
              </Space>
            }
            extra={
              pendingDocs.length > 0 && (
                <Button
                  type="link"
                  icon={<ArrowRightOutlined />}
                  onClick={() => router.push("/dashboard/tommy/archive")}
                >
                  前往歸檔
                </Button>
              )
            }
            style={{ borderRadius: 12, border: "1px solid #e8e8e8", height: "100%" }}
            styles={{ header: { borderBottom: "1px solid #f0f0f0" } }}
          >
            {pendingDocs.length === 0 ? (
              <EmptyState
                icon={<CheckCircleOutlined />}
                title="全部已處理"
                description="所有文件已完成歸檔或標記，暫無待複核項目。"
              />
            ) : (
              <List
                dataSource={pendingDocs}
                renderItem={(doc) => (
                  <List.Item
                    style={{
                      cursor: "pointer",
                      padding: "10px 0",
                      borderBottom: "1px solid #f5f5f5",
                    }}
                    onClick={() => router.push("/dashboard/tommy/archive")}
                  >
                    <List.Item.Meta
                      avatar={
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: "#fff7e6",
                            display: "grid",
                            placeItems: "center",
                            color: "#d48806",
                          }}
                        >
                          <FileTextOutlined />
                        </div>
                      }
                      title={
                        <Text strong style={{ fontSize: 13 }}>
                          {doc.file_name}
                        </Text>
                      }
                      description={
                        <Space size={12}>
                          {doc.ai_category && (
                            <Tag
                              style={{ borderRadius: 4, fontSize: 11, margin: 0 }}
                            >
                              {doc.ai_category}
                            </Tag>
                          )}
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {new Date(doc.uploaded_at).toLocaleString("zh-HK")}
                          </Text>
                        </Space>
                      }
                    />
                    <Badge status="warning" text="待複核" />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Quick actions */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <Space>
                <BellOutlined style={{ color: "#23675f" }} />
                <span style={{ fontSize: 15, fontWeight: 600 }}>快捷操作</span>
              </Space>
            }
            style={{ borderRadius: 12, border: "1px solid #e8e8e8" }}
            styles={{ header: { borderBottom: "1px solid #f0f0f0" } }}
          >
            <Row gutter={[12, 12]}>
              {[
                {
                  icon: <ScanOutlined />,
                  label: "掃描文件",
                  desc: "上傳並自動 OCR",
                  path: "/dashboard/tommy/archive",
                  color: "#23675f",
                },
                {
                  icon: <BellOutlined />,
                  label: "租務提醒",
                  desc: "查看到期租金",
                  path: "/dashboard/tommy/rent",
                  color: "#d48806",
                },
                {
                  icon: <CalendarOutlined />,
                  label: "歸檔記錄",
                  desc: "查閱歷史歸檔",
                  path: "/dashboard/tommy/records",
                  color: "#389e0d",
                },
              ].map((item) => (
                <Col xs={24} sm={8} key={item.label}>
                  <Card
                    hoverable
                    onClick={() => router.push(item.path)}
                    styles={{ body: { padding: "16px 20px" } }}
                    style={{
                      borderRadius: 10,
                      border: "1px solid #f0f0f0",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: `${item.color}12`,
                        display: "grid",
                        placeItems: "center",
                        color: item.color,
                        fontSize: 22,
                        margin: "0 auto 10px",
                      }}
                    >
                      {item.icon}
                    </div>
                    <Text strong style={{ display: "block", fontSize: 14 }}>
                      {item.label}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.desc}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
