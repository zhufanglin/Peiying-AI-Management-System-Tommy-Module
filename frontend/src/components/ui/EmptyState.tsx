"use client";

import React from "react";
import { Typography, Button } from "antd";

const { Text } = Typography;

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-label={title}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        color: "#8c8c8c",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        style={{
          fontSize: 48,
          marginBottom: 16,
          opacity: 0.35,
          transition: "opacity 0.3s, transform 0.3s",
        }}
        className="empty-state-icon"
      >
        {icon}
      </div>
      <Text strong style={{ color: "#595959", fontSize: 15, marginBottom: 6 }}>
        {title}
      </Text>
      {description && (
        <Text
          type="secondary"
          style={{
            fontSize: 13,
            textAlign: "center",
            maxWidth: 320,
            lineHeight: 1.5,
          }}
        >
          {description}
        </Text>
      )}
      {action && (
        <Button
          type="primary"
          onClick={action.onClick}
          style={{ marginTop: 16, borderRadius: 8 }}
        >
          {action.label}
        </Button>
      )}
      <style>{`
        .empty-state-icon:hover {
          opacity: 0.6 !important;
          transform: scale(1.05);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
