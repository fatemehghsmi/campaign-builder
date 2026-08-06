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
    <div className="relative h-[635px] w-full overflow-hidden">
      <div
        className={cn(
          "absolute left-1/2 top-[24px] h-[760px] w-[440px]",
          "max-w-[calc(100%-32px)] -translate-x-1/2 rounded-[78px]",
          "bg-[linear-gradient(90deg,#5D5D5D_0%,#F4F4F4_7%,#1D1D1D_14%,#0B0B0B_86%,#E4E4E4_94%,#555_100%)]",
          "p-[5px] shadow-[0_0_35px_rgba(0,0,0,0.22)]",
        )}
      >
        <span className="absolute -left-[5px] top-[177px] h-[46px] w-[5px] rounded-l-[4px] bg-[#666]" />
        <span className="absolute -left-[5px] top-[246px] h-[72px] w-[5px] rounded-l-[4px] bg-[#666]" />
        <span className="absolute -left-[5px] top-[332px] h-[72px] w-[5px] rounded-l-[4px] bg-[#666]" />
        <span className="absolute -right-[5px] top-[245px] h-[112px] w-[5px] rounded-r-[4px] bg-[#666]" />

        <div className="h-full w-full rounded-[74px] bg-[#090909] p-[6px]">
          <div
            dir="rtl"
            className="relative h-full w-full overflow-hidden rounded-[68px] bg-white"
          >
            <div
              dir="ltr"
              className={cn(
                "absolute inset-x-0 top-0 z-30 flex h-[66px] items-center",
                "justify-between px-[48px] text-[17px] font-semibold text-black",
              )}
            >
              <span>9:41</span>

              <div className="flex items-center gap-[7px]">
                <span className="flex h-[14px] items-end gap-[2px]">
                  <span className="h-[5px] w-[3px] rounded-sm bg-black" />
                  <span className="h-[8px] w-[3px] rounded-sm bg-black" />
                  <span className="h-[11px] w-[3px] rounded-sm bg-black" />
                  <span className="h-[14px] w-[3px] rounded-sm bg-black" />
                </span>
                <Wifi strokeWidth={2.4} className="h-[15px] w-[19px]" />
                <BatteryFull strokeWidth={2} className="h-[16px] w-[29px]" />
              </div>
            </div>

            <div className="absolute left-1/2 top-[12px] z-40 h-[35px] w-[122px] -translate-x-1/2 rounded-full bg-black">
              <span className="absolute right-[11px] top-1/2 size-[11px] -translate-y-1/2 rounded-full bg-[#061224] shadow-[inset_0_0_3px_#1E4A89]" />
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

            <div className="absolute inset-x-0 top-[68px] z-20 flex h-[72px] items-center gap-3 border-b border-[#EDEDED] bg-white px-7">
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
                "absolute inset-x-0 top-[140px] bottom-0 overflow-hidden",
                "bg-[#ECE7DF] bg-[radial-gradient(#D7D0C7_1px,transparent_1px)]",
                "bg-[length:18px_18px] p-5",
              )}
            >
              <div className="mr-auto w-[300px] overflow-hidden rounded-[20px] rounded-br-[6px] bg-white shadow-sm">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="تصویر پیام"
                    className="h-[220px] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[180px] w-full flex-col items-center justify-center gap-3 bg-[#F2F2F2] text-[#999]">
                    <ImagePlus className="size-10" />
                    <span className="text-xs">تصویر پیام</span>
                  </div>
                )}

                <div
                  className={cn(
                    "whitespace-pre-line",
                    "break-words",
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
        "flex w-full flex-col items-center overflow-hidden rounded-[16px]",
        "border-2 border-[#EBEBEB] bg-[#F7F7F7]",
        isOpen ? "h-[810px]" : "h-[75px]",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "relative h-[75px] w-full shrink-0 border-b-2 border-[#EBEBEB]",
          "bg-white outline-none transition-colors hover:bg-[#FCFCFC]",
        )}
      >
        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-right text-[18px] font-bold leading-[27px] text-[#434343]">
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
