"use client";

import {
  useRef,
  useState,
} from "react";

import {
  Controller,
  useFormContext,
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
  isEnabled: boolean;
  message: string;

  variables: readonly MessageVariable[];

  onInsertToken: (
    value: string,
    start: number,
    end: number,
  ) => void;

  onOpenLinkDialog: () => void;
  onAiRewrite: () => void;
}


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
      onClick={() =>
        onCheckedChange(!checked)
      }
      className={cn(
        "relative inline-flex h-6 w-10.5 shrink-0 items-center rounded-lg p-1 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2",
        checked
          ? "bg-primary"
          : "bg-border",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1 top-1 size-4 rounded-sm bg-surface transition-transform duration-200",
          checked
            ? "translate-x-4.5"
            : "translate-x-0",
        )}
      />
    </button>
  );
}


function MessageInfoTooltip() {
  return (
    <div className="group relative flex size-4.5 items-center justify-center">
      <button
        type="button"
        aria-label="راهنمای ارسال پیام"
        className="flex size-4.5 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
      >
        <Info
          aria-hidden="true"
          strokeWidth={1.8}
          className="size-4.5 text-primary"
        />
      </button>

      <div
        role="tooltip"
        className="pointer-events-none invisible absolute -left-3 top-7.5 z-110 flex h-21.75 w-45.75 translate-y-1 items-center rounded-2xl border border-border bg-surface px-4 py-3 text-right text-sm font-medium leading-5.25 text-text opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
      >
        <span
          aria-hidden="true"
          className="absolute -top-1.5 left-4 size-2.75 rotate-45 border-l border-t border-border bg-surface"
        />

        در صورت غیرفعال کردن ارسال پیام، پیام شما برای مخاطب ارسال نمی‌شود.
      </div>
    </div>
  );
}


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
        onClick={() =>
          setIsOpen(
            (current) => !current,
          )
        }
        className={cn(
          "grid h-14 w-full grid-cols-[22px_1fr] items-center gap-2 rounded-2xl border-2 bg-surface px-4 text-base font-medium leading-6 shadow-none outline-none transition-colors focus-visible:border-primary focus-visible:ring-0 disabled:cursor-not-allowed disabled:bg-background disabled:opacity-60",
          {
            "border-danger":
              hasError,

            "border-primary":
              isOpen && !hasError,

            "border-border":
              !isOpen && !hasError,
          },
        )}
      >
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-5.5 text-text-muted transition-transform",
            isOpen &&
              "rotate-180",
          )}
        />

        <span
          dir="ltr"
          className="block w-full text-right text-text-muted"
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
          className="absolute inset-x-0 top-[calc(100%+1px)] z-100 w-full overflow-hidden rounded-2xl border-2 border-border bg-surface shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
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
                    "grid h-12 w-full grid-cols-[22px_1fr] items-center gap-2 px-4 text-base font-medium outline-none transition-colors hover:bg-primary-soft hover:text-primary focus:bg-primary-soft focus:text-primary",
                    isSelected
                      ? "bg-primary-soft text-primary"
                      : "bg-surface text-text",

                    index <
                      senderLines.length -
                        1 &&
                      "border-b border-border",
                  )}
                >
                  <span className="flex size-5.5 items-center justify-center">
                    {isSelected && (
                      <Check
                        aria-hidden="true"
                        className="size-4.5"
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


export default function MessageEditor({
  isEnabled,
  message,
  variables,
  onInsertToken,
  onOpenLinkDialog,
  onAiRewrite,
}: MessageEditorProps) {
  const {
    control,
    clearErrors,
    formState: { errors },
  } =
    useFormContext<EntryMessageFormValues>();

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(null);


  function handleInsertVariable(
    variable: MessageVariable,
  ) {
    const textarea =
      textareaRef.current;

    if (!textarea) {
      return;
    }

    const start =
      textarea.selectionStart;

    const end =
      textarea.selectionEnd;

    const value =
      variableValues[variable.id] ??
      variable.token;

    const insertedValue =
      `${value} `;

    onInsertToken(
      insertedValue,
      start,
      end,
    );

    const nextPosition =
      start + insertedValue.length;

    requestAnimationFrame(() => {
      textarea.focus();

      textarea.setSelectionRange(
        nextPosition,
        nextPosition,
      );
    });
  }


  return (
    <section
      dir="rtl"
      className="flex h-134.25 w-full flex-col gap-4"
    >
      {/* Title */}
      <div className="flex h-7 w-full items-center justify-between gap-4">
        <h2 className="m-0 text-right text-lg font-bold leading-6.75 text-text">
          ویرایش پیام
        </h2>

        <div className="flex h-7 items-center justify-end gap-2">
          <Label
            htmlFor="entry-message-enabled"
            className="whitespace-nowrap text-right text-base font-medium leading-7 text-text"
          >
            ارسال پیام
          </Label>

          <MessageInfoTooltip />

          <Controller
            control={control}
            name="isEnabled"
            render={({ field }) => (
              <MessageToggle
                checked={
                  Boolean(field.value)
                }
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
      <div className="flex h-8 w-full items-center justify-start">
        <div className="flex items-center justify-start gap-2 text-right">
          <span className="text-base font-bold leading-6 text-text-muted">
            کانال ارسال:
          </span>

          <span className="text-base font-bold leading-6 text-text">
            پیامک
          </span>
        </div>
      </div>


      {/* Sender */}
      <div className="flex h-22 w-full flex-col items-end gap-1">
        <Label
          htmlFor="sender-line"
          className="block h-7 w-full text-right text-base font-medium leading-7 text-text"
        >
          خط ارسال‌کننده پیامک

          {isEnabled && (
            <span className="mr-1 text-danger">
              *
            </span>
          )}
        </Label>

        <Controller
          control={control}
          name="senderLineId"
          render={({ field }) => (
            <SenderLineDropdown
              value={
                field.value
              }
              disabled={
                !isEnabled
              }
              hasError={
                !!errors.senderLineId
              }
              onChange={
                field.onChange
              }
            />
          )}
        />

        {errors.senderLineId && (
          <p
            role="alert"
            className="w-full text-right text-sm text-danger"
          >
            {
              errors.senderLineId
                .message
            }
          </p>
        )}
      </div>


      {/* AI */}
      <div
        dir="ltr"
        className="flex h-10 w-full items-center justify-start"
      >
        <Button
          type="button"
          disabled={!isEnabled}
          onClick={onAiRewrite}
          className="h-10 w-39.5 rounded-2xl border-0 bg-[linear-gradient(90deg,#F0682D_0%,#F8BE3F_100%)] px-4 text-base font-bold leading-6 text-white shadow-[inset_-1.5px_-1.5px_1.5px_#ED591A] hover:opacity-90 disabled:opacity-40"
        >
          AI بازنویسی با

          <Sparkles className="size-5.5" />
        </Button>
      </div>


      {/* Variables */}
      <div className="flex h-7.25 w-full items-start justify-start gap-2">
        {variables.map(
          (variable) => (
            <Button
              key={variable.id}
              type="button"
              variant="outline"
              disabled={
                !isEnabled
              }
              onMouseDown={(
                event,
              ) => {
                event.preventDefault();
              }}
              onClick={() =>
                handleInsertVariable(
                  variable,
                )
              }
              className="h-7.25 rounded-lg border border-primary bg-surface px-3 py-1 text-sm font-medium leading-5.25 text-primary shadow-none hover:bg-primary-soft hover:text-primary disabled:opacity-40"
            >
              {variable.label}
            </Button>
          ),
        )}

        <Button
          type="button"
          variant="outline"
          disabled={!isEnabled}
          onClick={
            onOpenLinkDialog
          }
          className="h-7.25 rounded-lg border border-primary bg-surface px-3 py-1 text-sm font-medium leading-5.25 text-primary shadow-none hover:bg-primary-soft hover:text-primary disabled:opacity-40"
        >
          لینک

          <Link2 className="size-4.5" />
        </Button>
      </div>


      {/* Textarea */}
      <div className="relative h-60 w-full">
        <Controller
          control={control}
          name="message"
          render={({ field }) => (
            <Textarea
              ref={(element) => {
                textareaRef.current =
                  element;

                field.ref(element);
              }}
              name={field.name}
              value={
                field.value ?? ""
              }
              onBlur={
                field.onBlur
              }
              onChange={
                field.onChange
              }
              disabled={
                !isEnabled
              }
              aria-invalid={
                !!errors.message
              }
              placeholder="متن پیام را بنویسید"
              className={cn(
                "h-60 min-h-60 w-full resize-none rounded-2xl border-2 bg-surface px-6 pb-12 pt-4 text-right text-base font-medium leading-7 text-text shadow-none focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 disabled:bg-background",
                errors.message
                  ? "border-danger"
                  : "border-border",
              )}
            />
          )}
        />

        <span className="pointer-events-none absolute bottom-4 left-6 text-xs font-medium leading-4.5 text-text-disabled">
          {message.length}/
          {MAX_MESSAGE_LENGTH}
        </span>

        {errors.message && (
          <p
            role="alert"
            className="absolute -bottom-6 right-0 text-right text-sm text-danger"
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