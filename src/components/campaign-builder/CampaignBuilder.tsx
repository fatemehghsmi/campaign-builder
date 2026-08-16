"use client";

import type { CSSProperties } from "react";
import { ChevronLeft } from "lucide-react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import {
  selectCurrentStep,
  type CampaignStep,
} from "@/lib/features/campaign-builder/campaignBuilderSlice";

import { useAppSelector } from "@/lib/hooks";

import CampaignStepsSidebar, {
  type CampaignStepDefinition,
} from "./CampaignStepsSidebar";

import {
  CampaignInformationIcon,
  CustomerSegmentIcon,
  InvoiceDetailsIcon,
  JourneyIcon,
  MessageStepIcon,
  ScheduleIcon,
} from "./campaignStepIcons";

import CampaignInformationStep from "./steps/CampaignInformationStep";
import CampaignSummaryStep from "./steps/CampaignSummaryStep";
import CustomerSegmentSelectionStep from "./steps/CustomerSegmentSelectionStep";
import EntryMessageStep from "./steps/EntryMessageStep/EntryMessageStep";
import JourneySelectionStep from "./steps/JourneySelectionStep";
import ResultMessageStep from "./steps/result-message/ResultMessageStep";
import ScheduleStep from "./steps/ScheduleStep";

/* -------------------------------------------------------------------------- */
/*                         Header campaign icon                               */
/* -------------------------------------------------------------------------- */

interface IconProps {
  className?: string;
}

function SmsTrackingIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5H7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M2 16.5H8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M2 12.5H5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Campaign step definitions                          */
/* -------------------------------------------------------------------------- */

const steps = [
  {
    id: 1,
    title: "اطلاعات کمپین",
    description: "نام و توضیحات کمپین را وارد کنید",
    icon: CampaignInformationIcon,
    headerTitle: "اطلاعات کمپین",
    headerDescription: "نام و توضیحات کمپین را وارد کنید",
  },
  {
    id: 2,
    title: "انتخاب سفر مشتری",
    description: "بین سفرها یکی را انتخاب کنید",
    icon: JourneyIcon,
    headerTitle: "انتخاب سفر مشتری",
    headerDescription:
      "از بین سفرهای مشتریان یکی را جهت اجرای کمپین انتخاب کنید",
  },
  {
    id: 3,
    title: "انتخاب سگمنت مشتریان",
    description: "کمپین برای این مشتریان اجرا می‌شود",
    icon: CustomerSegmentIcon,
    headerTitle: "انتخاب سگمنت مشتریان",
    headerDescription:
      "سگمنت مشتریان را انتخاب کنید تا سفر مشتری برای آن‌ها اجرا شود",
  },
  {
    id: 4,
    title: "ویرایش پیام ورودی",
    description: "پیام را شخصی‌سازی کنید",
    icon: MessageStepIcon,
    headerTitle: "ویرایش پیام ۱",
    headerDescription: "پیام‌های تعریف‌شده در سفر مشتری را ویرایش کنید",
  },
  {
    id: 5,
    title: "ویرایش پیام نتیجه",
    description: "پیام را شخصی‌سازی کنید",
    icon: MessageStepIcon,
    headerTitle: "ویرایش پیام ۲",
    headerDescription: "پیام‌های تعریف‌شده در سفر مشتری را ویرایش کنید",
  },
  {
    id: 6,
    title: "زمان‌بندی ارسال",
    description: "شروع و پایان اجرا را مشخص کنید",
    icon: ScheduleIcon,
    headerTitle: "زمان‌بندی ارسال",
    headerDescription: "زمان‌بندی شروع و پایان کمپین را مشخص کنید",
  },
  {
    id: 7,
    title: "جزئیات و صورت‌حساب",
    description: "پرداخت صورت‌حساب و شروع کمپین",
    icon: InvoiceDetailsIcon,
    headerTitle: "جزئیات و صورت‌حساب",
    headerDescription:
      "خلاصه‌ای از جزئیات کمپینی که ساخته‌اید را قبل از اجرا ببینید",
  },
] as const satisfies readonly CampaignStepDefinition[];

/* -------------------------------------------------------------------------- */
/*                           Current step content                             */
/* -------------------------------------------------------------------------- */

interface CurrentStepContentProps {
  currentStep: CampaignStep;
}

function CurrentStepContent({ currentStep }: CurrentStepContentProps) {
  switch (currentStep) {
    case 1:
      return <CampaignInformationStep />;

    case 2:
      return <JourneySelectionStep />;

    case 3:
      return <CustomerSegmentSelectionStep />;

    case 4:
      return <EntryMessageStep />;

    case 5:
      return <ResultMessageStep />;

    case 6:
      return <ScheduleStep />;

    case 7:
      return <CampaignSummaryStep />;

    default:
      return <CampaignInformationStep />;
  }
}

/* -------------------------------------------------------------------------- */
/*                              Main component                                */
/* -------------------------------------------------------------------------- */

export default function CampaignBuilder() {
  const currentStep = useAppSelector(selectCurrentStep);

  const currentStepDefinition =
    steps.find((step) => step.id === currentStep) ?? steps[0];

  const {
    icon: CurrentStepIcon,
    headerTitle: currentStepTitle,
    headerDescription: currentStepDescription,
  } = currentStepDefinition;

  return (
    <div dir="rtl" className="min-h-screen bg-background px-6 pb-6 pt-6">
      {/* Header */}
      <header className="flex h-20 w-full items-center justify-between gap-2 rounded-3xl bg-surface p-4">
        {/* Campaign title */}
        <div className="flex h-6 items-center gap-2">
          <SmsTrackingIcon className="size-6 shrink-0 text-primary" />

          <span className="whitespace-nowrap text-base font-bold leading-6 text-text">
            ایجاد کمپین هوشمند
          </span>
        </div>

        {/* Back */}
        <button
          type="button"
          dir="ltr"
          className="flex h-12 w-27.25 items-center justify-center gap-2 rounded-2xl py-3 pl-2 pr-4 text-base font-bold leading-6 text-primary transition-opacity hover:opacity-75"
        >
          <ChevronLeft aria-hidden="true" className="size-6 shrink-0" />

          <span className="whitespace-nowrap">بازگشت</span>
        </button>
      </header>

      {/* Main */}
      <main className="mt-6">
        <SidebarProvider
          defaultOpen
          dir="rtl"
          style={
            {
              "--sidebar-width": "370px",
              "--sidebar-width-mobile": "320px",
            } as CSSProperties
          }
          className="min-h-0 w-full items-start gap-6 bg-transparent"
        >
          <CampaignStepsSidebar currentStep={currentStep} steps={steps} />

          <SidebarInset className="m-0 min-w-0 flex-1 bg-transparent shadow-none">
            <section
              dir="rtl"
              className="min-h-200 overflow-hidden rounded-3xl bg-surface shadow-sm"
            >
              {/* Dynamic step header */}
              <div className="flex items-start gap-5 border-b border-border px-6 py-8 md:px-8">
                <CurrentStepIcon
                  aria-hidden="true"
                  className="size-6.75 shrink-0 text-primary"
                />

                <div>
                  <h1 className="text-xl font-bold text-text">
                    {currentStepTitle}
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    {currentStepDescription}
                  </p>
                </div>
              </div>

              {/* Selected step */}
              <CurrentStepContent currentStep={currentStep} />
            </section>
          </SidebarInset>
        </SidebarProvider>
      </main>
    </div>
  );
}
