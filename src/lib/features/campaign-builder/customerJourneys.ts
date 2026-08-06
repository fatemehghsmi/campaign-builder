export interface CustomerJourney {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const customerJourneys = [
  {
    id: "journey-business",
    title: "سفر مشتری",
    description: "سفر مشتری را انتخاب کنید",
    icon: "💼",
  },
  {
    id: "journey-health",
    title: "سفر مشتری",
    description: "سفر مشتری را انتخاب کنید",
    icon: "🩹",
  },
  {
    id: "journey-camera",
    title: "سفر مشتری",
    description: "سفر مشتری را انتخاب کنید",
    icon: "📷",
  },
  {
    id: "journey-cleaning",
    title: "سفر مشتری",
    description: "سفر مشتری را انتخاب کنید",
    icon: "🧹",
  },
  {
    id: "journey-writing",
    title: "سفر مشتری",
    description: "سفر مشتری را انتخاب کنید",
    icon: "✏️",
  },
  {
    id: "journey-vip",
    title: "سفر مشتری",
    description: "سفر مشتری را انتخاب کنید",
    icon: "👑",
  },
  {
    id: "journey-chair",
    title: "سفر مشتری",
    description: "سفر مشتری را انتخاب کنید",
    icon: "🪑",
  },
  {
    id: "journey-diamond",
    title: "سفر مشتری",
    description: "سفر مشتری را انتخاب کنید",
    icon: "💎",
  },
] satisfies readonly CustomerJourney[];