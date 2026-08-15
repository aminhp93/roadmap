export interface ScheduleTimeSlot {
  id: string;
  timeRange: string;
  title: string;
  category: "fitness" | "work" | "backend" | "dropship" | "rest";
  durationMinutes: number;
  description: string;
  roadmapId?: string;
  matchedNodeTitle?: string;
  defaultChecked?: boolean;
}

export const DAILY_TIME_SLOTS: ScheduleTimeSlot[] = [
  {
    id: "slot-fitness",
    timeRange: "06:30 - 07:00",
    title: "🏃 Tập thể dục (30 phút)",
    category: "fitness",
    durationMinutes: 30,
    description: "Chạy bộ nhẹ, cardio hoặc workout 30 phút rèn luyện thể lực.",
  },
  {
    id: "slot-commute-morning",
    timeRange: "07:00 - 08:30",
    title: "☕ Ăn sáng & Di chuyển",
    category: "rest",
    durationMinutes: 90,
    description: "Vệ sinh cá nhân, ăn sáng lành mạnh và di chuyển tới công ty.",
  },
  {
    id: "slot-corporate-work",
    timeRange: "08:30 - 17:30",
    title: "🏢 Đi làm (Công việc cố định)",
    category: "work",
    durationMinutes: 540,
    description: "Khung giờ làm việc công ty cố định (9 tiếng bao gồm nghỉ trưa).",
    defaultChecked: true,
  },
  {
    id: "slot-commute-evening",
    timeRange: "17:30 - 19:30",
    title: "🚗 Di chuyển về nhà & Ăn tối",
    category: "rest",
    durationMinutes: 120,
    description: "Di chuyển về nhà, tắm rửa, ăn tối và thư giãn ngắn cùng gia đình.",
  },
  {
    id: "slot-backend-node",
    timeRange: "19:30 - 20:30",
    title: "⚡ Backend/Core (1h): Code trực tiếp đóng 1 Gap-Item",
    category: "backend",
    durationMinutes: 60,
    description: "Code thẳng vào todo-app / dự án Core để đóng 1 gap-item cụ thể trong gap-analysis.md (P1-P11: test, migration, Redis cache, pino logging, helmet...). Video Tips JS chỉ xem cuối tuần, không chiếm slot này.",
    roadmapId: "core",
    matchedNodeTitle: "Gap Items (P1-P11) — xem gap-analysis.md",
  },
  {
    id: "slot-dropship-research",
    timeRange: "20:30 - 21:30",
    title: "🛒 Dropship Part 1 (1h): Nghiên cứu thị trường & Niche Research",
    category: "dropship",
    durationMinutes: 60,
    description: "Tìm kiếm sản phẩm Evergreen, soi đối thủ, tính toán Unit Economics 3x COGS & kiểm tra Supplier SLA < 7-10 ngày.",
    roadmapId: "dropshipping-plan",
    matchedNodeTitle: "Month 1: Niche Research, Supplier Vetting & Financial Rules",
  },
  {
    id: "slot-dropship-store",
    timeRange: "21:30 - 22:30",
    title: "🛒 Dropship Part 2 (1h): Thiết lập & Tối ưu Store",
    category: "dropship",
    durationMinutes: 60,
    description: "Tối ưu giao diện Shopify/Woo, thiết kế GIF mô tả sản phẩm, cài đặt Stripe/PayPal, chính sách legal & Trust badges.",
    roadmapId: "dropshipping-plan",
    matchedNodeTitle: "Month 2: High-Converting Store Setup & Trust Building",
  },
  {
    id: "slot-daily-review",
    timeRange: "22:30 - 23:00",
    title: "📝 Tổng kết ngày & Chuẩn bị nghỉ ngơi",
    category: "rest",
    durationMinutes: 30,
    description: "Review checklist trong ngày, log vào Daily Task Logger (gán Gap-Item ID cụ thể) & chuẩn bị đi ngủ trước 23:30. Chủ Nhật là ngày nghỉ — không log Backend/Dropship.",
  },
];

/**
 * IDs of slots that observe the weekly rest day (Sunday). Fitness and the
 * final review stay every day; the two growth tracks (Backend, Dropship)
 * pause on Sunday to avoid 6-month burnout with zero days off.
 */
export const REST_DAY_EXEMPT_SLOT_IDS = ["slot-backend-node", "slot-dropship-research", "slot-dropship-store"];

/**
 * Generate dates array from startDate to endDate (YYYY-MM-DD)
 */
export function generateDateRange(startDateStr: string, endDateStr: string): string[] {
  const dates: string[] = [];
  const curr = new Date(startDateStr);
  const end = new Date(endDateStr);

  while (curr <= end) {
    dates.push(curr.toISOString().split("T")[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

/**
 * Generate iCal (.ics) file string for the full Aug 1, 2026 - Jan 31, 2027
 * schedule (matches the 6-month dropship goal). Job runs weekdays only;
 * Backend/Dropship pause on Sunday (rest day) — see REST_DAY_EXEMPT_SLOT_IDS.
 */
export function generateICSCalendarContent(): string {
  const events = [
    {
      summary: "🏃 Tập thể dục (30 phút)",
      startTime: "063000",
      endTime: "070000",
      description: "Tập thể dục 30p rèn luyện thể lực hàng ngày",
      byDay: "MO,TU,WE,TH,FR,SA,SU",
    },
    {
      summary: "🏢 Đi làm (Khung giờ cố định)",
      startTime: "083000",
      endTime: "173000",
      description: "Công việc cố định công ty (chỉ ngày trong tuần)",
      byDay: "MO,TU,WE,TH,FR",
    },
    {
      summary: "⚡ Backend/Core (1h) - Đóng Gap-Item",
      startTime: "193000",
      endTime: "203000",
      description: "Code trực tiếp đóng 1 gap-item trong gap-analysis.md (P1-P11). Nghỉ Chủ Nhật.",
      byDay: "MO,TU,WE,TH,FR,SA",
    },
    {
      summary: "🛒 Dropship Part 1 (1h) - Niche Research",
      startTime: "203000",
      endTime: "213000",
      description: "1h Nghiên cứu thị trường & Niche Research Dropshipping. Nghỉ Chủ Nhật.",
      byDay: "MO,TU,WE,TH,FR,SA",
    },
    {
      summary: "🛒 Dropship Part 2 (1h) - Store Setup",
      startTime: "213000",
      endTime: "223000",
      description: "1h Xây dựng & Tối ưu Shopify/Woo Store. Nghỉ Chủ Nhật.",
      byDay: "MO,TU,WE,TH,FR,SA",
    },
  ];

  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//RoadmapViz//Daily Schedule 2026//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Lịch Trình Hàng Ngày (Aug 2026 - Jan 2027)
X-WR-TIMEZONE:Asia/Ho_Chi_Minh
`;

  // Repeat weekly (per-event BYDAY) from Aug 1, 2026 to Jan 31, 2027
  events.forEach((evt, idx) => {
    ics += `BEGIN:VEVENT
UID:daily-routine-${idx}@roadmapviz
DTSTAMP:20260801T000000Z
DTSTART;TZID=Asia/Ho_Chi_Minh:20260801T${evt.startTime}
DTEND;TZID=Asia/Ho_Chi_Minh:20260801T${evt.endTime}
RRULE:FREQ=WEEKLY;BYDAY=${evt.byDay};UNTIL=20270131T235959Z
SUMMARY:${evt.summary}
DESCRIPTION:${evt.description}
STATUS:CONFIRMED
END:VEVENT
`;
  });

  ics += `END:VCALENDAR`;
  return ics;
}

/**
 * Generate Google Calendar Add Event Template Link
 */
export function getGoogleCalendarLink(title: string, startTime: string, endTime: string, details: string): string {
  const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const text = encodeURIComponent(title);
  const detailsEnc = encodeURIComponent(details);
  const dates = `20260801T${startTime.replace(":", "")}00/20260801T${endTime.replace(":", "")}00`;
  const recur = encodeURIComponent("RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR,SA;UNTIL=20270131T235959Z");
  return `${baseUrl}&text=${text}&details=${detailsEnc}&dates=${dates}&recur=${recur}`;
}
