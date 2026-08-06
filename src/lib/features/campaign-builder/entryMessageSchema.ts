import { z } from "zod";

export const entryMessageSchema = z
  .object({
    isEnabled: z.boolean(),

    senderLineId: z.string(),

    message: z
      .string()
      .max(
        500,
        "متن پیام نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد",
      ),

    linkUrl: z.string(),

    uniqueLinkPerCustomer: z.boolean(),
  })
  .superRefine((values, context) => {
    if (!values.isEnabled) {
      return;
    }

    if (!values.senderLineId) {
      context.addIssue({
        code: "custom",
        path: ["senderLineId"],
        message:
          "خط ارسال‌کننده را انتخاب کنید",
      });
    }

    if (!values.message.trim()) {
      context.addIssue({
        code: "custom",
        path: ["message"],
        message: "متن پیام را وارد کنید",
      });
    }

    if (
      values.linkUrl &&
      !/^https?:\/\//i.test(values.linkUrl)
    ) {
      context.addIssue({
        code: "custom",
        path: ["linkUrl"],
        message:
          "لینک باید با http یا https شروع شود",
      });
    }
  });

export type EntryMessageFormValues =
  z.infer<typeof entryMessageSchema>;