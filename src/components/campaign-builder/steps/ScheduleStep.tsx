"use client";

import { useState } from "react";

import {
  CalendarDays,
} from "lucide-react";

import DatePicker, {
  DateObject,
} from "react-multi-date-picker";

import persian from "react-date-object/calendars/persian";
import persianFa from "react-date-object/locales/persian_fa";

import {
  Controller,
  useForm,
  useWatch,
  type FieldErrors,
  type SubmitHandler,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  nextStep,
  previousStep,
  scheduleSaved,
  selectSchedule,
} from "@/lib/features/campaign-builder/campaignBuilderSlice";

import {
  scheduleSchema,
  type ScheduleFormValues,
} from "@/lib/features/campaign-builder/scheduleSchema";

import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/hooks";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                              Default values                                */
/* -------------------------------------------------------------------------- */

const EMPTY_SCHEDULE: ScheduleFormValues = {
  startDate: "",
  startHour: "",
  startMinute: "",
  startSecond: "",

  endDate: "",
  endHour: "",
  endMinute: "",
  endSecond: "",
};

/* -------------------------------------------------------------------------- */
/*                              Date helpers                                  */
/* -------------------------------------------------------------------------- */

/**
 * Converts a stored Gregorian YYYY-MM-DD string
 * to an independent JavaScript Date.
 */
function isoDateToLocalDate(
  value: string,
): Date | undefined {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  if (
    !year ||
    !month ||
    !day
  ) {
    return undefined;
  }

  const date = new Date(
    year,
    month - 1,
    day,
  );

  if (
    Number.isNaN(date.getTime())
  ) {
    return undefined;
  }

  return date;
}

/**
 * Converts the selected Persian DateObject
 * to a Gregorian YYYY-MM-DD string.
 */
function dateObjectToIsoDate(
  dateObject: DateObject,
): string {
  const date =
    dateObject.toDate();

  const year = String(
    date.getFullYear(),
  );

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* -------------------------------------------------------------------------- */
/*                              Time helpers                                  */
/* -------------------------------------------------------------------------- */

function convertPersianNumbers(
  value: string,
): string {
  const persianNumbers =
    "۰۱۲۳۴۵۶۷۸۹";

  const arabicNumbers =
    "٠١٢٣٤٥٦٧٨٩";

  return value
    .replace(
      /[۰-۹]/g,
      (character) =>
        String(
          persianNumbers.indexOf(
            character,
          ),
        ),
    )
    .replace(
      /[٠-٩]/g,
      (character) =>
        String(
          arabicNumbers.indexOf(
            character,
          ),
        ),
    );
}

function normalizeTimeInput(
  value: string,
): string {
  return convertPersianNumbers(value)
    .replace(/\D/g, "")
    .slice(0, 2);
}

/* -------------------------------------------------------------------------- */
/*                         Persian calendar field                             */
/* -------------------------------------------------------------------------- */

interface DateFieldProps {
  id: string;
  label: string;
  value: string;

  required?: boolean;
  disabled?: boolean;

  minimumDate?: string;

  error?: string;

  onChange: (value: string) => void;
  onBlur: () => void;
}

function DateField({
  id,
  label,
  value,
  required = false,
  disabled = false,
  minimumDate,
  error,
  onChange,
  onBlur,
}: DateFieldProps) {
  const pickerValue =
    isoDateToLocalDate(value);

  const pickerMinimumDate =
    minimumDate
      ? isoDateToLocalDate(
          minimumDate,
        )
      : undefined;

  return (
    <div>
      <Label
        htmlFor={id}
        className="mb-3 block text-right font-medium text-[#444]"
      >
        {label}

        {required && (
          <span className="mr-1 text-red-500">
            *
          </span>
        )}
      </Label>

      <DatePicker
        /*
         * The unique key keeps the start and end
         * calendars completely independent.
         */
        key={id}
        value={pickerValue}
        minDate={pickerMinimumDate}
        calendar={persian}
        locale={persianFa}
        format="YYYY/MM/DD"
        calendarPosition="bottom-right"
        editable={false}
        disabled={disabled}
        containerClassName="w-full"
        onChange={(selectedDate) => {
          if (
            !selectedDate ||
            Array.isArray(selectedDate)
          ) {
            onChange("");
            return;
          }

          const isoDate =
            dateObjectToIsoDate(
              selectedDate,
            );

          /*
           * This updates only the Controller
           * belonging to this DateField.
           */
          onChange(isoDate);
        }}
        onClose={onBlur}
        render={(
          formattedValue,
          openCalendar,
        ) => (
          <button
            id={id}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                openCalendar();
              }
            }}
            aria-invalid={Boolean(error)}
            className={cn(
              "flex h-[52px] w-full",
              "items-center justify-between",
              "rounded-2xl border",
              "px-5 text-sm transition",

              error
                ? "border-red-500"
                : "border-[#dedede]",

              disabled
                ? [
                    "cursor-not-allowed",
                    "bg-[#f7f7f7]",
                    "text-[#aaa]",
                  ]
                : [
                    "cursor-pointer",
                    "bg-white",
                    "hover:border-[#ff7c4d]",
                    "focus:border-[#ff7c4d]",
                    "focus:outline-none",
                    "focus:ring-2",
                    "focus:ring-[#ff7c4d]/15",
                  ],
            )}
          >
            <span
              dir="rtl"
              className={cn(
                formattedValue
                  ? "text-[#555]"
                  : "text-[#aaa]",
              )}
            >
              {formattedValue ||
                "انتخاب کنید"}
            </span>

            <CalendarDays
              className={cn(
                "size-5",

                disabled
                  ? "text-[#aaa]"
                  : "text-[#777]",
              )}
            />
          </button>
        )}
      />

      {error && (
        <p
          role="alert"
          className="mt-2 text-sm text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Time field                                    */
/* -------------------------------------------------------------------------- */

interface TimeSegmentProps {
  value: string;
  placeholder: string;

  disabled?: boolean;
  hasError?: boolean;

  onChange: (value: string) => void;
  onBlur: () => void;
}

function TimeSegment({
  value,
  placeholder,
  disabled = false,
  hasError = false,
  onChange,
  onBlur,
}: TimeSegmentProps) {
  return (
    <Input
      type="text"
      dir="ltr"
      inputMode="numeric"
      autoComplete="off"
      value={value}
      disabled={disabled}
      maxLength={2}
      placeholder={placeholder}
      aria-invalid={hasError}
      onChange={(event) => {
        onChange(
          normalizeTimeInput(
            event.target.value,
          ),
        );
      }}
      onBlur={() => {
        if (value) {
          onChange(
            value.padStart(2, "0"),
          );
        }

        onBlur();
      }}
      className={cn(
        "h-12 rounded-2xl",
        "text-center shadow-none",
        "placeholder:text-[#aaa]",

        hasError
          ? "border-red-500"
          : "border-[#dedede]",

        "focus-visible:border-[#ff7c4d]",
        "focus-visible:ring-[#ff7c4d]/15",

        disabled &&
          "bg-[#f7f7f7] text-[#aaa]",
      )}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main component                                */
/* -------------------------------------------------------------------------- */

export default function ScheduleStep() {
  const dispatch = useAppDispatch();

  const storedSchedule =
    useAppSelector(selectSchedule);

  const savedSchedule =
    storedSchedule ??
    EMPTY_SCHEDULE;

  const [
    submitError,
    setSubmitError,
  ] = useState("");

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,

    formState: {
      errors,
    },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(
      scheduleSchema,
    ),

    mode: "onSubmit",

    reValidateMode: "onChange",

    defaultValues: {
      startDate:
        savedSchedule.startDate ??
        "",

      startHour:
        savedSchedule.startHour ??
        "",

      startMinute:
        savedSchedule.startMinute ??
        "",

      startSecond:
        savedSchedule.startSecond ??
        "",

      endDate:
        savedSchedule.endDate ??
        "",

      endHour:
        savedSchedule.endHour ??
        "",

      endMinute:
        savedSchedule.endMinute ??
        "",

      endSecond:
        savedSchedule.endSecond ??
        "",
    },
  });

  const startDate =
    useWatch({
      control,
      name: "startDate",
    }) ?? "";

  const endDate =
    useWatch({
      control,
      name: "endDate",
    }) ?? "";

  const isEndTimeDisabled =
    !endDate;

  const startTimeError =
    errors.startHour?.message ||
    errors.startMinute?.message ||
    errors.startSecond?.message;

  const endTimeError =
    errors.endHour?.message ||
    errors.endMinute?.message ||
    errors.endSecond?.message;

  const handleValidSubmit: SubmitHandler<
    ScheduleFormValues
  > = (values) => {
    setSubmitError("");

    dispatch(
      scheduleSaved(values),
    );

    dispatch(nextStep());
  };

  function handleInvalidSubmit(
    validationErrors: FieldErrors<
      ScheduleFormValues
    >,
  ) {
    console.error(
      "Schedule validation errors:",
      validationErrors,
    );

    setSubmitError(
      "لطفاً خطاهای فرم را بررسی کنید.",
    );
  }

  function handleSaveDraft() {
    dispatch(
      scheduleSaved(
        getValues(),
      ),
    );
  }

  function handleStartDateChange(
    value: string,
    onChange: (
      value: string,
    ) => void,
  ) {
    /*
     * Only the start date is updated.
     * The end date is not modified.
     */
    onChange(value);

    clearErrors("startDate");
    setSubmitError("");
  }

  function handleEndDateChange(
    value: string,
    onChange: (
      value: string,
    ) => void,
  ) {
    /*
     * Only the end date is updated.
     */
    onChange(value);

    clearErrors("endDate");
    setSubmitError("");

    /*
     * End times are cleared only when
     * the user removes the end date.
     */
    if (!value) {
      setValue(
        "endHour",
        "",
        {
          shouldDirty: true,
          shouldValidate: false,
        },
      );

      setValue(
        "endMinute",
        "",
        {
          shouldDirty: true,
          shouldValidate: false,
        },
      );

      setValue(
        "endSecond",
        "",
        {
          shouldDirty: true,
          shouldValidate: false,
        },
      );

      clearErrors([
        "endHour",
        "endMinute",
        "endSecond",
      ]);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(
        handleValidSubmit,
        handleInvalidSubmit,
      )}
      noValidate
      className={cn(
        "mx-auto flex w-full",
        "min-h-[700px]",
        "max-w-[800px] flex-col",
        "px-6 py-12",
      )}
    >
      <div className="mx-auto w-full max-w-[520px]">
        {/* Start date */}
        <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <DateField
              id="campaign-start-date"
              label="تاریخ شروع"
              required
              value={field.value}
              error={
                errors.startDate?.message
              }
              onChange={(value) => {
                handleStartDateChange(
                  value,
                  field.onChange,
                );
              }}
              onBlur={field.onBlur}
            />
          )}
        />

        {/* Start time */}
        <div className="mt-7">
          <Label className="mb-3 block text-right font-medium text-[#444]">
            زمان شروع

            <span className="mr-1 text-red-500">
              *
            </span>
          </Label>

          <div
            dir="ltr"
            className={cn(
              "grid",
              "grid-cols-[1fr_auto_1fr_auto_1fr]",
              "items-center gap-3",
            )}
          >
            <Controller
              control={control}
              name="startHour"
              render={({ field }) => (
                <TimeSegment
                  value={field.value}
                  placeholder="ساعت"
                  hasError={Boolean(
                    errors.startHour,
                  )}
                  onChange={(value) => {
                    field.onChange(value);
                    setSubmitError("");
                  }}
                  onBlur={field.onBlur}
                />
              )}
            />

            <span className="text-lg text-[#777]">
              :
            </span>

            <Controller
              control={control}
              name="startMinute"
              render={({ field }) => (
                <TimeSegment
                  value={field.value}
                  placeholder="دقیقه"
                  hasError={Boolean(
                    errors.startMinute,
                  )}
                  onChange={(value) => {
                    field.onChange(value);
                    setSubmitError("");
                  }}
                  onBlur={field.onBlur}
                />
              )}
            />

            <span className="text-lg text-[#777]">
              :
            </span>

            <Controller
              control={control}
              name="startSecond"
              render={({ field }) => (
                <TimeSegment
                  value={field.value}
                  placeholder="ثانیه"
                  hasError={Boolean(
                    errors.startSecond,
                  )}
                  onChange={(value) => {
                    field.onChange(value);
                    setSubmitError("");
                  }}
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>

          {startTimeError && (
            <p
              role="alert"
              className="mt-2 text-sm text-red-500"
            >
              {startTimeError}
            </p>
          )}
        </div>

        <div className="my-7 h-px bg-[#ededed]" />

        {/* End date */}
        <Controller
          control={control}
          name="endDate"
          render={({ field }) => (
            <DateField
              id="campaign-end-date"
              label="تاریخ پایان"
              value={field.value}
              minimumDate={startDate}
              error={
                errors.endDate?.message
              }
              onChange={(value) => {
                handleEndDateChange(
                  value,
                  field.onChange,
                );
              }}
              onBlur={field.onBlur}
            />
          )}
        />

        {/* End time */}
        <div className="mt-7">
          <Label className="mb-3 block text-right font-medium text-[#444]">
            زمان پایان
          </Label>

          <div
            dir="ltr"
            className={cn(
              "grid",
              "grid-cols-[1fr_auto_1fr_auto_1fr]",
              "items-center gap-3",
            )}
          >
            <Controller
              control={control}
              name="endHour"
              render={({ field }) => (
                <TimeSegment
                  value={field.value}
                  placeholder="ساعت"
                  disabled={
                    isEndTimeDisabled
                  }
                  hasError={Boolean(
                    errors.endHour,
                  )}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />

            <span
              className={cn(
                "text-lg",

                isEndTimeDisabled
                  ? "text-[#bbb]"
                  : "text-[#777]",
              )}
            >
              :
            </span>

            <Controller
              control={control}
              name="endMinute"
              render={({ field }) => (
                <TimeSegment
                  value={field.value}
                  placeholder="دقیقه"
                  disabled={
                    isEndTimeDisabled
                  }
                  hasError={Boolean(
                    errors.endMinute,
                  )}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />

            <span
              className={cn(
                "text-lg",

                isEndTimeDisabled
                  ? "text-[#bbb]"
                  : "text-[#777]",
              )}
            >
              :
            </span>

            <Controller
              control={control}
              name="endSecond"
              render={({ field }) => (
                <TimeSegment
                  value={field.value}
                  placeholder="ثانیه"
                  disabled={
                    isEndTimeDisabled
                  }
                  hasError={Boolean(
                    errors.endSecond,
                  )}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>

          {endTimeError && (
            <p
              role="alert"
              className="mt-2 text-sm text-red-500"
            >
              {endTimeError}
            </p>
          )}
        </div>

        {submitError && (
          <div
            role="alert"
            className={cn(
              "mt-7 rounded-2xl",
              "border border-red-200",
              "bg-red-50 px-4 py-3",
              "text-sm text-red-600",
            )}
          >
            {submitError}
          </div>
        )}
      </div>

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
            "text-[#ff7c4d]",
            "hover:bg-[#fff5f1]",
            "hover:text-[#ff7c4d]",
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
            type="submit"
            className={cn(
              "h-12 min-w-44",
              "rounded-2xl",
              "bg-[#ff7c4d]",
              "font-bold text-white",
              "hover:bg-[#f16e40]",
            )}
          >
            ادامه
          </Button>
        </div>
      </div>
    </form>
  );
}