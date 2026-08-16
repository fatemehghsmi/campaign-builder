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

  "journey-1":
    defaultJourney,

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
        "flex min-h-46.25 flex-col items-center justify-center rounded-2xl border bg-surface px-5 py-6 text-center transition",
        selected
          ? "border-2 border-primary"
          : "border-border",
      )}
    >
      <p className="text-sm text-text-muted">
        {type === "journey"
          ? "سفر مشتری"
          : "سگمنت"}
      </p>

      <div className="mt-4 text-4xl">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-text">
        {title}
      </h3>

      <p className="mt-3 text-sm text-text-muted">
        {subtitle}
      </p>
    </article>
  );
}


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
      <span className="text-sm text-text-muted">
        {label}
      </span>

      <span
        className={cn(
          "shrink-0 text-sm",
          emphasized
            ? "font-bold text-text"
            : "text-text-muted",
        )}
      >
        {value}
      </span>
    </div>
  );
}


export default function CampaignSummaryStep() {
  const dispatch = useAppDispatch();

  const [
    isInvoiceOpen,
    setIsInvoiceOpen,
  ] = useState(true);

  const [
    paymentMessage,
    setPaymentMessage,
  ] = useState("");


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


  const selectedSegments =
    selectedSegmentIds.length > 0
      ? selectedSegmentIds
          .slice(0, 3)
          .map(
            (
              segmentId,
              index,
            ) =>
              segmentData[
                segmentId
              ] ?? {
                ...defaultSegments[
                  index %
                    defaultSegments.length
                ],

                id: segmentId,
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
     * There is no editable data on this page.
     * All campaign data was already saved to Redux
     * in the previous steps.
     *
     * Later this button can call the API to persist
     * the whole Redux campaign as a backend draft.
     */
    window.alert(
      "پیش‌نویس کمپین ذخیره شد.",
    );
  }


  function handlePrevious() {
    dispatch(previousStep());
  }


  function handlePayment() {
    setPaymentMessage("");

    if (!selectedJourneyId) {
      setPaymentMessage(
        "لطفاً سفر مشتری را انتخاب کنید.",
      );

      return;
    }

    if (
      selectedSegmentIds.length ===
      0
    ) {
      setPaymentMessage(
        "لطفاً حداقل یک سگمنت انتخاب کنید.",
      );

      return;
    }

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
     * Later:
     * send the confirmed campaign data
     * to the backend/payment API here.
     */
    window.alert(
      "اطلاعات کمپین آماده ارسال به درگاه پرداخت است.",
    );
  }


  return (
    <div
      dir="rtl"
      className="mx-auto flex min-h-190 w-full max-w-230 flex-col px-6 py-10"
    >
      {/* Campaign information */}
      <section>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-text-muted">
            نام کمپین:
          </span>

          <h2 className="font-bold text-text">
            {campaignName}
          </h2>
        </div>

        <div className="mt-5 flex items-start gap-2">
          <span className="shrink-0 text-sm text-text-muted">
            توضیحات:
          </span>

          <p className="text-sm leading-7 text-text-muted">
            {campaignDescription}
          </p>
        </div>
      </section>


      <div className="my-7 h-px bg-border" />


      {/* Journey and segments */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          type="journey"
          title={
            selectedJourney.title
          }
          subtitle={
            selectedJourney.subtitle
          }
          icon={
            selectedJourney.icon
          }
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
              (current) =>
                !current,
            );
          }}
          className="flex w-full items-center justify-between border-b border-border pb-4 text-right"
        >
          <span className="font-bold text-text">
            صورتحساب
          </span>

          <ChevronDown
            className={cn(
              "size-5 text-text-muted transition-transform",
              isInvoiceOpen &&
                "rotate-180",
            )}
          />
        </button>


        {isInvoiceOpen && (
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">

            {/* Invoice table */}
            <div className="space-y-5 rounded-2xl border border-border-strong bg-surface p-7">
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
            <aside className="h-fit rounded-2xl border border-border-strong bg-background p-6">
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
                className="mt-6 h-12 w-full rounded-2xl bg-primary font-bold text-white hover:bg-primary-hover"
              >
                <Plus className="size-5" />

                افزایش موجودی
              </Button>

              <p className="mt-4 text-center text-xs text-text-subtle">
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
          className="mt-6 rounded-2xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          {paymentMessage}
        </div>
      )}


      {/* Bottom actions */}
      <div
        dir="ltr"
        className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-14"
      >
        <Button
          type="button"
          variant="ghost"
          onClick={
            handleSaveDraft
          }
          className="text-primary hover:bg-primary-soft hover:text-primary"
        >
          ذخیره پیش‌نویس
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={
              handlePrevious
            }
            className="h-12 min-w-44 rounded-2xl border-border-strong bg-surface text-text shadow-none"
          >
            قبلی
          </Button>

          <Button
            type="button"
            onClick={
              handlePayment
            }
            className="h-12 min-w-44 rounded-2xl bg-primary font-bold text-white shadow-none hover:bg-primary-hover"
          >
            پرداخت
          </Button>
        </div>
      </div>
    </div>
  );
}