"use client";

import type {
  Control,
  FieldErrors,
  UseFormClearErrors,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  ImagePlus,
  Info,
  Link2,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ResultMessageFormValues } from "@/lib/features/campaign-builder/resultMessageSchema";
import { cn } from "@/lib/utils";

const MAX_MESSAGE_LENGTH = 500;

export interface ResultMessageVariable {
  id: string;
  label: string;
  value: string;
}

interface ResultMessageEditorProps {
  control: Control<ResultMessageFormValues>;
  errors: FieldErrors<ResultMessageFormValues>;
  clearErrors: UseFormClearErrors<ResultMessageFormValues>;
  isEnabled: boolean;
  message: string;
  imageUrl: string;
  imageError: string;
  variables: readonly ResultMessageVariable[];
  onInsertValue: (value: string) => void;
  onOpenLinkDialog: () => void;
  onAiRewrite: () => void;
  onImageButtonClick: () => void;
  onDeleteImage: () => void;
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
      id="result-message-enabled"
      type="button"
      role="switch"
      dir="ltr"
      aria-checked={checked}
      aria-label="فعال یا غیرفعال کردن ارسال پیام"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-10.5 shrink-0 items-center",
        "rounded-lg border-0 p-1 outline-none",
        "transition-colors duration-200",
        checked ? "bg-[#F38353]" : "bg-[#EBEBEB]",
        "focus-visible:ring-2 focus-visible:ring-[#F38353]/20",
        "focus-visible:ring-offset-2",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1 top-1 size-4 rounded-sm bg-white",
          "transition-transform duration-200",
          checked ? "translate-x-4.5" : "translate-x-0",
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
        className={cn(
          "flex size-4.5 items-center justify-center rounded-full outline-none",
          "focus-visible:ring-2 focus-visible:ring-[#F38353]/20",
        )}
      >
        <Info
          aria-hidden="true"
          strokeWidth={1.8}
          className="size-4.5 text-[#F38353]"
        />
      </button>

      <div
        role="tooltip"
        className={cn(
          "pointer-events-none invisible absolute -left-3 top-7.5 z-110",
          "flex h-21.75 w-45.75 translate-y-1 items-center",
          "rounded-2xl border border-[#EBEBEB] bg-white px-4 py-3",
          "text-right text-sm font-medium leading-5.25 text-[#434343]",
          "opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
          "transition-all duration-150",
          "group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
          "group-focus-within:visible group-focus-within:translate-y-0",
          "group-focus-within:opacity-100",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute -top-1.5 left-4 size-2.75 rotate-45",
            "border-l border-t border-[#EBEBEB] bg-white",
          )}
        />
        در صورت غیرفعال کردن ارسال پیام، پیام برای مخاطب ارسال نمی‌شود.
      </div>
    </div>
  );
}

export default function ResultMessageEditor({
  control,
  errors,
  clearErrors,
  isEnabled,
  message,
  imageUrl,
  imageError,
  variables,
  onInsertValue,
  onOpenLinkDialog,
  onAiRewrite,
  onImageButtonClick,
  onDeleteImage,
}: ResultMessageEditorProps) {
  return (
    <section dir="rtl" className="flex w-full flex-col gap-4">
      <div className="flex h-7 w-full items-center justify-between gap-4">
        <h2 className="m-0 text-right text-[18px] font-bold leading-6.75 text-[#434343]">
          ویرایش پیام
        </h2>

        <div className="flex h-7 items-center justify-end gap-2">
          <Label
            htmlFor="result-message-enabled"
            className="whitespace-nowrap text-right text-base font-medium leading-7 text-[#434343]"
          >
            ارسال پیام
          </Label>

          <MessageInfoTooltip />

          <Controller
            control={control}
            name="isEnabled"
            render={({ field }) => (
              <MessageToggle
                checked={Boolean(field.value)}
                onCheckedChange={(checked) => {
                  field.onChange(checked);

                  if (!checked) {
                    clearErrors(["message", "imageUrl"]);
                  }
                }}
              />
            )}
          />
        </div>
      </div>

      <div className="flex h-8 w-full items-center justify-start">
        <div className="flex items-center justify-start gap-2 text-right">
          <span className="text-base font-bold leading-6 text-[#848382]">
            کانال ارسال:
          </span>
          <span className="text-base font-bold leading-6 text-[#434343]">
            پیام‌رسان بله
          </span>
        </div>
      </div>

      <div
  className={cn(
    "flex min-h-52.5 w-full",
    "flex-row-reverse items-center gap-6",
    "rounded-2xl border-2 border-dashed",
    "border-[#EBEBEB] p-4",
    !isEnabled && "bg-[#F7F7F7] opacity-60",
  )}
>
  {/* Centered action icons */}
  <div
    dir="ltr"
    className="flex flex-1 items-center justify-start gap-3"
  >
    {imageUrl && (
      <Button
        type="button"
        size="icon"
        variant="ghost"
        disabled={!isEnabled}
        onClick={onDeleteImage}
        className="text-[#FF383C] hover:bg-red-50 hover:text-[#FF383C]"
      >
        <Trash2 className="size-5" />
      </Button>
    )}

    <Button
      type="button"
      size="icon"
      variant="ghost"
      disabled={!isEnabled}
      onClick={onImageButtonClick}
      className="text-[#555]"
    >
      {imageUrl ? (
        <Pencil className="size-5" />
      ) : (
        <ImagePlus className="size-5" />
      )}
    </Button>
  </div>

  {/* Image */}
  <button
    type="button"
    disabled={!isEnabled}
    onClick={onImageButtonClick}
    className={cn(
      "flex size-47.5 shrink-0",
      "items-center justify-center overflow-hidden",
      "rounded-2xl bg-[#F3F3F3]",
      "outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-[#F38353]/20",
    )}
  >
    {imageUrl ? (
      <img
        src={imageUrl}
        alt="تصویر پیام نتیجه"
        className="size-full object-cover"
      />
    ) : (
      <span className="flex flex-col items-center gap-3 text-[#999]">
        <ImagePlus className="size-9" />

        <span className="text-xs">
          افزودن تصویر
        </span>
      </span>
    )}
  </button>
</div>

      {imageError && (
        <p className="text-right text-sm text-[#FF383C]">{imageError}</p>
      )}

      <div dir="ltr" className="flex h-10 w-full items-center justify-start">
        <Button
          type="button"
          disabled={!isEnabled}
          onClick={onAiRewrite}
          className={cn(
            "h-10 w-39.5 rounded-2xl border-0 px-4",
            "bg-[linear-gradient(90deg,#F0682D_0%,#F8BE3F_100%)]",
            "text-base font-bold leading-6 text-white ",
            "shadow-[inset_-1.5px_-1.5px_1.5px_#ED591A]",
            "hover:opacity-90 disabled:opacity-40",
          )}
        >
         AI بازنویسی با 
          <Sparkles className="size-5.5" />
        </Button>
      </div>

      <div className="flex min-h-7.25 w-full flex-wrap items-start justify-start gap-2">
        {variables.map((variable) => (
          <Button
            key={variable.id}
            type="button"
            variant="outline"
            disabled={!isEnabled}
            onClick={() => onInsertValue(variable.value)}
            className={cn(
              "h-7.25 rounded-lg border border-[#F38353]",
              "bg-white px-3 py-1 text-sm font-medium leading-5.25",
              "text-[#F38353] shadow-none",
              "hover:bg-[#FFF4EF] hover:text-[#F38353] disabled:opacity-40",
            )}
          >
            {variable.label}
          </Button>
        ))}

        <Button
          type="button"
          variant="outline"
          disabled={!isEnabled}
          onClick={onOpenLinkDialog}
          className={cn(
            "h-7.25 rounded-lg border border-[#F38353]",
            "bg-white px-3 py-1 text-sm font-medium leading-5.25",
            "text-[#F38353] shadow-none",
            "hover:bg-[#FFF4EF] hover:text-[#F38353] disabled:opacity-40",
          )}
        >
          لینک
          <Link2 className="size-4.5" />
        </Button>
      </div>

      <div className="relative h-60 w-full">
        <Controller
          control={control}
          name="message"
          render={({ field }) => (
            <Textarea
              ref={field.ref}
              name={field.name}
              value={field.value ?? ""}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(event.target.value)}
              disabled={!isEnabled}
              aria-invalid={Boolean(errors.message)}
              maxLength={MAX_MESSAGE_LENGTH}
              placeholder="متن پیام را بنویسید"
              className={cn(
                "h-60 min-h-60 w-full resize-none rounded-2xl",
                "border-2 bg-white px-6 pb-12 pt-4 text-right",
                "text-base font-medium leading-7 text-[#434343] shadow-none",
                errors.message ? "border-[#FF383C]" : "border-[#EBEBEB]",
                "focus-visible:border-[#F38353] focus-visible:ring-0",
                "focus-visible:ring-offset-0 disabled:bg-[#F7F7F7]",
              )}
            />
          )}
        />

        <span className="pointer-events-none absolute bottom-4 left-6 text-xs font-medium leading-4.5 text-[#B4B4B4]">
          {message.length}/{MAX_MESSAGE_LENGTH}
        </span>

        {errors.message && (
          <p
            role="alert"
            className="absolute -bottom-6 right-0 text-right text-sm text-[#FF383C]"
          >
            {errors.message.message}
          </p>
        )}
      </div>
    </section>
  );
}
