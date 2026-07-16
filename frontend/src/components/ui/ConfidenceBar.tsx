"use client";

import React from "react";
import { Progress, Typography } from "antd";

const { Text } = Typography;

interface ConfidenceBarProps {
  confidence: number | null;
}

export default function ConfidenceBar({ confidence }: ConfidenceBarProps) {
  if (confidence === null || confidence === undefined) {
    return (
      <Text type="secondary" style={{ fontSize: 12 }}>
        暫無信心度
      </Text>
    );
  }

  const pct = Math.round(confidence * 100);
  const color = pct >= 80 ? "#389e0d" : pct >= 60 ? "#d48806" : "#cf1322";

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Progress
        percent={pct}
        strokeColor={color}
        showInfo={false}
        size="small"
        style={{ flex: 1, marginBottom: 0 }}
      />
      <Text
        style={{
          color,
          fontWeight: 600,
          fontSize: 13,
          whiteSpace: "nowrap",
        }}
      >
        {pct}%
      </Text>
    </div>
  );
}
