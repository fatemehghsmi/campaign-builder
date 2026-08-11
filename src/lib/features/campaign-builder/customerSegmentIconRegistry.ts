import {
  BadgeCheck,
  Circle,
  Gem,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import type {
  CustomerSegment,
} from "./customerSegments";


interface SegmentIconDefinition {
  icon: LucideIcon;
  className: string;
  strokeWidth: number;
}


export const segmentIconRegistry: Partial<
  Record<
    CustomerSegment["icon"],
    SegmentIconDefinition
  >
> = {
  users: {
    icon: UsersRound,
    className:
      "size-8 text-text-muted",
    strokeWidth: 1.7,
  },

  bronze: {
    icon: BadgeCheck,
    className:
      "size-8 fill-[#DEA78F] text-[#9A4E2D]",
    strokeWidth: 1.7,
  },

  silver: {
    icon: BadgeCheck,
    className:
      "size-8 fill-[#B6B6B7] text-[#646366]",
    strokeWidth: 1.7,
  },

  gold: {
    icon: BadgeCheck,
    className:
      "size-8 fill-[#FFC76E] text-[#C97C00]",
    strokeWidth: 1.7,
  },

  diamond: {
    icon: Gem,
    className:
      "size-8 fill-[#6ECFFF] text-[#0086C9]",
    strokeWidth: 1.7,
  },

  loyal: {
    icon: Circle,
    className:
      "size-8 fill-[#D4E8FF] text-[#A9D2FF]",
    strokeWidth: 2,
  },

  potential: {
    icon: Circle,
    className:
      "size-8 fill-[#D1F4FA] text-[#A2E8F6]",
    strokeWidth: 2,
  },
};


export const defaultSegmentIcon:
  SegmentIconDefinition = {
    icon: Circle,
    className:
      "size-8 fill-[#FFF1C9] text-[#FFE292]",
    strokeWidth: 2,
  };