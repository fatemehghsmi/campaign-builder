"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";

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

export default function CampaignInformationStep() {
  const dispatch = useAppDispatch();

  const savedCampaignInformation = useAppSelector(
    selectCampaignInformation,
  );

  const {
    register,
    handleSubmit,
    getValues,
    watch,

    formState: {
      errors,
    },
  } = useForm<CampaignInformationFormValues>({
    resolver: zodResolver(
      campaignInformationSchema,
    ),

    mode: "onBlur",

    defaultValues: {
      campaignName:
        savedCampaignInformation.campaignName,

      description:
        savedCampaignInformation.description,
    },
  });

  const description =
    watch("description") ?? "";

  const handleValidSubmit: SubmitHandler<
    CampaignInformationFormValues
  > = (values) => {
    dispatch(
      campaignInformationSaved(values),
    );

    dispatch(nextStep());
  };

  function handleSaveLocalDraft() {
    const currentValues = getValues();

    dispatch(
      campaignInformationSaved(
        currentValues,
      ),
    );
  }

  return (
    <form
      onSubmit={handleSubmit(
        handleValidSubmit,
      )}
      className="mx-auto flex min-h-152 max-w-140 flex-col px-6 py-16"
      noValidate
    >
      <div>
        <label
          htmlFor="campaign-name"
          className="mb-2 block font-medium"
        >
          نام کمپین

          <span className="mr-1 text-red-500">
            *
          </span>
        </label>

        <input
          id="campaign-name"
          type="text"
          placeholder="چیزی بنویسید"
          aria-invalid={
            errors.campaignName
              ? "true"
              : "false"
          }
          {...register("campaignName")}
          className={[
            "h-12 w-full rounded-2xl border px-4",
            "text-right outline-none transition",
            "focus:ring-2 focus:ring-[#ff7547]/10",

            errors.campaignName
              ? "border-red-500 focus:border-red-500"
              : "border-[#dedede] focus:border-[#ff7547]",
          ].join(" ")}
        />

        {errors.campaignName && (
          <p
            role="alert"
            className="mt-2 text-sm text-red-500"
          >
            {errors.campaignName.message}
          </p>
        )}
      </div>

      <div className="mt-8">
        <label
          htmlFor="campaign-description"
          className="mb-2 block font-medium"
        >
          توضیحات
        </label>

        <div className="relative">
          <textarea
            id="campaign-description"
            placeholder="چیزی بنویسید"
            maxLength={150}
            aria-invalid={
              errors.description
                ? "true"
                : "false"
            }
            {...register("description")}
            className={[
              "min-h-52 w-full resize-none rounded-2xl",
              "border p-4 pb-10 text-right",
              "outline-none transition",
              "focus:ring-2 focus:ring-[#ff7547]/10",

              errors.description
                ? "border-red-500 focus:border-red-500"
                : "border-[#dedede] focus:border-[#ff7547]",
            ].join(" ")}
          />

          <span className="absolute bottom-4 left-4 text-xs text-[#aaa]">
            {description.length}/150
          </span>
        </div>

        {errors.description && (
          <p
            role="alert"
            className="mt-2 text-sm text-red-500"
          >
            {errors.description.message}
          </p>
        )}
      </div>

      <div className=" mt-auto flex flex-row-reverse  justify-between pt-12">
        <button
          type="button"
          onClick={handleSaveLocalDraft}
          className="text-sm text-[#999] transition hover:text-[#ff7547]"
        >
          ذخیره پیش‌نویس
        </button>

        <button
          type="submit"
          className="h-12 min-w-48 rounded-2xl bg-[#ff7c4d] px-8 font-bold text-white transition hover:bg-[#f26d3e]"
        >
          ادامه
        </button>
      </div>
    </form>
  );
}