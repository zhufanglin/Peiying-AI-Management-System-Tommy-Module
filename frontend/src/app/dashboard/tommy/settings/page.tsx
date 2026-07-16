"use client";

import React, { useState } from "react";
import {
  Typography,
  Card,
  Tag,
  Form,
  Input,
  Select,
  Button,
  Switch,
  Divider,
  Space,
  message,
  Avatar,
  Badge,
  Row,
  Col,
} from "antd";
import {
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  LockOutlined,
  FileTextOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      message.success("設定已保存");
    }, 800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Tag color="#a55b2a" style={{ borderRadius: 4, fontWeight: 700, fontSize: 11, lineHeight: "20px", margin: 0 }}>
            TOMMY
          </Tag>
          <Text style={{ color: "#a55b2a", fontWeight: 600, fontSize: 13 }}>
            個人設定
          </Text>
        </div>
        <Title level={3} style={{ margin: 0, fontSize: "clamp(18px, 2.5vw, 24px)" }}>
          帳戶偏好與系統設定
        </Title>
        <Text type="secondary" style={{ marginTop: 4, display: "block" }}>
          管理個人信息、通知偏好和系統選項。
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {/* Profile */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <UserOutlined style={{ color: "#23675f" }} />
                <span style={{ fontSize: 15, fontWeight: 600 }}>個人資料</span>
              </Space>
            }
            style={{ borderRadius: 12, border: "1px solid #e8e8e8", height: "100%" }}
            styles={{ header: { borderBottom: "1px solid #f0f0f0" } }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <Badge status="success" offset={[-4, 4]}>
                <Avatar size={64} icon={<UserOutlined />} style={{ background: "#2d8a7b" }} />
              </Badge>
              <div>
                <Text strong style={{ fontSize: 16, display: "block" }}>
                  Tommy Wong
                </Text>
                <Text type="secondary">校務處 · 文件歸檔</Text>
              </div>
            </div>

            <Form layout="vertical" size="middle">
              <Form.Item label="顯示名稱">
                <Input defaultValue="Tommy Wong" style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item label="電子郵件">
                <Input defaultValue="tommy@puiying.edu.hk" style={{ borderRadius: 8 }} />
              </Form.Item>
              <Form.Item label="語言">
                <Select
                  defaultValue="zh-HK"
                  style={{ borderRadius: 8 }}
                  options={[
                    { label: "繁體中文 (香港)", value: "zh-HK" },
                    { label: "简体中文", value: "zh-CN" },
                    { label: "English", value: "en" },
                  ]}
                />
              </Form.Item>
            </Form>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving} style={{ borderRadius: 8 }}>
              保存資料
            </Button>
          </Card>
        </Col>

        {/* Notifications & Security */}
        <Col xs={24} lg={12}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Notifications */}
            <Card
              title={
                <Space>
                  <BellOutlined style={{ color: "#d48806" }} />
                  <span style={{ fontSize: 15, fontWeight: 600 }}>通知偏好</span>
                </Space>
              }
              style={{ borderRadius: 12, border: "1px solid #e8e8e8" }}
              styles={{ header: { borderBottom: "1px solid #f0f0f0" } }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "OCR 完成通知", desc: "掃描件處理完成時提醒" },
                  { label: "AI 結果待確認", desc: "AI 分類結果需要人工審核時通知" },
                  { label: "租務到期提醒", desc: "租金到期前 7 天發送提醒" },
                  { label: "異常文件通知", desc: "文件處理異常時即時通知" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px solid #f5f5f5",
                    }}
                  >
                    <div>
                      <Text strong style={{ fontSize: 13, display: "block" }}>
                        {item.label}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {item.desc}
                      </Text>
                    </div>
                    <Switch defaultChecked size="small" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Security */}
            <Card
              title={
                <Space>
                  <LockOutlined style={{ color: "#23675f" }} />
                  <span style={{ fontSize: 15, fontWeight: 600 }}>安全設定</span>
                </Space>
              }
              style={{ borderRadius: 12, border: "1px solid #e8e8e8" }}
              styles={{ header: { borderBottom: "1px solid #f0f0f0" } }}
            >
              <Form layout="vertical" size="middle">
                <Form.Item label="當前密碼">
                  <Input.Password placeholder="請輸入當前密碼" style={{ borderRadius: 8 }} />
                </Form.Item>
                <Form.Item label="新密碼">
                  <Input.Password placeholder="請輸入新密碼" style={{ borderRadius: 8 }} />
                </Form.Item>
                <Form.Item label="確認新密碼">
                  <Input.Password placeholder="再次輸入新密碼" style={{ borderRadius: 8 }} />
                </Form.Item>
                <Button type="primary" icon={<LockOutlined />} onClick={handleSave} loading={saving} style={{ borderRadius: 8 }}>
                  更新密碼
                </Button>
              </Form>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
