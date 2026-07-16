"use client";

import React from "react";
import { Card, Typography } from "antd";

const { Text } = Typography;

export interface StatItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  accentColor: string;
}

interface StatCardProps {
  item: StatItem;
}

export default function StatCard({ item }: StatCardProps) {
  return (
    <Card
      hoverable
      styles={{ body: { padding: "16px 20px" } }}
      style={{
        borderRadius: 12,
        border: "none",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        overflow: "hidden",
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      className="stat-card"
    >
      {/* Accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: `linear-gradient(180deg, ${item.accentColor}88, ${item.accentColor})`,
          borderRadius: "0 2px 2px 0",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
            {item.label}
          </Text>
          <div
            style={{
              fontSize: "clamp(24px, 3vw, 30px)",
              fontWeight: 700,
              color: item.accentColor,
              marginTop: 4,
              lineHeight: 1.2,
            }}
          >
            {item.value}
          </div>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            display: "grid",
            placeItems: "center",
            background: `${item.accentColor}15`,
            color: item.accentColor,
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {item.icon}
        </div>
      </div>
      <style>{`
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </Card>
  );
}

interface StatsGridProps {
  items: StatItem[];
  columns?: number;
}

export function StatsGrid({ items, columns = 4 }: StatsGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.min(columns, items.length)}, minmax(120px, 1fr))`,
        gap: 16,
      }}
      className="stats-grid"
    >
      {items.map((item, idx) => (
        <StatCard key={idx} item={item} />
      ))}
      <style>{`
        @media (max-width: 900px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
