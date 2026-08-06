export type CustomerSegmentIcon =
  | "users"
  | "bronze"
  | "silver"
  | "gold"
  | "diamond"
  | "loyal"
  | "potential"
  | "attention";

export interface CustomerSegment {
  id: string;
  title: string;
  customerCount: number;
  icon: CustomerSegmentIcon;
  featured: boolean;
}

export const customerSegments = [
  {
    id: "all-customers",
    title: "همه مشتریان",
    customerCount: 12000,
    icon: "users",
    featured: false,
  },
  {
    id: "bronze-level",
    title: "سطح برنزی",
    customerCount: 1200,
    icon: "bronze",
    featured: true,
  },
  {
    id: "silver-level",
    title: "سطح نقره‌ای",
    customerCount: 1200,
    icon: "silver",
    featured: true,
  },
  {
    id: "loyal-customers",
    title: "وفاداران",
    customerCount: 1200,
    icon: "loyal",
    featured: true,
  },
  {
    id: "diamond-level",
    title: "سطح الماس",
    customerCount: 1200,
    icon: "diamond",
    featured: true,
  },
  {
    id: "gold-level",
    title: "سطح طلایی",
    customerCount: 1200,
    icon: "gold",
    featured: true,
  },
  {
    id: "potential-loyal-customers",
    title: "وفاداران بالقوه",
    customerCount: 1200,
    icon: "potential",
    featured: true,
  },
  {
    id: "needs-attention",
    title: "نیازمند توجه",
    customerCount: 1200,
    icon: "attention",
    featured: true,
  },
] satisfies readonly CustomerSegment[];