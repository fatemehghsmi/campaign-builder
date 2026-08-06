"use client";

import {
  BatteryFull,
  ChevronDown,
  Wifi,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface MessagePreviewProps {
  isOpen: boolean;
  isEnabled: boolean;
  message: string;
  onToggle: () => void;
}

function isLinkLine(value: string): boolean {
  const normalized = value.trim();

  return (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("www.")
  );
}

interface PhonePreviewProps {
  message: string;
  onClose: () => void;
}

function PhonePreview({
  message,
  onClose,
}: PhonePreviewProps) {
  const lines = message.split(/\r?\n/);

  return (
    <div
      className={cn(
        "relative",
        "h-[478px]",
        "w-full",
        "overflow-hidden",
      )}
    >
      {/* Phone frame */}
      <div
        className={cn(
          "absolute",
          "left-1/2 top-[28px]",
          "h-[780px]",
          "w-[440px]",
          "max-w-[calc(100%-32px)]",
          "-translate-x-1/2",
          "rounded-[78px]",
          "bg-[linear-gradient(90deg,#5D5D5D_0%,#F4F4F4_7%,#1D1D1D_14%,#0B0B0B_86%,#E4E4E4_94%,#555_100%)]",
          "p-1.25",
          "shadow-[0_0_35px_rgba(0,0,0,0.22)]",
        )}
      >
        {/* Left side buttons */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute",
            "-left-[5px]",
            "top-[177px]",
            "h-[46px] w-[5px]",
            "rounded-l-[4px]",
            "bg-[#666]",
          )}
        />

        <span
          aria-hidden="true"
          className={cn(
            "absolute",
            "-left-[5px]",
            "top-[246px]",
            "h-[72px] w-[5px]",
            "rounded-l-[4px]",
            "bg-[#666]",
          )}
        />

        <span
          aria-hidden="true"
          className={cn(
            "absolute",
            "-left-[5px]",
            "top-[332px]",
            "h-[72px] w-[5px]",
            "rounded-l-[4px]",
            "bg-[#666]",
          )}
        />

        {/* Right side button */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute",
            "-right-[5px]",
            "top-[245px]",
            "h-[112px] w-[5px]",
            "rounded-r-[4px]",
            "bg-[#666]",
          )}
        />

        {/* Black bezel */}
        <div
          className={cn(
            "h-full w-full",
            "rounded-[74px]",
            "bg-[#090909]",
            "p-[6px]",
          )}
        >
          {/* Screen */}
          <div
            dir="rtl"
            className={cn(
              "relative",
              "h-full w-full",
              "overflow-hidden",
              "rounded-[68px]",
              "bg-white",
            )}
          >
            {/* Status bar */}
            <div
              dir="ltr"
              className={cn(
                "absolute inset-x-0 top-0",
                "z-30",
                "flex h-[66px]",
                "items-center",
                "justify-between",
                "px-[48px]",
                "text-[17px]",
                "font-semibold",
                "text-black",
              )}
            >
              <span>9:41</span>

              <div
                className={cn(
                  "flex items-center",
                  "gap-[7px]",
                )}
              >
                {/* Signal */}
                <span className="flex h-[14px] items-end gap-[2px]">
                  <span className="h-[5px] w-[3px] rounded-sm bg-black" />
                  <span className="h-[8px] w-[3px] rounded-sm bg-black" />
                  <span className="h-[11px] w-[3px] rounded-sm bg-black" />
                  <span className="h-[14px] w-[3px] rounded-sm bg-black" />
                </span>

                <Wifi
                  strokeWidth={2.4}
                  className="h-[15px] w-[19px]"
                />

                <BatteryFull
                  strokeWidth={2}
                  className="h-[16px] w-[29px]"
                />
              </div>
            </div>

            {/* Dynamic Island */}
            <div
              aria-hidden="true"
              className={cn(
                "absolute",
                "left-1/2 top-[12px]",
                "z-40",
                "h-[35px] w-[122px]",
                "-translate-x-1/2",
                "rounded-full",
                "bg-black",
              )}
            >
              <span
                className={cn(
                  "absolute",
                  "right-[11px] top-1/2",
                  "size-[11px]",
                  "-translate-y-1/2",
                  "rounded-full",
                  "bg-[#061224]",
                  "shadow-[inset_0_0_3px_#1E4A89]",
                )}
              />
            </div>

            {/* Close button */}
            <button
              type="button"
              aria-label="بستن پیش‌نمایش"
              onClick={onClose}
              className={cn(
                "absolute",
                "left-[29px]",
                "top-[91px]",
                "z-30",
                "flex size-[46px]",
                "items-center",
                "justify-center",
                "rounded-full",
                "bg-white",
                "text-[#1A1A1A]",
                "shadow-[0_7px_25px_rgba(0,0,0,0.1)]",
                "transition-colors",
                "hover:bg-[#F7F7F7]",
              )}
            >
              <X
                strokeWidth={1.8}
                className="size-7"
              />
            </button>

            {/* Avatar */}
            <div
              className={cn(
                "absolute",
                "left-1/2 top-[88px]",
                "z-20",
                "size-[68px]",
                "-translate-x-1/2",
                "overflow-hidden",
                "rounded-full",
                "bg-[#F38353]",
                "bg-cover",
                "bg-center",
              )}
              style={{
                backgroundImage:
                  "url('/images/campaign-avatar.jpg')",
              }}
            />

            {/* Sender name */}
            <div
              className={cn(
                "absolute",
                "left-1/2 top-[148px]",
                "z-30",
                "flex h-[48px]",
                "w-[124px]",
                "-translate-x-1/2",
                "items-center",
                "justify-center",
                "rounded-full",
                "bg-[#F7F7F7]",
                "text-[16px]",
                "font-medium",
                "text-[#1A1A1A]",
                "shadow-[0_8px_30px_rgba(0,0,0,0.1)]",
              )}
            >
              عطر مجلسی
            </div>

            {/* SMS bubble */}
            <div
              className={cn(
                "absolute",
                "right-[48px]",
                "top-[226px]",
                "h-[218px]",
                "w-[292px]",
                "rounded-[30px]",
                "bg-[#DEDEDE]",
                "px-6 py-[18px]",
                "text-[17px]",
                "font-normal",
                "leading-[24px]",
                "text-black",
              )}
            >
              <div
                className={cn(
                  "h-full",
                  "overflow-y-auto",
                  "[scrollbar-width:none]",
                  "[&::-webkit-scrollbar]:hidden",
                )}
              >
                {lines.map((line, index) => {
                  const link = isLinkLine(line);

                  return (
                    <span
                      key={`${index}-${line}`}
                      dir={link ? "ltr" : "rtl"}
                      className={cn(
                        "block",
                        "min-h-[24px]",
                        "w-full",
                        "break-words",

                        link
                          ? "text-left text-[#0088FF]"
                          : "text-right text-black",
                      )}
                    >
                      {line || "\u00A0"}
                    </span>
                  );
                })}
              </div>

              {/* Bubble tail — left side */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute",
                  "-left-[14px]",
                  "bottom-0",
                  "h-[38px]",
                  "w-[24px]",
                  "bg-[#DEDEDE]",
                )}
                style={{
                  clipPath:
                    "polygon(100% 0, 100% 100%, 0 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagePreview({
  isOpen,
  isEnabled,
  message,
  onToggle,
}: MessagePreviewProps) {
  return (
    <section
      dir="rtl"
      className={cn(
        "flex w-full",
        "flex-col",
        "items-center",
        "overflow-hidden",
        "rounded-[16px]",
        "border-2",
        "border-[#EBEBEB]",
        "bg-[#F7F7F7]",

        isOpen
          ? "h-[553px]"
          : "h-[75px]",
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "relative",
          "h-[75px]",
          "w-full",
          "shrink-0",
          "border-b-2",
          "border-[#EBEBEB]",
          "bg-white",
          "outline-none",
          "transition-colors",
          "hover:bg-[#FCFCFC]",
        )}
      >
        <span
          className={cn(
            "absolute",
            "right-8",
            "top-1/2",
            "-translate-y-1/2",
            "text-right",
            "text-[18px]",
            "font-bold",
            "leading-[27px]",
            "text-[#434343]",
          )}
        >
          پیش نمایش پیام
        </span>

        <ChevronDown
          aria-hidden="true"
          className={cn(
            "absolute",
            "left-8",
            "top-1/2",
            "size-6",
            "-translate-y-1/2",
            "text-[#848382]",
            "transition-transform",
            "duration-200",

            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <PhonePreview
          message={
            isEnabled
              ? message
              : "ارسال این پیام غیرفعال است."
          }
          onClose={onToggle}
        />
      )}
    </section>
  );
}