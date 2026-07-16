/** Archive document type shared across components */
export interface ArchiveDocument {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  ai_category: string | null;
  ai_suggested_name: string | null;
  ai_amount: string | null;
  ai_expiry_date: string | null;
  ai_confidence: number | null;
  ocr_text: string | null;
  status: string;
  user_confirmed_name: string | null;
  user_confirmed_category: string | null;
  user_confirmed_amount: string | null;
  user_confirmed_expiry_date: string | null;
  remark: string | null;
  uploaded_at: string;
  archived_at: string | null;
}

export const STATUS_CONFIG: Record<
  string,
  { color: string; text: string; tagColor: string }
> = {
  pending: { color: "#d48806", text: "待複核", tagColor: "warning" },
  archived: { color: "#389e0d", text: "已歸檔", tagColor: "success" },
  abnormal: { color: "#cf1322", text: "異常", tagColor: "error" },
};

export const CATEGORY_COLORS: Record<string, string> = {
  財務: "#108ee9",
  人事: "#7c3aed",
  租務: "#d48806",
  教育局通告: "#389e0d",
  會議: "#eb2f96",
  其他: "#8c8c8c",
};

export const CATEGORY_OPTIONS = [
  { label: "財務", value: "財務" },
  { label: "人事", value: "人事" },
  { label: "租務", value: "租務" },
  { label: "教育局通告", value: "教育局通告" },
  { label: "會議", value: "會議" },
  { label: "其他", value: "其他" },
];
