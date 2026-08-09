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

  const newLocal = "size-2.75";
  return (
    <div
      className={cn(
        "relative",
        "h-119.5",
        "w-full",
        "overflow-hidden",
      )}
    >
      {/* Phone frame */}
      <div
        className={cn(
          "absolute",
          "left-1/2 top-7",
          "h-195",
          "w-110",
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
            "-left-1.25",
            "top-44.25",
            "h-11.5 w-1.25",
            "rounded-l-sm",
            "bg-[#666]",
          )}
        />

        <span
          aria-hidden="true"
          className={cn(
            "absolute",
            "-left-1.25",
            "top-61.5",
            "h-18 w-1.25",
            "rounded-l-sm",
            "bg-[#666]",
          )}
        />

        <span
          aria-hidden="true"
          className={cn(
            "absolute",
            "-left-1.25",
            "top-83",
            "h-18 w-1.25",
            "rounded-l-sm",
            "bg-[#666]",
          )}
        />

        {/* Right side button */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute",
            "-right-1.25",
            "top-61.25",
            "h-28 w-1.25",
            "rounded-r-sm",
            "bg-[#666]",
          )}
        />

        {/* Black bezel */}
        <div
          className={cn(
            "h-full w-full",
            "rounded-[74px]",
            "bg-[#090909]",
            "p-1.5",
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
                "flex h-16.5",
                "items-center",
                "justify-between",
                "px-12",
                "text-[17px]",
                "font-semibold",
                "text-black",
              )}
            >
              <span>9:41</span>

              <div
                className={cn(
                  "flex items-center",
                  "gap-1.75",
                )}
              >
                {/* Signal */}
                <span className="flex h-3.5 items-end gap-0.5">
                  <span className="h-1.25 w-0.75 rounded-sm bg-black" />
                  <span className="h-2 w-0.75 rounded-sm bg-black" />
                  <span className="h-2.75 w-0.75 rounded-sm bg-black" />
                  <span className="h-3.5 w-0.75 rounded-sm bg-black" />
                </span>

                <Wifi
                  strokeWidth={2.4}
                  className="h-3.75 w-4.75"
                />

                <BatteryFull
                  strokeWidth={2}
                  className="h-4 w-7.25"
                />
              </div>
            </div>

            {/* Dynamic Island */}
            <div
              aria-hidden="true"
              className={cn(
                "absolute",
                "left-1/2 top-3",
                "z-40",
                "h-8.75 w-30.5",
                "-translate-x-1/2",
                "rounded-full",
                "bg-black",
              )}
            >
              <span
                className={cn(
                  "absolute",
                  "right-2.75 top-1/2",
                  newLocal,
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
                "left-7.25",
                "top-22.75",
                "z-30",
                "flex size-11.5",
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
                "left-1/2 top-22",
                "z-20",
                "size-17",
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
                "left-1/2 top-37",
                "z-30",
                "flex h-12",
                "w-31",
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
                "right-12",
                "top-56.5",
                "h-54.5",
                "w-73",
                "rounded-[30px]",
                "bg-[#DEDEDE]",
                "px-6 py-4.5",
                "text-[17px]",
                "font-normal",
                "leading-6",
                "text-black",
              )}
            >
              <div
                className={cn(
                  "h-full",
                  "overflow-y-auto",
                  "scrollbar-none",
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
                        "min-h-6",
                        "w-full",
                        "wrap-break-word",

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
                  "-left-3.5",
                  "bottom-0",
                  "h-9.5",
                  "w-6",
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
        "rounded-2xl",
        "border-2",
        "border-[#EBEBEB]",
        "bg-[#F7F7F7]",

        isOpen
          ? "h-138.25"
          : "h-18.75",
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "relative",
          "h-18.75",
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
            "leading-6.75",
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