"use client";

import type { CSSProperties } from "react";

import {
  BadgeCheck,
  ChevronLeft,
  Clock3,
  MessageSquare,
  ReceiptText,
  Route,
  Users,
} from "lucide-react";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import {
  selectCurrentStep,
  type CampaignStep,
} from "@/lib/features/campaign-builder/campaignBuilderSlice";

import { useAppSelector } from "@/lib/hooks";

import CampaignStepsSidebar, {
  type CampaignStepDefinition,
} from "./CampaignStepsSidebar";

import CampaignInformationStep from "./steps/CampaignInformationStep";
import CampaignSummaryStep from "./steps/CampaignSummaryStep";
import CustomerSegmentSelectionStep from "./steps/CustomerSegmentSelectionStep";
import EntryMessageStep from "./steps/EntryMessageStep/EntryMessageStep";
import JourneySelectionStep from "./steps/JourneySelectionStep";
import ResultMessageStep from "./steps/result-message/ResultMessageStep";
import ScheduleStep from "./steps/ScheduleStep";


/* -------------------------------------------------------------------------- */
/*                         Campaign step definitions                          */
/* -------------------------------------------------------------------------- */

const steps = [
  {
    id: 1,
    title: "اطلاعات کمپین",
    description: "نام و توضیحات کمپین را وارد کنید",
    icon: BadgeCheck,

    headerTitle: "اطلاعات کمپین",
    headerDescription:
      "نام و توضیحات کمپین را وارد کنید",
  },
  {
    id: 2,
    title: "انتخاب سفر مشتری",
    description: "بین سفرها یکی را انتخاب کنید",
    icon: Route,

    headerTitle: "انتخاب سفر مشتری",
    headerDescription:
      "از بین سفرهای مشتریان یکی را جهت اجرای کمپین انتخاب کنید",
  },
  {
    id: 3,
    title: "انتخاب سگمنت مشتریان",
    description:
      "کمپین برای این مشتریان اجرا می‌شود",
    icon: Users,

    headerTitle: "انتخاب سگمنت مشتریان",
    headerDescription:
      "سگمنت مشتریان را انتخاب کنید تا سفر مشتری برای آن‌ها اجرا شود",
  },
  {
    id: 4,
    title: "ویرایش پیام ورودی",
    description: "پیام را شخصی‌سازی کنید",
    icon: MessageSquare,

    headerTitle: "ویرایش پیام ۱",
    headerDescription:
      "پیام‌های تعریف‌شده در سفر مشتری را ویرایش کنید",
  },
  {
    id: 5,
    title: "ویرایش پیام نتیجه",
    description: "پیام را شخصی‌سازی کنید",
    icon: MessageSquare,

    headerTitle: "ویرایش پیام ۲",
    headerDescription:
      "پیام‌های تعریف‌شده در سفر مشتری را ویرایش کنید",
  },
  {
    id: 6,
    title: "زمان‌بندی ارسال",
    description:
      "شروع و پایان اجرا را مشخص کنید",
    icon: Clock3,

    headerTitle: "زمان‌بندی ارسال",
    headerDescription:
      "زمان‌بندی شروع و پایان کمپین را مشخص کنید",
  },
  {
    id: 7,
    title: "جزئیات و صورت‌حساب",
    description:
      "پرداخت صورت‌حساب و شروع کمپین",
    icon: ReceiptText,

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

function CurrentStepContent({
  currentStep,
}: CurrentStepContentProps) {
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
 

  const currentStep =
  useAppSelector(selectCurrentStep);

  const currentStepDefinition =
    steps.find(
      (step) => step.id === currentStep,
    ) ?? steps[0];

  const {
    icon: CurrentStepIcon,
    headerTitle: currentStepTitle,
    headerDescription:
      currentStepDescription,
  } = currentStepDefinition;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-background p-4 md:p-6"
    >
      {/* Top header */}
      <header className="flex min-h-20 items-center justify-between rounded-3xl bg-surface px-6 shadow-sm md:px-8">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-text">
            ایجاد کمپین هوشمند
          </span>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 text-primary transition-opacity hover:opacity-75"
        >
          <span>بازگشت</span>

          <ChevronLeft className="size-5" />
        </button>
      </header>

      {/* Main content and sidebar */}
      <SidebarProvider
        defaultOpen
        dir="rtl"
        style={
          {
            "--sidebar-width": "370px",
            "--sidebar-width-mobile":
              "320px",
          } as CSSProperties
        }
        className="mt-6 min-h-0 w-full items-start gap-6 bg-transparent"
      >
        {/* Right sidebar */}
        <CampaignStepsSidebar
          currentStep={currentStep}
          steps={steps}
        />

        {/* Main content */}
        <SidebarInset className="m-0 min-w-0 flex-1 bg-transparent shadow-none">
          <section
            dir="rtl"
            className="min-h-200 overflow-hidden rounded-3xl bg-surface shadow-sm"
          >
            {/* Dynamic step header */}
            <div className="flex items-start gap-5 border-b border-border px-6 py-8 md:px-8">
              <CurrentStepIcon
                aria-hidden="true"
                className="size-7 shrink-0 text-primary"
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
            <CurrentStepContent
              currentStep={currentStep}
            />
          </section>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}