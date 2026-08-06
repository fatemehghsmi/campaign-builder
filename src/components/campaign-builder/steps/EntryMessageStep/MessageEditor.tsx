"use client";

import { useState } from "react";

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormClearErrors,
} from "react-hook-form";

import {
  Check,
  ChevronDown,
  Info,
  Link2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type {
  EntryMessageFormValues,
} from "@/lib/features/campaign-builder/entryMessageSchema";

import { cn } from "@/lib/utils";

const MAX_MESSAGE_LENGTH = 500;

const senderLines = [
  {
    id: "1000000000",
    label: "۱۰۰۰۰۰۰۰۰۰",
  },
  {
    id: "2000000000",
    label: "۲۰۰۰۰۰۰۰۰۰",
  },
  {
    id: "3000000000",
    label: "۳۰۰۰۰۰۰۰۰۰",
  },
] as const;

const variableValues: Record<string, string> = {
  credit: "۵۰۰٬۰۰۰ تومان",
  userLevel: "طلایی",
  clubName: "عطر مجلسی",
  firstName: "سعید",
  lastName: "طباطبایی",
  points: "۱۲۰",
};

export interface MessageVariable {
  id: string;
  label: string;
  token: string;
}

interface MessageEditorProps {
  control: Control<EntryMessageFormValues>;


  errors: FieldErrors<EntryMessageFormValues>;

  clearErrors: UseFormClearErrors<EntryMessageFormValues>;

  isEnabled: boolean;
  message: string;

  variables: readonly MessageVariable[];

  onInsertToken: (value: string) => void;

  onOpenLinkDialog: () => void;

  onAiRewrite: () => void;
}

/* -------------------------------------------------------------------------- */
/*                                   Toggle                                   */
/* -------------------------------------------------------------------------- */

interface MessageToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function MessageToggle({
  checked,
  onCheckedChange,
}: MessageToggleProps) {
  return (
    <button
      id="entry-message-enabled"
      type="button"
      role="switch"
      dir="ltr"
      aria-checked={checked}
      aria-label="فعال یا غیرفعال کردن ارسال پیام"
      onClick={() => {
        onCheckedChange(!checked);
      }}
      className={cn(
        "relative inline-flex",
        "h-6 w-[42px]",
        "shrink-0 items-center",
        "rounded-[8px]",
        "border-0 p-1",
        "outline-none",
        "transition-colors duration-200",

        checked
          ? "bg-[#F38353]"
          : "bg-[#EBEBEB]",

        "focus-visible:ring-2",
        "focus-visible:ring-[#F38353]/20",
        "focus-visible:ring-offset-2",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1 top-1",
          "size-4",
          "rounded-[4px]",
          "bg-white",
          "transition-transform duration-200",

          checked
            ? "translate-x-[18px]"
            : "translate-x-0",
        )}
      />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Tooltip                                  */
/* -------------------------------------------------------------------------- */

function MessageInfoTooltip() {
  return (
    <div className="group relative flex size-[18px] items-center justify-center">
      <button
        type="button"
        aria-label="راهنمای ارسال پیام"
        className={cn(
          "flex size-[18px]",
          "items-center justify-center",
          "rounded-full outline-none",

          "focus-visible:ring-2",
          "focus-visible:ring-[#F38353]/20",
        )}
      >
        <Info
          aria-hidden="true"
          strokeWidth={1.8}
          className="size-[18px] text-[#F38353]"
        />
      </button>

      <div
        role="tooltip"
        className={cn(
          "pointer-events-none",
          "invisible absolute",
          "left-[-12px] top-[30px]",
          "z-[110]",
          "flex h-[87px] w-[183px]",
          "translate-y-1",
          "items-center",
          "rounded-[16px]",
          "border border-[#EBEBEB]",
          "bg-white",
          "px-4 py-3",
          "text-right",
          "text-sm font-medium",
          "leading-[21px]",
          "text-[#434343]",
          "opacity-0",
          "shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
          "transition-all duration-150",

          "group-hover:visible",
          "group-hover:translate-y-0",
          "group-hover:opacity-100",

          "group-focus-within:visible",
          "group-focus-within:translate-y-0",
          "group-focus-within:opacity-100",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute -top-[6px] left-4",
            "size-[11px] rotate-45",
            "border-l border-t",
            "border-[#EBEBEB]",
            "bg-white",
          )}
        />

        در صورت غیرفعال کردن ارسال پیام،
        پیام شما برای مخاطب ارسال نمی‌شود.
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Full-width sender dropdown                         */
/* -------------------------------------------------------------------------- */

interface SenderLineDropdownProps {
  value: string;
  disabled: boolean;
  hasError: boolean;
  onChange: (value: string) => void;
}

function SenderLineDropdown({
  value,
  disabled,
  hasError,
  onChange,
}: SenderLineDropdownProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  const selectedLine =
    senderLines.find(
      (line) => line.id === value,
    );

  return (
    <div
      className="relative w-full"
      onBlur={(event) => {
        const nextTarget =
          event.relatedTarget as Node | null;

        if (
          !event.currentTarget.contains(
            nextTarget,
          )
        ) {
          setIsOpen(false);
        }
      }}
    >
      <button
        id="sender-line"
        type="button"
        dir="ltr"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-invalid={hasError}
        onClick={() => {
          setIsOpen(
            (current) => !current,
          );
        }}
        className={cn(
          "grid h-14 w-full",
          "grid-cols-[22px_1fr]",
          "items-center gap-2",
          "rounded-[16px]",
          "border-2",
          "bg-white px-4",
          "text-base font-medium",
          "leading-6",
          "shadow-none",
          "outline-none",
          "transition-colors",

          hasError
            ? "border-[#FF383C]"
            : "border-[#EBEBEB]",

          isOpen &&
            !hasError &&
            "border-[#F38353]",

          "focus-visible:border-[#F38353]",
          "focus-visible:ring-0",

          "disabled:cursor-not-allowed",
          "disabled:bg-[#F7F7F7]",
          "disabled:opacity-60",
        )}
      >
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-[22px]",
            "text-[#848382]",
            "transition-transform",

            isOpen && "rotate-180",
          )}
        />

        <span
          dir="ltr"
          className={cn(
            "block w-full",
            "text-right",
            "text-[#848382]",
          )}
        >
          {selectedLine?.label ??
            "خط ارسال را انتخاب کنید"}
        </span>
      </button>

      {isOpen && !disabled && (
        <div
          role="listbox"
          dir="rtl"
          aria-label="خط ارسال‌کننده پیامک"
          className={cn(
            "absolute inset-x-0",
            "top-[calc(100%+1px)]",
            "z-[100]",
            "w-full",
            "overflow-hidden",
            "rounded-[16px]",
            "border-2",
            "border-[#EBEBEB]",
            "bg-white",
            "p-0",
            "shadow-[0_12px_32px_rgba(0,0,0,0.08)]",
          )}
        >
          {senderLines.map(
            (line, index) => {
              const isSelected =
                value === line.id;

              return (
                <button
                  key={line.id}
                  type="button"
                  role="option"
                  dir="ltr"
                  aria-selected={
                    isSelected
                  }
                  onClick={() => {
                    onChange(line.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "grid h-12",
                    "w-full max-w-none",
                    "grid-cols-[22px_1fr]",
                    "items-center gap-2",
                    "px-4",
                    "text-base font-medium",
                    "outline-none",
                    "transition-colors",

                    isSelected
                      ? [
                          "bg-[#FFF4EF]",
                          "text-[#F38353]",
                        ]
                      : [
                          "bg-white",
                          "text-[#434343]",
                        ],

                    "hover:bg-[#FFF4EF]",
                    "hover:text-[#F38353]",

                    "focus:bg-[#FFF4EF]",
                    "focus:text-[#F38353]",

                    index <
                      senderLines.length -
                        1 &&
                      "border-b border-[#F3F3F3]",
                  )}
                >
                  <span className="flex size-[22px] items-center justify-center">
                    {isSelected && (
                      <Check
                        aria-hidden="true"
                        className="size-[18px]"
                      />
                    )}
                  </span>

                  <span
                    dir="ltr"
                    className="block w-full text-right"
                  >
                    {line.label}
                  </span>
                </button>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Main component                               */
/* -------------------------------------------------------------------------- */

export default function MessageEditor({
  control,
  errors,
  clearErrors,
  isEnabled,
  message,
  variables,
  onInsertToken,
  onOpenLinkDialog,
  onAiRewrite,
}: MessageEditorProps) {
  function handleInsertVariable(
    variable: MessageVariable,
  ) {
    const actualValue =
      variableValues[variable.id] ??
      variable.token;

    onInsertToken(actualValue);
  }

  return (
    <section
      dir="rtl"
      className={cn(
        "flex h-[537px]",
        "w-full flex-col",
        "gap-4",
      )}
    >
      {/* Title and toggle */}
      <div
        className={cn(
          "flex h-7 w-full",
          "items-center",
          "justify-between gap-4",
        )}
      >
        <h2
          className={cn(
            "m-0 text-right",
            "text-[18px] font-bold",
            "leading-[27px]",
            "text-[#434343]",
          )}
        >
          ویرایش پیام
        </h2>

        <div className="flex h-7 items-center justify-end gap-2">
          <Label
            htmlFor="entry-message-enabled"
            className={cn(
              "whitespace-nowrap",
              "text-right",
              "text-base font-medium",
              "leading-7",
              "text-[#434343]",
            )}
          >
            ارسال پیام
          </Label>

          <MessageInfoTooltip />

          <Controller
            control={control}
            name="isEnabled"
            render={({ field }) => (
              <MessageToggle
                checked={Boolean(
                  field.value,
                )}
                onCheckedChange={(
                  checked,
                ) => {
                  field.onChange(
                    checked,
                  );

                  if (!checked) {
                    clearErrors([
                      "senderLineId",
                      "message",
                    ]);
                  }
                }}
              />
            )}
          />
        </div>
      </div>

      {/* Channel */}
      <div
        className={cn(
          "flex h-8 w-full",
          "items-center justify-start",
        )}
      >
        <div className="flex items-center justify-start gap-2 text-right">
          <span
            className={cn(
              "text-base font-bold",
              "leading-6",
              "text-[#848382]",
            )}
          >
            کانال ارسال:
          </span>

          <span
            className={cn(
              "text-base font-bold",
              "leading-6",
              "text-[#434343]",
            )}
          >
            پیامک
          </span>
        </div>
      </div>

      {/* Sender number */}
      <div
        className={cn(
          "flex h-[88px]",
          "w-full flex-col",
          "items-end gap-1",
        )}
      >
        <Label
          htmlFor="sender-line"
          className={cn(
            "block h-7 w-full",
            "text-right",
            "text-base font-medium",
            "leading-7",
            "text-[#434343]",
          )}
        >
          خط ارسال‌کننده پیامک

          {isEnabled && (
            <span className="mr-1 text-[#FF383C]">
              *
            </span>
          )}
        </Label>

        <Controller
          control={control}
          name="senderLineId"
          render={({ field }) => (
            <SenderLineDropdown
              value={field.value}
              disabled={!isEnabled}
              hasError={Boolean(
                errors.senderLineId,
              )}
              onChange={
                field.onChange
              }
            />
          )}
        />

        {errors.senderLineId && (
          <p
            role="alert"
            className="w-full text-right text-sm text-[#FF383C]"
          >
            {
              errors.senderLineId
                .message
            }
          </p>
        )}
      </div>

      {/* AI button */}
      <div
        dir="ltr"
        className="flex h-10 w-full items-center justify-start"
      >
        <Button
          type="button"
          disabled={!isEnabled}
          onClick={onAiRewrite}
          className={cn(
            "h-10 w-[158px]",
            "rounded-[16px]",
            "border-0 px-4",
            "bg-[linear-gradient(90deg,#F0682D_0%,#F8BE3F_100%)]",
            "text-base font-bold",
            "leading-6 text-white",
            "shadow-[inset_-1.5px_-1.5px_1.5px_#ED591A]",

            "hover:opacity-90",
            "disabled:opacity-40",
          )}
        >
         AI بازنویسی با 

          <Sparkles className="size-[22px]" />
        </Button>
      </div>

      {/* Variables */}
      <div
        className={cn(
          "flex h-[29px]",
          "w-full items-start",
          "justify-start gap-2",
        )}
      >
        {variables.map(
          (variable) => (
            <Button
              key={variable.id}
              type="button"
              variant="outline"
              disabled={!isEnabled}
              onClick={() => {
                handleInsertVariable(
                  variable,
                );
              }}
              className={cn(
                "h-[29px]",
                "rounded-[8px]",
                "border border-[#F38353]",
                "bg-white px-3 py-1",
                "text-sm font-medium",
                "leading-[21px]",
                "text-[#F38353]",
                "shadow-none",

                "hover:bg-[#FFF4EF]",
                "hover:text-[#F38353]",
                "disabled:opacity-40",
              )}
            >
              {variable.label}
            </Button>
          ),
        )}

        <Button
          type="button"
          variant="outline"
          disabled={!isEnabled}
          onClick={onOpenLinkDialog}
          className={cn(
            "h-[29px]",
            "rounded-[8px]",
            "border border-[#F38353]",
            "bg-white px-3 py-1",
            "text-sm font-medium",
            "leading-[21px]",
            "text-[#F38353]",
            "shadow-none",

            "hover:bg-[#FFF4EF]",
            "hover:text-[#F38353]",
            "disabled:opacity-40",
          )}
        >
          لینک

          <Link2 className="size-[18px]" />
        </Button>
      </div>

      {/* Textarea */}
      <div className="relative h-[240px] w-full">
       <Controller
  control={control}
  name="message"
  render={({ field }) => (
    <Textarea
      ref={field.ref}
      name={field.name}
      value={field.value ?? ""}
      onBlur={field.onBlur}
      onChange={field.onChange}
      disabled={!isEnabled}
      aria-invalid={Boolean(
        errors.message,
      )}
      placeholder="متن پیام را بنویسید"
      maxLength={MAX_MESSAGE_LENGTH}
      className={cn(
        "h-[240px]",
        "min-h-[240px]",
        "w-full resize-none",
        "rounded-[16px]",
        "border-2 bg-white",
        "px-6 pb-12 pt-4",
        "text-right",
        "text-base font-medium",
        "leading-7",
        "text-[#434343]",
        "shadow-none",

        errors.message
          ? "border-[#FF383C]"
          : "border-[#EBEBEB]",

        "focus-visible:border-[#F38353]",
        "focus-visible:ring-0",
        "focus-visible:ring-offset-0",

        "disabled:bg-[#F7F7F7]",
      )}
    />
  )}
/>

        <span
          className={cn(
            "pointer-events-none",
            "absolute bottom-4 left-6",
            "text-xs font-medium",
            "leading-[18px]",
            "text-[#B4B4B4]",
          )}
        >
          {message.length}/
          {MAX_MESSAGE_LENGTH}
        </span>

        {errors.message && (
          <p
            role="alert"
            className={cn(
              "absolute -bottom-6 right-0",
              "text-right text-sm",
              "text-[#FF383C]",
            )}
          >
            {
              errors.message
                .message
            }
          </p>
        )}
      </div>
    </section>
  );
}