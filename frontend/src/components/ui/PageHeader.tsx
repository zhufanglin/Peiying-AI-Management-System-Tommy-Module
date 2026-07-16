"use client";

import React from "react";
import { Typography, Tag, Space, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export interface PageHeaderAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

interface PageHeaderProps {
  module: string;
  moduleColor?: string;
  title: string;
  description?: string;
  actions?: PageHeaderAction[];
  secondaryActions?: PageHeaderAction[];
}

export default function PageHeader({
  module,
  moduleColor = "#a55b2a",
  title,
  description,
  actions = [],
  secondaryActions = [],
}: PageHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        {/* Breadcrumb / Module indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <Tag
            color={moduleColor}
            style={{
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 11,
              padding: "0 6px",
              lineHeight: "20px",
            }}
          >
            {module.toUpperCase()}
          </Tag>
          <Text
            style={{
              color: moduleColor,
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {module}
          </Text>
        </div>
        <Title
          level={3}
          style={{
            margin: 0,
            fontSize: "clamp(20px, 2.5vw, 26px)",
            fontWeight: 700,
            color: "#1d2939",
            lineHeight: 1.3,
          }}
        >
          {title}
        </Title>
        {description && (
          <Text
            type="secondary"
            style={{
              marginTop: 4,
              display: "block",
              fontSize: "clamp(13px, 1.2vw, 14px)",
              maxWidth: 600,
            }}
          >
            {description}
          </Text>
        )}
      </div>

      {/* Primary actions */}
      {(actions.length > 0 || secondaryActions.length > 0) && (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexShrink: 0,
            flexWrap: "wrap",
          }}
        >
          {secondaryActions.length > 0 && (
            <div className="secondary-actions">
              {secondaryActions.map((action) => (
                <Button
                  key={action.key}
                  icon={action.icon || <FilterOutlined />}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  loading={action.loading}
                  style={{ borderRadius: 8, display: "flex", alignItems: "center" }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
          {actions.map((action) => (
            <Button
              key={action.key}
              type={action.type === "primary" ? "primary" : "default"}
              icon={action.icon}
              onClick={action.onClick}
              loading={action.loading}
              disabled={action.disabled}
              size="large"
              style={
                action.type === "primary"
                  ? {
                      background: "linear-gradient(135deg, #23675f 0%, #2d8a7b 100%)",
                      borderColor: "#23675f",
                      borderRadius: 8,
                      boxShadow: "0 2px 6px rgba(35, 103, 95, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      fontSize: 14,
                      fontWeight: 600,
                      height: 42,
                    }
                  : { borderRadius: 8, height: 42, fontSize: 14 }
              }
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .secondary-actions {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
