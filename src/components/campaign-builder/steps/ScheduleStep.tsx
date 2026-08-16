"use client";

import { CalendarDays } from "lucide-react";

import DatePicker, {
  DateObject,
} from "react-multi-date-picker";

import persian from "react-date-object/calendars/persian";
import persianFa from "react-date-object/locales/persian_fa";

import {
  Controller,
  useForm,
  useWatch,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

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


function isoDateToLocalDate(
  value: string,
): Date | undefined {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  const date = new Date(
    year,
    month - 1,
    day,
  );

  return Number.isNaN(
    date.getTime(),
  )
    ? undefined
    : date;
}


function dateObjectToIsoDate(
  dateObject: DateObject,
): string {
  const date = dateObject.toDate();

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


function normalizeTimeInput(
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
    )
    .replace(/\D/g, "")
    .slice(0, 2);
}


interface DateFieldProps {
  id: string;
  label: string;
  value: string;

  required?: boolean;
  minimumDate?: string;

  error?: string;

  onChange: (
    value: string,
  ) => void;

  onBlur: () => void;
}


function DateField({
  id,
  label,
  value,
  required = false,
  minimumDate,
  error,
  onChange,
  onBlur,
}: DateFieldProps) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="mb-3 block text-right font-medium text-text"
      >
        {label}

        {required && (
          <span className="mr-1 text-danger">
            *
          </span>
        )}
      </Label>

      <DatePicker
        key={id}
        value={
          isoDateToLocalDate(
            value,
          )
        }
        minDate={
          minimumDate
            ? isoDateToLocalDate(
                minimumDate,
              )
            : undefined
        }
        calendar={persian}
        locale={persianFa}
        format="YYYY/MM/DD"
        calendarPosition="bottom-right"
        editable={false}
        containerClassName="w-full"
        onChange={(selectedDate) => {
          if (
            !selectedDate ||
            Array.isArray(
              selectedDate,
            )
          ) {
            onChange("");
            return;
          }

          onChange(
            dateObjectToIsoDate(
              selectedDate,
            ),
          );
        }}
        onClose={onBlur}
        render={(
          formattedValue,
          openCalendar,
        ) => (
          <button
            id={id}
            type="button"
            onClick={openCalendar}
            aria-invalid={!!error}
            className={cn(
              "flex h-13 w-full items-center justify-between rounded-2xl border bg-surface px-5 text-sm transition hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15",
              error
                ? "border-danger"
                : "border-border-strong",
            )}
          >
            <span
              dir="rtl"
              className={
                formattedValue
                  ? "text-text"
                  : "text-text-disabled"
              }
            >
              {formattedValue ||
                "انتخاب کنید"}
            </span>

            <CalendarDays className="size-5 text-text-muted" />
          </button>
        )}
      />

      {error && (
        <p
          role="alert"
          className="mt-2 text-sm text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}


interface TimeSegmentProps {
  value: string;
  placeholder: string;

  disabled?: boolean;
  hasError?: boolean;

  onChange: (
    value: string,
  ) => void;

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
            value.padStart(
              2,
              "0",
            ),
          );
        }

        onBlur();
      }}
      className={cn(
        "h-12 rounded-2xl text-center shadow-none placeholder:text-text-disabled focus-visible:border-primary focus-visible:ring-primary/15",
        hasError
          ? "border-danger"
          : "border-border-strong",
        disabled &&
          "bg-background text-text-disabled",
      )}
    />
  );
}


export default function ScheduleStep() {
  const dispatch =
    useAppDispatch();

  const savedSchedule =
    useAppSelector(
      selectSchedule,
    ) ?? EMPTY_SCHEDULE;


  const {
    control,
    getValues,
    setValue,
    clearErrors,
    trigger,

    formState: {
      errors,
    },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(
      scheduleSchema,
    ),

    mode: "onSubmit",

    defaultValues:
      savedSchedule,
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


  async function handleSaveDraft() {
    const isValid =
      await trigger();

    if (!isValid) {
      return;
    }

    dispatch(
      scheduleSaved(
        getValues(),
      ),
    );
  }


  async function handleNext() {
    const isValid =
      await trigger();

    if (!isValid) {
      return;
    }

    dispatch(
      scheduleSaved(
        getValues(),
      ),
    );

    dispatch(nextStep());
  }


  function handlePrevious() {
    dispatch(previousStep());
  }


  function handleEndDateChange(
    value: string,
    onChange: (
      value: string,
    ) => void,
  ) {
    onChange(value);

    if (value) {
      return;
    }

    const endTimeFields = [
      "endHour",
      "endMinute",
      "endSecond",
    ] as const;

    endTimeFields.forEach(
      (field) => {
        setValue(
          field,
          "",
          {
            shouldDirty: true,
            shouldValidate: false,
          },
        );
      },
    );

    clearErrors(
      endTimeFields,
    );
  }


  return (
    <form
      noValidate
      className="mx-auto flex min-h-175 w-full max-w-200 flex-col px-6 py-12"
    >
      <div className="mx-auto w-full max-w-130">

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
                errors.startDate
                  ?.message
              }
              onChange={
                field.onChange
              }
              onBlur={
                field.onBlur
              }
            />
          )}
        />


        {/* Start time */}
        <div className="mt-7">
          <Label className="mb-3 block text-right font-medium text-text">
            زمان شروع

            <span className="mr-1 text-danger">
              *
            </span>
          </Label>

          <div
            dir="ltr"
            className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3"
          >
            <Controller
              control={control}
              name="startHour"
              render={({ field }) => (
                <TimeSegment
                  value={field.value}
                  placeholder="ساعت"
                  hasError={
                    !!errors.startHour
                  }
                  onChange={
                    field.onChange
                  }
                  onBlur={
                    field.onBlur
                  }
                />
              )}
            />

            <span className="text-lg text-text-muted">
              :
            </span>

            <Controller
              control={control}
              name="startMinute"
              render={({ field }) => (
                <TimeSegment
                  value={field.value}
                  placeholder="دقیقه"
                  hasError={
                    !!errors.startMinute
                  }
                  onChange={
                    field.onChange
                  }
                  onBlur={
                    field.onBlur
                  }
                />
              )}
            />

            <span className="text-lg text-text-muted">
              :
            </span>

            <Controller
              control={control}
              name="startSecond"
              render={({ field }) => (
                <TimeSegment
                  value={field.value}
                  placeholder="ثانیه"
                  hasError={
                    !!errors.startSecond
                  }
                  onChange={
                    field.onChange
                  }
                  onBlur={
                    field.onBlur
                  }
                />
              )}
            />
          </div>

          {startTimeError && (
            <p
              role="alert"
              className="mt-2 text-sm text-danger"
            >
              {startTimeError}
            </p>
          )}
        </div>


        <div className="my-7 h-px bg-border" />


        {/* End date */}
        <Controller
          control={control}
          name="endDate"
          render={({ field }) => (
            <DateField
              id="campaign-end-date"
              label="تاریخ پایان"
              value={field.value}
              minimumDate={
                startDate
              }
              error={
                errors.endDate
                  ?.message
              }
              onChange={(value) => {
                handleEndDateChange(
                  value,
                  field.onChange,
                );
              }}
              onBlur={
                field.onBlur
              }
            />
          )}
        />


        {/* End time */}
        <div className="mt-7">
          <Label className="mb-3 block text-right font-medium text-text">
            زمان پایان
          </Label>

          <div
            dir="ltr"
            className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3"
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
                  hasError={
                    !!errors.endHour
                  }
                  onChange={
                    field.onChange
                  }
                  onBlur={
                    field.onBlur
                  }
                />
              )}
            />

            <span
              className={cn(
                "text-lg",
                isEndTimeDisabled
                  ? "text-text-disabled-strong"
                  : "text-text-muted",
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
                  hasError={
                    !!errors.endMinute
                  }
                  onChange={
                    field.onChange
                  }
                  onBlur={
                    field.onBlur
                  }
                />
              )}
            />

            <span
              className={cn(
                "text-lg",
                isEndTimeDisabled
                  ? "text-text-disabled-strong"
                  : "text-text-muted",
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
                  hasError={
                    !!errors.endSecond
                  }
                  onChange={
                    field.onChange
                  }
                  onBlur={
                    field.onBlur
                  }
                />
              )}
            />
          </div>

          {endTimeError && (
            <p
              role="alert"
              className="mt-2 text-sm text-danger"
            >
              {endTimeError}
            </p>
          )}
        </div>
      </div>


      {/* Actions */}
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
            className="h-12 min-w-44 rounded-2xl border-border-strong bg-surface text-text"
          >
            قبلی
          </Button>

          <Button
            type="button"
            onClick={
              handleNext
            }
            className="h-12 min-w-44 rounded-2xl bg-primary font-bold text-white hover:bg-primary-hover"
          >
            ادامه
          </Button>
        </div>
      </div>
    </form>
  );
}