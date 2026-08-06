import { z } from "zod";

export const resultMessageSchema = z
  .object({
    isEnabled: z.boolean(),

    channel: z.literal("bale"),

    imageUrl: z.string(),

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

export type ResultMessageFormValues =
  z.infer<typeof resultMessageSchema>;