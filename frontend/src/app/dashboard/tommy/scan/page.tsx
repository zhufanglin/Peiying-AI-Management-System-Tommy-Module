"use client";

import React, { useState } from "react";
import {
  Typography,
  Card,
  Button,
  Upload,
  Tag,
  Space,
  Progress,
  List,
  message,
  Spin,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  ScanOutlined,
  UploadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import EmptyState from "@/components/ui/EmptyState";

const { Title, Text } = Typography;

interface ScanJob {
  id: string;
  fileName: string;
  status: "pending" | "running" | "done" | "failed";
  progress: number;
  createdAt: string;
  result?: string;
}

export default function ScanPage() {
  const [scanJobs, setScanJobs] = useState<ScanJob[]>([
    { id: "1", fileName: "scan_20260716_001.pdf", status: "done", progress: 100, createdAt: "09:12", result: "OCR 完成，已識別 3 頁" },
    { id: "2", fileName: "scan_20260716_002.jpg", status: "running", progress: 65, createdAt: "09:30" },
    { id: "3", fileName: "scan_20260715_003.pdf", status: "failed", progress: 30, createdAt: "昨日 16:20" },
  ]);

  const handleUpload: UploadProps["customRequest"] = async ({ file, onSuccess, onError }) => {
    const newJob: ScanJob = {
      id: Date.now().toString(),
      fileName: (file as File).name,
      status: "running",
      progress: 0,
      createdAt: new Date().toLocaleTimeString("zh-HK", { hour: "2-digit", minute: "2-digit" }),
    };
    setScanJobs((prev) => [newJob, ...prev]);

    // Simulate progress
    const interval = setInterval(() => {
      setScanJobs((prev) =>
        prev.map((j) =>
          j.id === newJob.id
            ? { ...j, progress: Math.min(j.progress + 20, 100) }
            : j
        )
      );
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setScanJobs((prev) =>
        prev.map((j) =>
          j.id === newJob.id
            ? { ...j, status: "done", progress: 100, result: "OCR 完成，已識別 " + Math.floor(Math.random() * 5 + 1) + " 頁" }
            : j
        )
      );
      message.success(`「${(file as File).name}」OCR 處理完成`);
      onSuccess?.({});
    }, 3000);
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "done": return <CheckCircleOutlined style={{ color: "#389e0d" }} />;
      case "failed": return <CloseCircleOutlined style={{ color: "#cf1322" }} />;
      case "running": return <ClockCircleOutlined style={{ color: "#d48806" }} />;
      default: return <ClockCircleOutlined style={{ color: "#8c8c8c" }} />;
    }
  };

  const stats = {
    total: scanJobs.length,
    done: scanJobs.filter((j) => j.status === "done").length,
    running: scanJobs.filter((j) => j.status === "running").length,
    failed: scanJobs.filter((j) => j.status === "failed").length,
  };

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
              掃描件處理
            </Text>
          </div>
          <Title level={3} style={{ margin: 0, fontSize: "clamp(18px, 2.5vw, 24px)" }}>
            OCR 掃描與文字識別
          </Title>
          <Text type="secondary" style={{ marginTop: 4, display: "block" }}>
            上傳掃描件，系統自動進行光學字符識別（OCR）。
          </Text>
        </div>
        <Upload customRequest={handleUpload} showUploadList={false} accept=".pdf,.png,.jpg,.jpeg,.bmp,.tiff">
          <Button
            type="primary"
            icon={<UploadOutlined />}
            size="large"
            style={{
              background: "linear-gradient(135deg, #23675f 0%, #2d8a7b 100%)",
              borderColor: "#23675f",
              borderRadius: 8,
              boxShadow: "0 2px 6px rgba(35, 103, 95, 0.3)",
              height: 42,
              fontWeight: 600,
            }}
          >
            上傳掃描件
          </Button>
        </Upload>
      </div>

      {/* Stats */}
      <Row gutter={[12, 12]}>
        <Col xs={6}><Card styles={{ body: { padding: "12px 16px" } }} style={{ borderRadius: 10, border: "1px solid #e8e8e8" }}>
          <Statistic title="全部" value={stats.total} valueStyle={{ fontSize: 22, fontWeight: 700 }} />
        </Card></Col>
        <Col xs={6}><Card styles={{ body: { padding: "12px 16px" } }} style={{ borderRadius: 10, border: "1px solid #e8e8e8" }}>
          <Statistic title="已完成" value={stats.done} valueStyle={{ fontSize: 22, fontWeight: 700, color: "#389e0d" }} />
        </Card></Col>
        <Col xs={6}><Card styles={{ body: { padding: "12px 16px" } }} style={{ borderRadius: 10, border: "1px solid #e8e8e8" }}>
          <Statistic title="處理中" value={stats.running} valueStyle={{ fontSize: 22, fontWeight: 700, color: "#d48806" }} />
        </Card></Col>
        <Col xs={6}><Card styles={{ body: { padding: "12px 16px" } }} style={{ borderRadius: 10, border: "1px solid #e8e8e8" }}>
          <Statistic title="失敗" value={stats.failed} valueStyle={{ fontSize: 22, fontWeight: 700, color: "#cf1322" }} />
        </Card></Col>
      </Row>

      {/* Job list */}
      <Card
        title={
          <Space>
            <ScanOutlined style={{ color: "#23675f" }} />
            <span style={{ fontSize: 15, fontWeight: 600 }}>掃描任務</span>
          </Space>
        }
        extra={
          <Button size="small" icon={<ReloadOutlined />} onClick={() => setScanJobs([...scanJobs])} style={{ borderRadius: 6 }}>
            刷新
          </Button>
        }
        style={{ borderRadius: 12, border: "1px solid #e8e8e8" }}
        styles={{ header: { borderBottom: "1px solid #f0f0f0" } }}
      >
        {scanJobs.length === 0 ? (
          <EmptyState icon={<ScanOutlined />} title="暫無掃描任務" description="點擊「上傳掃描件」開始使用 OCR 服務。" />
        ) : (
          <List
            dataSource={scanJobs}
            renderItem={(job) => (
              <List.Item
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #f5f5f5",
                }}
                actions={[
                  job.status === "running" ? (
                    <Button size="small" type="link" disabled style={{ borderRadius: 6 }}>
                      處理中...
                    </Button>
                  ) : (
                    <Button size="small" type="link" icon={<HistoryOutlined />} style={{ borderRadius: 6 }}>
                      詳情
                    </Button>
                  ),
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: job.status === "done" ? "#f6ffed" : job.status === "failed" ? "#fff2f0" : "#fffbe6",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 18,
                      }}
                    >
                      {statusIcon(job.status)}
                    </div>
                  }
                  title={
                    <Space size={8}>
                      <FileTextOutlined style={{ color: "#8c8c8c" }} />
                      <Text strong>{job.fileName}</Text>
                      <Tag
                        color={job.status === "done" ? "success" : job.status === "failed" ? "error" : "processing"}
                        style={{ borderRadius: 8, fontSize: 11, margin: 0 }}
                      >
                        {job.status === "done" ? "完成" : job.status === "failed" ? "失敗" : "處理中"}
                      </Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <Space size={12}>
                        <Text type="secondary" style={{ fontSize: 12 }}>{job.createdAt}</Text>
                        {job.result && <Text type="secondary" style={{ fontSize: 12 }}>{job.result}</Text>}
                      </Space>
                      {job.status === "running" && (
                        <Progress
                          percent={job.progress}
                          strokeColor="#23675f"
                          size="small"
                          style={{ marginTop: 4, marginBottom: 0, maxWidth: 300 }}
                        />
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}
