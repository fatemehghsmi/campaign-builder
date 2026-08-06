import { z } from "zod";

export const campaignInformationSchema = z.object({
  campaignName: z
    .string()
    .trim()
    .min(1, "نام کمپین الزامی است"),

  description: z
    .string()
    .max(
      150,
      "توضیحات کمپین نمی‌تواند بیشتر از ۱۵۰ کاراکتر باشد",
    ),
});

export type CampaignInformationFormValues = z.infer<
  typeof campaignInformationSchema
>;