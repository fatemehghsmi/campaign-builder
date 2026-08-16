"use client";

import { useState } from "react";

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
  const inputId =
    `journey-${journey.id}`;

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
            "relative h-33 gap-0 overflow-hidden rounded-2xl border py-0 shadow-none ring-0 transition-all duration-200",
            isSelected
              ? "border-primary bg-primary-soft shadow-[0_0_0_2px_rgba(243,131,83,0.08)]"
              : "border-border bg-surface hover:border-primary/60 hover:shadow-sm",
          )}
        >
          <ExternalLink
            aria-hidden="true"
            className="absolute inset-e-4 top-4 size-5 text-primary"
          />

          <CardContent className="flex h-full flex-col items-center justify-center p-4 pt-7 text-center">
            <span
              aria-hidden="true"
              className="text-2xl"
            >
              {journey.icon}
            </span>

            <h3 className="mt-2 font-bold text-text">
              {journey.title}
            </h3>

            <p className="mt-1 text-xs text-text-muted">
              {journey.description}
            </p>
          </CardContent>
        </Card>
      </Label>
    </div>
  );
}


export default function JourneySelectionStep() {
  const dispatch =
    useAppDispatch();

  const savedSelectedJourneyId =
    useAppSelector(
      selectSelectedJourneyId,
    );

  const [
    selectedJourneyId,
    setSelectedJourneyId,
  ] = useState(
    savedSelectedJourneyId ?? "",
  );

  const [
    searchText,
    setSearchText,
  ] = useState("");


  const normalizedSearch =
    searchText
      .trim()
      .toLocaleLowerCase("fa");

  const filteredJourneys =
    normalizedSearch
      ? customerJourneys.filter(
          (journey) =>
            `${journey.title} ${journey.description}`
              .toLocaleLowerCase("fa")
              .includes(
                normalizedSearch,
              ),
        )
      : customerJourneys;


  function handleSaveDraft() {
    if (!selectedJourneyId) {
      return;
    }

    dispatch(
      journeySelected(
        selectedJourneyId,
      ),
    );
  }


  function handleContinue() {
    if (!selectedJourneyId) {
      return;
    }

    dispatch(
      journeySelected(
        selectedJourneyId,
      ),
    );

    dispatch(nextStep());
  }


  function handlePrevious() {
    dispatch(previousStep());
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
          className="pointer-events-none absolute inset-s-4 top-1/2 size-5 -translate-y-1/2 text-text-muted"
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
          className="h-12 rounded-2xl border-border-strong bg-surface ps-12 text-right shadow-none focus-visible:border-primary focus-visible:ring-primary/15"
        />
      </div>


      {/* Journey cards */}
      <ScrollArea
        dir="ltr"
        className="
          mt-7 h-110 pe-4

          **:data-[slot=scroll-area-scrollbar]:w-2
          **:data-[slot=scroll-area-scrollbar]:rounded-full
          **:data-[slot=scroll-area-scrollbar]:bg-border
          **:data-[slot=scroll-area-scrollbar]:p-0

          **:data-[slot=scroll-area-thumb]:min-h-30
          **:data-[slot=scroll-area-thumb]:rounded-full
          **:data-[slot=scroll-area-thumb]:bg-primary
        "
      >
        <div
          dir="rtl"
          className="pe-3 pb-4"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <RadioGroup
              value={
                selectedJourneyId
              }
              onValueChange={(
                journeyId,
              ) => {
                setSelectedJourneyId(
                  journeyId,
                );
              }}
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
              className="
                h-33 rounded-2xl
                border-dashed border-primary/40
                bg-surface text-text
                shadow-none
                hover:border-primary
                hover:bg-primary-soft
                hover:text-primary
              "
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
            <div className="flex h-52 items-center justify-center text-sm text-text-subtle">
              سفری با این عنوان پیدا نشد.
            </div>
          )}
        </div>
      </ScrollArea>


      {/* Actions */}
      <div
        dir="ltr"
        className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8"
      >
        <Button
          type="button"
          variant="ghost"
          disabled={
            !selectedJourneyId
          }
          onClick={
            handleSaveDraft
          }
          className="text-primary hover:bg-primary-soft hover:text-primary disabled:opacity-40"
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
            className="h-12 min-w-48 rounded-2xl border-border-strong bg-surface text-text"
          >
            قبلی
          </Button>

          <Button
            type="button"
            disabled={
              !selectedJourneyId
            }
            onClick={
              handleContinue
            }
            className="h-12 min-w-48 rounded-2xl bg-primary font-bold text-white hover:bg-primary-hover disabled:opacity-40"
          >
            ادامه
          </Button>
        </div>
      </div>
    </div>
  );
}