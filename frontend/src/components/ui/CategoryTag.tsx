"use client";

import React from "react";
import { Tag, Typography } from "antd";

const { Text } = Typography;

export const CATEGORY_COLORS: Record<string, string> = {
  "財務": "#108ee9",
  "人事": "#7c3aed",
  "租務": "#d48806",
  "教育局通告": "#389e0d",
  "會議": "#eb2f96",
  "其他": "#8c8c8c",
};

export const CATEGORY_OPTIONS = [
  { label: "財務", value: "財務" },
  { label: "人事", value: "人事" },
  { label: "租務", value: "租務" },
  { label: "教育局通告", value: "教育局通告" },
  { label: "會議", value: "會議" },
  { label: "其他", value: "其他" },
];

interface CategoryTagProps {
  category: string | null;
}

export default function CategoryTag({ category }: CategoryTagProps) {
  if (!category) return <Text type="secondary">-</Text>;
  return (
    <Tag
      color={CATEGORY_COLORS[category] || "#8c8c8c"}
      style={{ borderRadius: 6, fontWeight: 600 }}
      aria-label={`分類：${category}`}
    >
      {category}
    </Tag>
  );
}
