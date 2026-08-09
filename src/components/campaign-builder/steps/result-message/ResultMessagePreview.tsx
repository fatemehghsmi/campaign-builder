"use client";

import {
  BatteryFull,
  ChevronDown,
  ImagePlus,
  MoreVertical,
  Search,
  Wifi,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface ResultMessagePreviewProps {
  isOpen: boolean;
  isEnabled: boolean;
  message: string;
  imageUrl: string;
  onToggle: () => void;
}

interface BalePhonePreviewProps {
  message: string;
  imageUrl: string;
  onClose: () => void;
}

function BalePhonePreview({
  message,
  imageUrl,
  onClose,
}: BalePhonePreviewProps) {
  return (
    <div className="relative h-158.75 w-full overflow-hidden">
      <div
        className={cn(
          "absolute left-1/2 top-6 h-190 w-110",
          "max-w-[calc(100%-32px)] -translate-x-1/2 rounded-[78px]",
          "bg-[linear-gradient(90deg,#5D5D5D_0%,#F4F4F4_7%,#1D1D1D_14%,#0B0B0B_86%,#E4E4E4_94%,#555_100%)]",
          "p-1.25 shadow-[0_0_35px_rgba(0,0,0,0.22)]",
        )}
      >
        <span className="absolute -left-1.25 top-44.25 h-11.5 w-1.25 rounded-l-sm bg-[#666]" />
        <span className="absolute -left-1.25 top-61.5 h-18 w-1.25 rounded-l-sm bg-[#666]" />
        <span className="absolute -left-1.25 top-83 h-18 w-1.25 rounded-l-sm bg-[#666]" />
        <span className="absolute -right-1.25 top-61.25 h-28 w-1.25 rounded-r-sm bg-[#666]" />

        <div className="h-full w-full rounded-[74px] bg-[#090909] p-1.5">
          <div
            dir="rtl"
            className="relative h-full w-full overflow-hidden rounded-[68px] bg-white"
          >
            <div
              dir="ltr"
              className={cn(
                "absolute inset-x-0 top-0 z-30 flex h-16.5 items-center",
                "justify-between px-12 text-[17px] font-semibold text-black",
              )}
            >
              <span>9:41</span>

              <div className="flex items-center gap-1.75">
                <span className="flex h-3.5 items-end gap-0.5">
                  <span className="h-1.25 w-0.75 rounded-sm bg-black" />
                  <span className="h-2 w-0.75 rounded-sm bg-black" />
                  <span className="h-2.75 w-0.75 rounded-sm bg-black" />
                  <span className="h-3.5 w-0.75 rounded-sm bg-black" />
                </span>
                <Wifi strokeWidth={2.4} className="h-3.75 w-4.75" />
                <BatteryFull strokeWidth={2} className="h-4 w-7.25" />
              </div>
            </div>

            <div className="absolute left-1/2 top-3 z-40 h-8.75 w-30.5 -translate-x-1/2 rounded-full bg-black">
              <span className="absolute right-2.75 top-1/2 size-2.75 -translate-y-1/2 rounded-full bg-[#061224] shadow-[inset_0_0_3px_#1E4A89]" />
            </div>

            {/* <button
              type="button"
              aria-label="بستن پیش‌نمایش"
              onClick={onClose}
              className={cn(
                "absolute left-[29px] top-[82px] z-40 flex size-[46px]",
                "items-center justify-center rounded-full bg-white text-[#1A1A1A]",
                "shadow-[0_7px_25px_rgba(0,0,0,0.1)] hover:bg-[#F7F7F7]",
              )}
            >
              <X strokeWidth={1.8} className="size-7" />
            </button> */}

            <div className="absolute inset-x-0 top-17 z-20 flex h-18 items-center gap-3 border-b border-[#EDEDED] bg-white px-7">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FFCFBF] text-sm font-bold text-[#A54D2F]">
                ع
              </div>

              <div className="min-w-0 flex-1 text-right">
                <p className="truncate text-sm font-bold text-[#333]">
                  عطر مجلسی
                </p>
                <p className="mt-1 text-[10px] text-[#999]">باشگاه مشتریان</p>
              </div>

              <Search className="size-5 text-[#555]" />
              <MoreVertical className="size-5 text-[#555]" />
            </div>

            <div
              className={cn(
                "absolute inset-x-0 top-35 bottom-0 overflow-hidden",
                "bg-[#ECE7DF] bg-[radial-gradient(#D7D0C7_1px,transparent_1px)]",
                "bg-size-[18px_18px] p-5",
              )}
            >
              <div className="mr-auto w-75 overflow-hidden rounded-[20px] rounded-br-md bg-white shadow-sm">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="تصویر پیام"
                    className="h-55 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-45 w-full flex-col items-center justify-center gap-3 bg-[#F2F2F2] text-[#999]">
                    <ImagePlus className="size-10" />
                    <span className="text-xs">تصویر پیام</span>
                  </div>
                )}

                <div
                  className={cn(
                    "whitespace-pre-line",
                    "wrap-break-word",
                    "px-4 py-4",
                    "text-right text-sm",
                    "leading-7 text-[#333]",
                  )}
                >
                  {message}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultMessagePreview({
  isOpen,
  isEnabled,
  message,
  imageUrl,
  onToggle,
}: ResultMessagePreviewProps) {
  return (
    <section
      dir="rtl"
      className={cn(
        "flex w-full flex-col items-center overflow-hidden rounded-2xl",
        "border-2 border-[#EBEBEB] bg-[#F7F7F7]",
        isOpen ? "h-202.5" : "h-18.75",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "relative h-18.75 w-full shrink-0 border-b-2 border-[#EBEBEB]",
          "bg-white outline-none transition-colors hover:bg-[#FCFCFC]",
        )}
      >
        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-right text-[18px] font-bold leading-6.75 text-[#434343]">
          پیش نمایش پیام
        </span>

        <ChevronDown
          aria-hidden="true"
          className={cn(
            "absolute left-8 top-1/2 size-6 -translate-y-1/2",
            "text-[#848382] transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <BalePhonePreview
          message={isEnabled ? message : "ارسال این پیام غیرفعال است."}
          imageUrl={isEnabled ? imageUrl : ""}
          onClose={onToggle}
        />
      )}
    </section>
  );
}
