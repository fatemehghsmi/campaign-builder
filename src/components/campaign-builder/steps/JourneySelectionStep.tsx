"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  ExternalLink,
  Plus,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  journeySelected,
  nextStep,
  previousStep,
  selectSelectedJourneyId,
} from "@/lib/features/campaign-builder/campaignBuilderSlice";

import {
  customerJourneys,
  type CustomerJourney,
} from "@/lib/features/campaign-builder/customerJourneys";

import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/hooks";

import { cn } from "@/lib/utils";

interface JourneyCardProps {
  journey: CustomerJourney;
  isSelected: boolean;
}

function JourneyCard({
  journey,
  isSelected,
}: JourneyCardProps) {
  const inputId = `journey-${journey.id}`;

  return (
    <div className="relative h-full">
      <RadioGroupItem
        id={inputId}
        value={journey.id}
        className="sr-only"
      />

      <Label
        htmlFor={inputId}
        className="block h-full cursor-pointer"
      >
        <Card
          className={cn(
            "relative h-33 gap-0 overflow-hidden",
            "rounded-2xl border py-0 shadow-none",
            "ring-0 transition-all duration-200",

            isSelected
              ? [
                  "border-[#ff7c4d]",
                  "bg-[#fff8f5]",
                  "shadow-[0_0_0_2px_rgba(255,124,77,0.08)]",
                ]
              : [
                  "border-[#e5e5e5]",
                  "bg-white",
                  "hover:border-[#ff7c4d]/60",
                  "hover:shadow-sm",
                ],
          )}
        >
          <ExternalLink
            aria-hidden="true"
            className="absolute inset-e-4 top-4 size-5 text-[#ff7c4d]"
          />

          <CardContent className="flex h-full flex-col items-center justify-center p-4 pt-7 text-center">
            <span
              aria-hidden="true"
              className="text-2xl"
            >
              {journey.icon}
            </span>

            <h3 className="mt-2 font-bold text-[#4a4a4a]">
              {journey.title}
            </h3>

            <p className="mt-1 text-xs text-[#929292]">
              {journey.description}
            </p>
          </CardContent>
        </Card>
      </Label>
    </div>
  );
}

export default function JourneySelectionStep() {
  const dispatch = useAppDispatch();

  const selectedJourneyId = useAppSelector(
    selectSelectedJourneyId,
  );

  const [searchText, setSearchText] =
    useState("");

  const filteredJourneys = useMemo(() => {
    const normalizedSearch =
      searchText.trim().toLocaleLowerCase("fa");

    if (!normalizedSearch) {
      return customerJourneys;
    }

    return customerJourneys.filter(
      (journey) => {
        const searchableText =
          `${journey.title} ${journey.description}`
            .toLocaleLowerCase("fa");

        return searchableText.includes(
          normalizedSearch,
        );
      },
    );
  }, [searchText]);

  const canContinue =
    selectedJourneyId !== null;

  function handleJourneyChange(
    journeyId: string,
  ) {
    dispatch(
      journeySelected(journeyId),
    );
  }

  function handleContinue() {
    if (!selectedJourneyId) {
      return;
    }

    dispatch(nextStep());
  }

  function handleCreateNewJourney() {
    window.alert(
      "ساخت سفر جدید را بعداً به API متصل می‌کنیم.",
    );
  }

  return (
    <div className="mx-auto flex min-h-152.5 w-full max-w-197.5 flex-col px-6 py-12">
      {/* Search */}
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute inset-s-4 top-1/2 size-5 -translate-y-1/2 text-[#666]"
        />

        <Input
          type="search"
          value={searchText}
          onChange={(event) => {
            setSearchText(
              event.target.value,
            );
          }}
          placeholder="جستجو..."
          aria-label="جستجوی سفر مشتری"
          className={cn(
            "h-12 rounded-2xl border-[#dedede]",
            "bg-white ps-12 text-right",
            "shadow-none",
            "focus-visible:border-[#ff7c4d]",
            "focus-visible:ring-[#ff7c4d]/15",
          )}
        />
      </div>

      {/* Scrollable journey cards */}
     <ScrollArea
  dir="ltr"
  className={cn(
    "mt-7 h-110 pe-4",

    // Vertical scrollbar track
    "**:data-[slot=scroll-area-scrollbar]:w-2",
    "**:data-[slot=scroll-area-scrollbar]:rounded-full",
    "**:data-[slot=scroll-area-scrollbar]:bg-[#e8e8e8]",
    "**:data-[slot=scroll-area-scrollbar]:p-0",

    // Orange scrollbar thumb
    "**:data-[slot=scroll-area-thumb]:rounded-full",
    "**:data-[slot=scroll-area-thumb]:bg-[#ff7c4d]",
    "**:data-[slot=scroll-area-thumb]:min-h-30",
  )}
>
        <div
          dir="rtl"
          className="pe-3 pb-4"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <RadioGroup
              value={
                selectedJourneyId ?? ""
              }
              onValueChange={
                handleJourneyChange
              }
              className="contents"
              aria-label="انتخاب سفر مشتری"
            >
              {filteredJourneys.map(
                (journey) => (
                  <JourneyCard
                    key={journey.id}
                    journey={journey}
                    isSelected={
                      selectedJourneyId ===
                      journey.id
                    }
                  />
                ),
              )}
            </RadioGroup>

            <Button
              type="button"
              variant="outline"
              onClick={
                handleCreateNewJourney
              }
              className={cn(
                "h-33 rounded-2xl",
                "border-dashed border-[#ffb79d]",
                "bg-white text-[#555]",
                "shadow-none",
                "hover:border-[#ff7c4d]",
                "hover:bg-[#fff8f5]",
                "hover:text-[#ff7c4d]",
              )}
            >
              <span className="flex flex-col items-center gap-3">
                <Plus
                  aria-hidden="true"
                  className="size-7"
                />

                <span className="font-bold">
                  سفر مشتری جدید
                </span>
              </span>
            </Button>
          </div>

          {filteredJourneys.length ===
            0 && (
            <div className="flex h-52 items-center justify-center text-sm text-[#999]">
              سفری با این عنوان پیدا نشد.
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Bottom actions */}
      <div
        dir="ltr"
        className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8"
      >
        <Button
          type="button"
          variant="ghost"
          className="text-[#ff7c4d] hover:bg-[#fff5f1] hover:text-[#ff7c4d]"
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
            className="h-12 min-w-48 rounded-2xl border-[#dedede] bg-white text-[#555]"
          >
            قبلی
          </Button>

          <Button
            type="button"
            disabled={!canContinue}
            onClick={handleContinue}
            className={cn(
              "h-12 min-w-48 rounded-2xl",
              "bg-[#ff7c4d] font-bold",
              "text-white",
              "hover:bg-[#f16e40]",
              "disabled:opacity-40",
            )}
          >
            ادامه
          </Button>
        </div>
      </div>
    </div>
  );
}