import { z } from "zod";

function requiredTimePart(
  label: string,
  minimum: number,
  maximum: number,
) {
  return z
    .string()
    .trim()
    .min(1, `${label} را وارد کنید`)
    .regex(
      /^\d{1,2}$/,
      `${label} باید عدد باشد`,
    )
    .refine(
      (value) => {
        const numberValue = Number(value);

        return (
          numberValue >= minimum &&
          numberValue <= maximum
        );
      },
      {
        message: `${label} معتبر نیست`,
      },
    );
}

function isValidOptionalTimePart(
  value: string,
  minimum: number,
  maximum: number,
): boolean {
  if (!value) {
    return true;
  }

  if (!/^\d{1,2}$/.test(value)) {
    return false;
  }

  const numberValue = Number(value);

  return (
    numberValue >= minimum &&
    numberValue <= maximum
  );
}

function createDateTime(
  date: string,
  hour: string,
  minute: string,
  second: string,
): Date | null {
  if (
    !date ||
    !hour ||
    !minute ||
    !second
  ) {
    return null;
  }

  const normalizedHour =
    hour.padStart(2, "0");

  const normalizedMinute =
    minute.padStart(2, "0");

  const normalizedSecond =
    second.padStart(2, "0");

  const dateTime = new Date(
    `${date}T${normalizedHour}:${normalizedMinute}:${normalizedSecond}`,
  );

  if (
    Number.isNaN(dateTime.getTime())
  ) {
    return null;
  }

  return dateTime;
}

export const scheduleSchema = z
  .object({
    startDate: z
      .string()
      .min(
        1,
        "تاریخ شروع را انتخاب کنید",
      ),

    startHour: requiredTimePart(
      "ساعت شروع",
      0,
      23,
    ),

    startMinute: requiredTimePart(
      "دقیقه شروع",
      0,
      59,
    ),

    startSecond: requiredTimePart(
      "ثانیه شروع",
      0,
      59,
    ),

    endDate: z.string(),

    endHour: z.string(),

    endMinute: z.string(),

    endSecond: z.string(),
  })
  .superRefine((values, context) => {
    if (
      values.endHour &&
      !isValidOptionalTimePart(
        values.endHour,
        0,
        23,
      )
    ) {
      context.addIssue({
        code: "custom",
        path: ["endHour"],
        message:
          "ساعت پایان معتبر نیست",
      });
    }

    if (
      values.endMinute &&
      !isValidOptionalTimePart(
        values.endMinute,
        0,
        59,
      )
    ) {
      context.addIssue({
        code: "custom",
        path: ["endMinute"],
        message:
          "دقیقه پایان معتبر نیست",
      });
    }

    if (
      values.endSecond &&
      !isValidOptionalTimePart(
        values.endSecond,
        0,
        59,
      )
    ) {
      context.addIssue({
        code: "custom",
        path: ["endSecond"],
        message:
          "ثانیه پایان معتبر نیست",
      });
    }

    /*
     * End date and time are optional.
     * But when an end date is selected,
     * all end-time fields become required.
     */
    if (values.endDate) {
      if (!values.endHour) {
        context.addIssue({
          code: "custom",
          path: ["endHour"],
          message:
            "ساعت پایان را وارد کنید",
        });
      }

      if (!values.endMinute) {
        context.addIssue({
          code: "custom",
          path: ["endMinute"],
          message:
            "دقیقه پایان را وارد کنید",
        });
      }

      if (!values.endSecond) {
        context.addIssue({
          code: "custom",
          path: ["endSecond"],
          message:
            "ثانیه پایان را وارد کنید",
        });
      }
    }

    const hasEndTimeWithoutDate =
      !values.endDate &&
      Boolean(
        values.endHour ||
          values.endMinute ||
          values.endSecond,
      );

    if (hasEndTimeWithoutDate) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message:
          "ابتدا تاریخ پایان را انتخاب کنید",
      });
    }

    const startDateTime =
      createDateTime(
        values.startDate,
        values.startHour,
        values.startMinute,
        values.startSecond,
      );

    const endDateTime =
      createDateTime(
        values.endDate,
        values.endHour,
        values.endMinute,
        values.endSecond,
      );

    if (
      startDateTime &&
      endDateTime &&
      endDateTime <= startDateTime
    ) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message:
          "زمان پایان باید بعد از زمان شروع باشد",
      });
    }
  });

export type ScheduleFormValues =
  z.infer<typeof scheduleSchema>;