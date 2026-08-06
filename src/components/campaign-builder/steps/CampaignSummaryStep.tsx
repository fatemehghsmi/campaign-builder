"use client";

import { useState } from "react";

import {
  ChevronDown,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  previousStep,
} from "@/lib/features/campaign-builder/campaignBuilderSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/hooks";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                Mock data                                   */
/* -------------------------------------------------------------------------- */

/*
 * Replace this pricing information with API data later.
 */
const SMS_COST_PER_PERSON = 1_285;
const BALE_COST_PER_PERSON = 1_100;

const WALLET_BALANCE = 211_925_000;
const PAYABLE_AMOUNT = 13_117_500;

interface JourneySummary {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

interface SegmentSummary {
  id: string;
  title: string;
  count: number;
  icon: string;
}

const defaultJourney: JourneySummary = {
  id: "repeat-purchase-reminder",
  title: "یادآوری خرید مجدد",
  subtitle: "۳ پیام در ۷ روز",
  icon: "📣",
};

const defaultSegments: SegmentSummary[] = [
  {
    id: "loyal-customers",
    title: "وفاداران",
    count: 1325,
    icon: "🔵",
  },
  {
    id: "silver-level",
    title: "سطح نقره‌ای",
    count: 1325,
    icon: "🔘",
  },
  {
    id: "birthday-customers",
    title: "متولدها",
    count: 1325,
    icon: "🎂",
  },
];

const journeyData: Record<
  string,
  JourneySummary
> = {
  "repeat-purchase-reminder":
    defaultJourney,

  "journey-1": defaultJourney,

  "journey-2": {
    id: "journey-2",
    title: "خوش‌آمدگویی مشتری",
    subtitle: "۳ پیام در ۷ روز",
    icon: "👋",
  },

  "journey-3": {
    id: "journey-3",
    title: "بازگشت مشتری",
    subtitle: "۳ پیام در ۷ روز",
    icon: "🔁",
  },
};

const segmentData: Record<
  string,
  SegmentSummary
> = {
  "loyal-customers":
    defaultSegments[0],

  loyal:
    defaultSegments[0],

  "silver-level":
    defaultSegments[1],

  silver:
    defaultSegments[1],

  "birthday-customers":
    defaultSegments[2],

  birthday:
    defaultSegments[2],
};

/* -------------------------------------------------------------------------- */
/*                               Format helpers                               */
/* -------------------------------------------------------------------------- */

function formatNumber(
  value: number,
): string {
  return new Intl.NumberFormat(
    "fa-IR",
  ).format(value);
}

function formatRial(
  value: number,
): string {
  return `${formatNumber(value)} ریال`;
}

/* -------------------------------------------------------------------------- */
/*                              Summary card                                  */
/* -------------------------------------------------------------------------- */

interface SummaryCardProps {
  type: "journey" | "segment";
  title: string;
  subtitle: string;
  icon: string;
  selected?: boolean;
}

function SummaryCard({
  type,
  title,
  subtitle,
  icon,
  selected = false,
}: SummaryCardProps) {
  return (
    <article
      className={cn(
        "flex min-h-[185px]",
        "flex-col items-center",
        "justify-center rounded-2xl",
        "border bg-white px-5 py-6",
        "text-center transition",

        selected
          ? "border-2 border-[#ff7c4d]"
          : "border-[#e3e3e3]",
      )}
    >
      <p className="text-sm text-[#888]">
        {type === "journey"
          ? "سفر مشتری"
          : "سگمنت"}
      </p>

      <div className="mt-4 text-4xl">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-[#444]">
        {title}
      </h3>

      <p className="mt-3 text-sm text-[#888]">
        {subtitle}
      </p>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Invoice details                               */
/* -------------------------------------------------------------------------- */

interface InvoiceRowProps {
  label: string;
  value: string;
  emphasized?: boolean;
}

function InvoiceRow({
  label,
  value,
  emphasized = false,
}: InvoiceRowProps) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-sm text-[#777]">
        {label}
      </span>

      <span
        className={cn(
          "shrink-0 text-sm",

          emphasized
            ? "font-bold text-[#333]"
            : "text-[#555]",
        )}
      >
        {value}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Main component                               */
/* -------------------------------------------------------------------------- */

export default function CampaignSummaryStep() {
  const dispatch = useAppDispatch();

  const [isInvoiceOpen, setIsInvoiceOpen] =
    useState(true);

  const [paymentMessage, setPaymentMessage] =
    useState("");

  const campaignName =
    useAppSelector(
      (state) =>
        state.campaignBuilder
          .campaignName,
    ) || "یلدا ۱۴۰۴";

  const campaignDescription =
    useAppSelector(
      (state) =>
        state.campaignBuilder
          .description,
    ) ||
    "شب یلدا، بلندترین شب سال، فرصتی برای کنار هم بودن، شادی کردن و ساختن لحظه‌های ماندگار است.";

  const selectedJourneyId =
    useAppSelector(
      (state) =>
        state.campaignBuilder
          .selectedJourneyId,
    );

  const selectedSegmentIds =
    useAppSelector(
      (state) =>
        state.campaignBuilder
          .selectedSegmentIds,
    ) ?? [];

  const entryMessage =
    useAppSelector(
      (state) =>
        state.campaignBuilder
          .entryMessage,
    );

  const resultMessage =
    useAppSelector(
      (state) =>
        state.campaignBuilder
          .resultMessage,
    );

  const selectedJourney =
    journeyData[
      selectedJourneyId ?? ""
    ] ?? defaultJourney;

  /*
   * Unknown IDs receive the default visual data.
   * Replace segmentData with backend data later.
   */
  const selectedSegments =
    selectedSegmentIds.length > 0
      ? selectedSegmentIds
          .slice(0, 3)
          .map(
            (
              segmentId,
              index,
            ) => {
              return (
                segmentData[segmentId] ?? {
                  ...defaultSegments[
                    index %
                      defaultSegments.length
                  ],

                  id: segmentId,
                }
              );
            },
          )
      : defaultSegments;

  const recipientCount =
    selectedSegments.reduce(
      (total, segment) =>
        total + segment.count,
      0,
    );

  const smsPerRecipient =
    entryMessage?.isEnabled
      ? 1
      : 0;

  /*
   * The Figma example shows two Bale messages
   * for each customer.
   */
  const balePerRecipient =
    resultMessage?.isEnabled
      ? 2
      : 0;

  const messageCountPerRecipient =
    smsPerRecipient +
    balePerRecipient;

  const totalMessageCount =
    recipientCount *
    messageCountPerRecipient;

  const remainingWalletBalance =
    WALLET_BALANCE -
    PAYABLE_AMOUNT;

  function handleSaveDraft() {
    /*
     * Previous steps have already saved their data
     * in Redux.
     */
    window.alert(
      "پیش‌نویس کمپین ذخیره شد.",
    );
  }

  function handlePayment() {
    setPaymentMessage("");

    if (
      WALLET_BALANCE <
      PAYABLE_AMOUNT
    ) {
      setPaymentMessage(
        "موجودی کیف پول برای پرداخت کافی نیست.",
      );

      return;
    }

    /*
     * Replace this with the payment API request.
     */
    window.alert(
      "اطلاعات کمپین آماده ارسال به درگاه پرداخت است.",
    );
  }

  return (
    <div
      dir="rtl"
      className={cn(
        "mx-auto flex min-h-[760px]",
        "w-full max-w-[920px]",
        "flex-col px-6 py-10",
      )}
    >
      {/* Campaign information */}
      <section>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-[#888]">
            نام کمپین:
          </span>

          <h2 className="font-bold text-[#333]">
            {campaignName}
          </h2>
        </div>

        <div className="mt-5 flex items-start gap-2">
          <span className="shrink-0 text-sm text-[#888]">
            توضیحات:
          </span>

          <p className="text-sm leading-7 text-[#555]">
            {campaignDescription}
          </p>
        </div>
      </section>

      <div className="my-7 h-px bg-[#e8e8e8]" />

      {/* Journey and segments */}
      <section
        className={cn(
          "grid gap-5",
          "sm:grid-cols-2",
          "xl:grid-cols-4",
        )}
      >
        <SummaryCard
          type="journey"
          title={selectedJourney.title}
          subtitle={
            selectedJourney.subtitle
          }
          icon={selectedJourney.icon}
          selected
        />

        {selectedSegments.map(
          (segment) => (
            <SummaryCard
              key={segment.id}
              type="segment"
              title={segment.title}
              subtitle={`${formatNumber(
                segment.count,
              )} نفر`}
              icon={segment.icon}
            />
          ),
        )}
      </section>

      {/* Billing */}
      <section className="mt-8">
        <button
          type="button"
          onClick={() => {
            setIsInvoiceOpen(
              (previousValue) =>
                !previousValue,
            );
          }}
          className={cn(
            "flex w-full items-center",
            "justify-between",
            "border-b border-[#ededed]",
            "pb-4 text-right",
          )}
        >
          <span className="font-bold text-[#333]">
            صورتحساب
          </span>

          <ChevronDown
            className={cn(
              "size-5 text-[#555]",
              "transition-transform",

              isInvoiceOpen &&
                "rotate-180",
            )}
          />
        </button>

        {isInvoiceOpen && (
          <div
            className={cn(
              "mt-5 grid gap-5",
              "lg:grid-cols-[1fr_340px]",
            )}
          >
            {/* Invoice table */}
            <div
              className={cn(
                "space-y-5 rounded-2xl",
                "border border-[#dedede]",
                "bg-white p-7",
              )}
            >
              <InvoiceRow
                label="تعداد مخاطبان"
                value={`${formatNumber(
                  recipientCount,
                )} نفر`}
              />

              <InvoiceRow
                label="مجموع ارسال‌ها"
                value={`${formatNumber(
                  totalMessageCount,
                )} پیام`}
              />

              <InvoiceRow
                label="تعداد پیامک برای هر نفر"
                value={`${formatNumber(
                  smsPerRecipient,
                )} پیام`}
              />

              <InvoiceRow
                label="تعداد پیام‌رسان بله برای هر نفر"
                value={`${formatNumber(
                  balePerRecipient,
                )} پیام`}
              />

              <InvoiceRow
                label="مبلغ پیامک به ازای هر نفر"
                value={formatRial(
                  SMS_COST_PER_PERSON,
                )}
              />

              <InvoiceRow
                label="مبلغ پیام‌رسان بله به ازای هر نفر"
                value={formatRial(
                  BALE_COST_PER_PERSON,
                )}
              />
            </div>

            {/* Wallet card */}
            <aside
              className={cn(
                "h-fit rounded-2xl",
                "border border-[#dedede]",
                "bg-[#fafafa] p-6",
              )}
            >
              <InvoiceRow
                label="موجودی کیف پول:"
                value={formatRial(
                  WALLET_BALANCE,
                )}
              />

              <div className="mt-6">
                <InvoiceRow
                  label="مبلغ قابل پرداخت"
                  value={formatRial(
                    PAYABLE_AMOUNT,
                  )}
                  emphasized
                />
              </div>

              <Button
                type="button"
                onClick={() => {
                  window.alert(
                    "در این قسمت باید صفحه افزایش موجودی باز شود.",
                  );
                }}
                className={cn(
                  "mt-6 h-12 w-full",
                  "rounded-2xl",
                  "bg-[#ff7445]",
                  "font-bold text-white",

                  "hover:bg-[#ef6739]",
                )}
              >
                <Plus className="size-5" />

                افزایش موجودی
              </Button>

              <p className="mt-4 text-center text-xs text-[#999]">
                موجودی پس از پرداخت:{" "}
                {formatRial(
                  remainingWalletBalance,
                )}
              </p>
            </aside>
          </div>
        )}
      </section>

      {paymentMessage && (
        <div
          role="alert"
          className={cn(
            "mt-6 rounded-2xl",
            "border border-red-200",
            "bg-red-50 px-4 py-3",
            "text-sm text-red-600",
          )}
        >
          {paymentMessage}
        </div>
      )}

      {/* Bottom actions */}
      <div
        dir="ltr"
        className={cn(
          "mt-auto flex flex-wrap",
          "items-center justify-between",
          "gap-4 pt-14",
        )}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={handleSaveDraft}
          className={cn(
            "text-[#ff7445]",

            "hover:bg-[#fff4ef]",
            "hover:text-[#ff7445]",
          )}
        >
          ذخیره پیش‌نویس
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              dispatch(previousStep());
            }}
            className={cn(
              "h-12 min-w-44",
              "rounded-2xl",
              "border-[#dedede]",
              "bg-white text-[#555]",
            )}
          >
            قبلی
          </Button>

          <Button
            type="button"
            onClick={handlePayment}
            className={cn(
              "h-12 min-w-44",
              "rounded-2xl",
              "bg-[#ff7445]",
              "font-bold text-white",

              "hover:bg-[#ef6739]",
            )}
          >
            پرداخت
          </Button>
        </div>
      </div>
    </div>
  );
}