"use client";

import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

interface FormSectionProps {
  label: string;
  source?: string;
  children: React.ReactNode;
  error?: string;
}

export default function FormSection({ label, source, children, error }: FormSectionProps) {
  return (
    <div>
      <label
        style={{
          fontWeight: 600,
          fontSize: 13,
          color: error ? "#cf1322" : "#262626",
          display: "block",
          marginBottom: 4,
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <Text type="danger" style={{ fontSize: 12, marginTop: 2, display: "block" }}>
          {error}
        </Text>
      )}
      {source && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginTop: 2,
          }}
        >
          <Text type="secondary" style={{ fontSize: 11 }}>
            {source}
          </Text>
        </div>
      )}
    </div>
  );
}
