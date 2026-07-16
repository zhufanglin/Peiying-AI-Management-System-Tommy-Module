"use client";

import React from "react";
import { Typography } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface FieldSourceProps {
  text: string;
}

export default function FieldSource({ text }: FieldSourceProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        marginTop: 2,
      }}
    >
      <FileSearchOutlined style={{ color: "#bfbfbf", fontSize: 11 }} />
      <Text type="secondary" style={{ fontSize: 11 }}>
        {text}
      </Text>
    </div>
  );
}
