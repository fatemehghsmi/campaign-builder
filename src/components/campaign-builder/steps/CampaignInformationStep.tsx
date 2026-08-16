"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  campaignInformationSaved,
  nextStep,
  selectCampaignInformation,
} from "@/lib/features/campaign-builder/campaignBuilderSlice";

import {
  campaignInformationSchema,
  type CampaignInformationFormValues,
} from "@/lib/features/campaign-builder/campaignInformationSchema";

import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/hooks";

import { cn } from "@/lib/utils";

export default function CampaignInformationStep() {
  const dispatch = useAppDispatch();

  const savedCampaignInformation = useAppSelector(
    selectCampaignInformation,
  );

  const {
    register,
    getValues,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CampaignInformationFormValues>({
    resolver: zodResolver(campaignInformationSchema),
    mode: "onSubmit",
    defaultValues: savedCampaignInformation,
  });

  const description = watch("description") ?? "";

  async function handleSaveDraft() {
    const isValid = await trigger();

    if (!isValid) {
      return;
    }

    dispatch(
      campaignInformationSaved(
        getValues(),
      ),
    );
  }

  async function handleNext() {
    const isValid = await trigger();

    if (!isValid) {
      return;
    }

    dispatch(
      campaignInformationSaved(
        getValues(),
      ),
    );

    dispatch(nextStep());
  }

  return (
    <form
      noValidate
      className="mx-auto flex min-h-152 max-w-140 flex-col px-6 py-16"
    >
      <div>
        <label
          htmlFor="campaign-name"
          className="mb-2 block font-medium text-text"
        >
          نام کمپین
          <span className="mr-1 text-danger">
            *
          </span>
        </label>

        <input
          id="campaign-name"
          type="text"
          placeholder="چیزی بنویسید"
          aria-invalid={
            !!errors.campaignName
          }
          {...register(
            "campaignName",
          )}
          className={cn(
            "h-12 w-full rounded-2xl border px-4 text-right outline-none transition focus:ring-2 focus:ring-primary/10",
            errors.campaignName
              ? "border-danger focus:border-danger"
              : "border-border-strong focus:border-primary",
          )}
        />

        {errors.campaignName && (
          <p
            role="alert"
            className="mt-2 text-sm text-danger"
          >
            {
              errors.campaignName
                .message
            }
          </p>
        )}
      </div>

      <div className="mt-8">
        <label
          htmlFor="campaign-description"
          className="mb-2 block font-medium text-text"
        >
          توضیحات
        </label>

        <div className="relative">
          <textarea
            id="campaign-description"
            placeholder="چیزی بنویسید"
            aria-invalid={
              !!errors.description
            }
            {...register(
              "description",
            )}
            className={cn(
              "min-h-52 w-full resize-none rounded-2xl border p-4 pb-10 text-right outline-none transition focus:ring-2 focus:ring-primary/10",
              errors.description
                ? "border-danger focus:border-danger"
                : "border-border-strong focus:border-primary",
            )}
          />

          <span className="absolute bottom-4 left-4 text-xs text-text-disabled">
            {description.length}/150
          </span>
        </div>

        {errors.description && (
          <p
            role="alert"
            className="mt-2 text-sm text-danger"
          >
            {
              errors.description
                .message
            }
          </p>
        )}
      </div>

      <div className="mt-auto flex flex-row-reverse justify-between pt-12">
        <button
          type="button"
          onClick={
            handleSaveDraft
          }
          className="text-sm text-primary transition hover:opacity-75"
        >
          ذخیره پیش‌نویس
        </button>

        <button
          type="button"
          onClick={
            handleNext
          }
          className="h-12 min-w-48 rounded-2xl bg-primary px-8 font-bold text-white transition hover:bg-primary-hover"
        >
          ادامه
        </button>
      </div>
    </form>
  );
}