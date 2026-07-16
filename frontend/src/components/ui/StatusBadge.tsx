"use client";

import React from "react";
import { Tag, Space } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

export type StatusType = "pending" | "archived" | "abnormal" | "running" | "confirmed";

export interface StatusConfig {
  color: string;
  text: string;
  icon: React.ReactNode;
  tagColor: string;
}

export const STATUS_CONFIG: Record<StatusType, StatusConfig> = {
  pending: {
    color: "#d48806",
    text: "待複核",
    icon: <ClockCircleOutlined />,
    tagColor: "warning",
  },
  archived: {
    color: "#389e0d",
    text: "已歸檔",
    icon: <CheckCircleOutlined />,
    tagColor: "success",
  },
  abnormal: {
    color: "#cf1322",
    text: "異常",
    icon: <CloseCircleOutlined />,
    tagColor: "error",
  },
  running: {
    color: "#155eef",
    text: "處理中",
    icon: <LoadingOutlined />,
    tagColor: "processing",
  },
  confirmed: {
    color: "#389e0d",
    text: "已確認",
    icon: <CheckCircleOutlined />,
    tagColor: "success",
  },
};

interface StatusBadgeProps {
  status: StatusType | string;
  size?: "small" | "default";
}

export default function StatusBadge({ status, size = "default" }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status as StatusType];
  if (!cfg) return null;
  const isSmall = size === "small";

  return (
    <Tag
      color={cfg.tagColor}
      style={{
        borderRadius: 16,
        padding: isSmall ? "1px 8px" : "2px 10px",
        fontSize: isSmall ? 11 : 12,
        fontWeight: 600,
        margin: 0,
        lineHeight: isSmall ? "20px" : "22px",
      }}
      aria-label={`狀態：${cfg.text}`}
    >
      <Space size={4}>
        {cfg.icon}
        <span>{cfg.text}</span>
      </Space>
    </Tag>
  );
}
