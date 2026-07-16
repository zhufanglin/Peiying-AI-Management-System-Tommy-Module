import random
from datetime import datetime, timedelta


MOCK_CATEGORIES = ["財務", "人事", "租務", "教育局通告", "會議", "其他"]

MOCK_NAMES_BY_CATEGORY = {
    "財務": "財務_{title}",
    "人事": "人事_{title}",
    "租務": "租務_{title}",
    "教育局通告": "教育局通告_{title}",
    "會議": "會議_{title}",
    "其他": "其他_{title}",
}

MOCK_TITLES = {
    "財務": ["維修費收據", "採購報價單", "水電費單", "活動經費申請"],
    "人事": ["請假申請表", "員工資料更新", "面試評分表", "培訓記錄"],
    "租務": ["俊傑花園租金通知", "旺角鋪位租約", "校舍租用協議"],
    "教育局通告": ["暑期安全指引", "新學年校曆", "教師專業發展通函"],
    "會議": ["校務會議記錄", "科主任會議摘要", "家長教師會會議"],
    "其他": ["一般備忘錄", "活動宣傳單張", "外部來函"],
}

MOCK_AMOUNTS = {
    "財務": ["HK$ 2,300", "HK$ 15,000", "HK$ 880", "HK$ 45,000"],
    "租務": ["HK$ 18,500", "HK$ 12,000", "HK$ 25,000"],
}


def generate_mock_ai_result(file_name: str) -> dict:
    """根据文件名生成模拟的 AI 识别结果"""
    today = datetime.now()
    year = today.year
    month = today.month
    day = today.day

    # 随机选择分类
    category = random.choice(MOCK_CATEGORIES)

    # 根据分类生成标题
    titles = MOCK_TITLES.get(category, ["一般文件"])
    title = random.choice(titles)

    # 生成建议文件名
    suggested_name = f"{year:04d}-{month:02d}-{day:02d}_{category}_{title}.pdf"

    # 生成金额（仅财务和租务）
    amount = None
    if category in MOCK_AMOUNTS:
        amount = random.choice(MOCK_AMOUNTS[category])

    # 生成到期日（50% 概率）
    expiry_date = None
    if random.random() > 0.5:
        days_ahead = random.randint(7, 60)
        expiry = today + timedelta(days=days_ahead)
        expiry_date = expiry.strftime("%Y-%m-%d")

    # 置信度
    confidence = round(random.uniform(0.6, 0.95), 2)

    # 模拟 OCR 文本
    ocr_text = _generate_mock_ocr(category, title, amount, expiry_date)

    return {
        "ocr_text": ocr_text,
        "ai_category": category,
        "ai_suggested_name": suggested_name,
        "ai_amount": amount,
        "ai_expiry_date": expiry_date,
        "ai_confidence": confidence,
    }


def _generate_mock_ocr(category: str, title: str, amount: str | None, expiry: str | None) -> str:
    """生成模拟的 OCR 文本"""
    lines = [f"{category}文件：{title}", ""]

    if category == "租務":
        lines.extend([
            "單位：A座 8樓 B室",
            "租戶：陳先生",
            f"月份：{datetime.now().strftime('%Y年%m月')}",
        ])
        if amount:
            lines.append(f"金額：{amount}")
        if expiry:
            lines.append(f"繳付限期：{expiry}")
        lines.extend(["", "請於限期前完成繳付，並保留付款證明。"])

    elif category == "財務":
        if amount:
            lines.append(f"總計：{amount}")
        lines.append(f"日期：{datetime.now().strftime('%Y-%m-%d')}")
        if expiry:
            lines.append(f"到期日：{expiry}")
        lines.extend(["", f"此為{title}文件，請核對後簽署確認。"])

    elif category == "教育局通告":
        lines.extend([
            f"發出日期：{datetime.now().strftime('%Y-%m-%d')}",
            f"主題：{title}",
            "",
            "請各校留意上述指引，並按時跟進。",
        ])
        if expiry:
            lines.append(f"截止日期：{expiry}")

    else:
        lines.extend([
            f"文件標題：{title}",
            f"處理日期：{datetime.now().strftime('%Y-%m-%d')}",
            "",
            "此為自動識別結果，請人工確認。",
        ])

    return "\n".join(lines)
