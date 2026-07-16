"use client";

import React, { useState } from "react";
import { Modal, Typography, Input, Select, Button, Space, Divider, message } from "antd";
import {
  EllipsisOutlined,
  SearchOutlined,
  FilterOutlined,
  ScanOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { CATEGORY_OPTIONS } from "./types";

const { Text } = Typography;

interface ArchiveActionsModalProps {
  open: boolean;
  filterStatus: string | undefined;
  onClose: () => void;
  onFilterChange: (status: string | undefined) => void;
}

export default function ArchiveActionsModal({
  open,
  filterStatus,
  onClose,
  onFilterChange,
}: ArchiveActionsModalProps) {
  const [searchText, setSearchText] = useState("");

  return (
    <Modal
      title={
        <Space size={8}>
          <EllipsisOutlined />
          <span>更多操作</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
      styles={{
        mask: { background: "rgba(0,0,0,0.35)" },
        body: { paddingTop: 12 },
      }}
    >
      <Text type="secondary" style={{ display: "block", marginBottom: 16, fontSize: 13 }}>
        不常用功能收在這裡，保持主界面乾淨整潔。
      </Text>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Search */}
        <div>
          <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>
            搜尋文件
          </label>
          <Input
            placeholder="輸入文件名、分類、金額或日期..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            size="middle"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>
              分類篩選
            </label>
            <Select
              style={{ width: "100%" }}
              placeholder="全部分類"
              size="middle"
              options={[{ label: "全部分類", value: "" }, ...CATEGORY_OPTIONS]}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>
              狀態篩選
            </label>
            <Select
              style={{ width: "100%" }}
              value={filterStatus || "all"}
              size="middle"
              onChange={(val) => {
                onFilterChange(val === "all" ? undefined : val);
                onClose();
                message.success("篩選已套用");
              }}
              options={[
                { label: "全部狀態", value: "all" },
                { label: "待複核", value: "pending" },
                { label: "已歸檔", value: "archived" },
                { label: "異常", value: "abnormal" },
              ]}
            />
          </div>
        </div>

        <Divider style={{ margin: "4px 0" }} />

        {/* Batch Actions */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={onClose}
            style={{
              borderRadius: 8,
              background: "#23675f",
              borderColor: "#23675f",
            }}
          >
            套用篩選
          </Button>
          <Button
            icon={<ScanOutlined />}
            onClick={() => {
              message.success("已創建批量 OCR 任務，結果將進入待複核列表");
              onClose();
            }}
            style={{ borderRadius: 8 }}
          >
            批量運行 OCR
          </Button>
          <Button
            icon={<ExportOutlined />}
            onClick={() => {
              message.info("導出功能（Demo）");
              onClose();
            }}
            style={{ borderRadius: 8 }}
          >
            導出清單
          </Button>
        </div>
      </div>
    </Modal>
  );
}
