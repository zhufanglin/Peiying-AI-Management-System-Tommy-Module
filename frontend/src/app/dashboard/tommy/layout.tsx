"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Layout,
  Menu,
  Typography,
  Avatar,
  Space,
  Badge,
  Button,
  Drawer,
  Tooltip,
} from "antd";
import {
  FileTextOutlined,
  HomeOutlined,
  BellOutlined,
  ScanOutlined,
  FolderOpenOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  ClockCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: "/dashboard/tommy/overview", icon: <HomeOutlined />, label: "總覽" },
  {
    key: "/dashboard/tommy/archive",
    icon: <FileTextOutlined />,
    label: "文件智能歸檔",
  },
  { key: "/dashboard/tommy/rent", icon: <BellOutlined />, label: "租務提醒" },
  {
    key: "/dashboard/tommy/scan",
    icon: <ScanOutlined />,
    label: "掃描件處理",
  },
  {
    key: "/dashboard/tommy/records",
    icon: <FolderOpenOutlined />,
    label: "歸檔記錄",
  },
  {
    key: "/dashboard/tommy/settings",
    icon: <SettingOutlined />,
    label: "個人設定",
  },
];

// Sidebar content extracted for reuse in both desktop Sider and mobile Drawer
function SidebarContent({
  pathname,
  onNavigate,
  collapsed,
}: {
  pathname: string;
  onNavigate: (path: string) => void;
  collapsed?: boolean;
}) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("zh-HK", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #0d1f24 0%, #102a2f 40%, #143840 100%)",
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: collapsed ? "24px 12px 18px" : "24px 20px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          textAlign: collapsed ? "center" : "left",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: collapsed ? 0 : 14,
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <div
            style={{
              width: collapsed ? 40 : 46,
              height: collapsed ? 40 : 46,
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, #2d8a7b 0%, #1a6b5e 100%)",
              color: "#fff",
              borderRadius: 10,
              fontWeight: 800,
              fontSize: collapsed ? 17 : 20,
              letterSpacing: 1,
              boxShadow: "0 2px 8px rgba(45, 138, 123, 0.3)",
              flexShrink: 0,
            }}
          >
            PY
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  color: "#e8f5f2",
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: 1.3,
                }}
              >
                培英 AI 行政平台
              </div>
              <Text style={{ color: "#8abad0", fontSize: 13, display: "block" }}>
                Tommy 專屬工作台
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, padding: collapsed ? "12px 8px" : "16px 12px", overflow: "auto" }}>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          onClick={({ key }) => onNavigate(key)}
          inlineCollapsed={collapsed}
          items={menuItems.map((item) => ({
            ...item,
            style: {
              borderRadius: 8,
              marginBottom: 3,
              height: collapsed ? 42 : 48,
              lineHeight: collapsed ? "42px" : "48px",
            },
          }))}
          style={{
            background: "transparent",
            borderInlineEnd: "none",
            fontSize: collapsed ? 14 : 15,
          }}
          theme="dark"
        />
      </div>

      {/* Footer identity */}
      {!collapsed && (
        <div
          style={{
            margin: "0 12px 8px",
            padding: 16,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            backdropFilter: "blur(4px)",
          }}
        >
          <Space align="center" size={12}>
            <Badge status="success" offset={[-2, 2]}>
              <Avatar
                size={38}
                icon={<UserOutlined />}
                style={{ background: "#2d8a7b" }}
              />
            </Badge>
            <div>
              <div style={{ color: "#e8f5f2", fontWeight: 600, fontSize: 14 }}>
                Tommy Wong
              </div>
              <div style={{ color: "#8abad0", fontSize: 12 }}>校務處 · 文件歸檔</div>
            </div>
          </Space>
          <div
            style={{
              marginTop: 12,
              paddingTop: 10,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Space size={6}>
              <ClockCircleOutlined style={{ color: "#8abad0", fontSize: 12 }} />
              <span style={{ color: "#8abad0", fontSize: 12 }}>{timeStr}</span>
            </Space>
            <LogoutOutlined
              style={{ color: "#8abad0", fontSize: 14, cursor: "pointer" }}
              onClick={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function TommyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/tablet
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleNavigate = useCallback(
    (path: string) => {
      router.push(path);
      if (isMobile) setMobileDrawerOpen(false);
    },
    [router, isMobile]
  );

  // Desktop sidebar width
  const siderWidth = collapsed ? 72 : 280;

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* ===== Desktop Sidebar ===== */}
      {!isMobile && (
        <Sider
          width={280}
          collapsedWidth={72}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          style={{
            background: "transparent",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
            overflow: "hidden",
            transition: "width 0.2s ease",
          }}
        >
          <SidebarContent
            pathname={pathname}
            onNavigate={handleNavigate}
            collapsed={collapsed}
          />
        </Sider>
      )}

      {/* ===== Mobile Header ===== */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            height: 56,
            background: "#102a2f",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
          role="banner"
        >
          <Space size={10}>
            <Button
              type="text"
              icon={<MenuUnfoldOutlined style={{ color: "#e8f5f2", fontSize: 20 }} />}
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="打開菜單"
              style={{ display: "flex", alignItems: "center" }}
            />
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #2d8a7b 0%, #1a6b5e 100%)",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              PY
            </div>
            <span style={{ color: "#e8f5f2", fontWeight: 600, fontSize: 15 }}>
              培英 AI 行政平台
            </span>
          </Space>
          <Badge status="success" dot>
            <Avatar
              size={30}
              icon={<UserOutlined />}
              style={{ background: "#2d8a7b", cursor: "pointer" }}
            />
          </Badge>
        </div>
      )}

      {/* ===== Mobile Drawer ===== */}
      {isMobile && (
        <Drawer
          placement="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          width={280}
          styles={{
            body: { padding: 0, overflow: "hidden" },
            mask: { background: "rgba(0,0,0,0.45)" },
          }}
          closeIcon={false}
        >
          <SidebarContent
            pathname={pathname}
            onNavigate={handleNavigate}
            collapsed={false}
          />
        </Drawer>
      )}

      {/* ===== Main Content ===== */}
      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 72 : siderWidth,
          marginTop: isMobile ? 56 : 0,
          transition: "margin-left 0.2s ease",
          background: "#f0f2f5",
          minHeight: "100vh",
        }}
      >
        <Content
          style={{
            padding: isMobile ? "16px" : "24px 32px",
            overflow: "auto",
            background: "#f0f2f5",
            minHeight: "calc(100vh - 56px)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
