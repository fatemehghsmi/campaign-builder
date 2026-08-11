"use client";

import { useState } from "react";

import {
  Plus,
  Search,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  customerSegmentToggled,
  nextStep,
  previousStep,
  selectSelectedSegmentIds,
} from "@/lib/features/campaign-builder/campaignBuilderSlice";

import {
  customerSegments,
  type CustomerSegment,
} from "@/lib/features/campaign-builder/customerSegments";

import {
  defaultSegmentIcon,
  segmentIconRegistry,
} from "@/lib/features/campaign-builder/customerSegmentIconRegistry";

import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/hooks";

import { cn } from "@/lib/utils";


const persianNumberFormatter =
  new Intl.NumberFormat("fa-IR");


/* -------------------------------------------------------------------------- */
/*                               Segment icon                                 */
/* -------------------------------------------------------------------------- */

interface SegmentIconProps {
  icon: CustomerSegment["icon"];
}


function SegmentIcon({
  icon,
}: SegmentIconProps) {
  const {
    icon: Icon,
    className,
    strokeWidth,
  } =
    segmentIconRegistry[icon] ??
    defaultSegmentIcon;

  return (
    <Icon
      aria-hidden="true"
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}


/* -------------------------------------------------------------------------- */
/*                              Premium badge                                 */
/* -------------------------------------------------------------------------- */

function PremiumBadge() {
  return (
    <span
      aria-label="سگمنت ویژه"
      className="absolute left-6 top-4 z-20 flex size-6 items-center justify-center p-0.5"
    >
      <span className="flex size-5 items-center justify-center rounded-md bg-primary text-white shadow-[inset_-1.5px_-1.5px_1.5px_var(--color-primary-hover)]">
        <Star
          aria-hidden="true"
          strokeWidth={2.5}
          className="size-3 fill-white text-white"
        />
      </span>
    </span>
  );
}


/* -------------------------------------------------------------------------- */
/*                              Segment card                                  */
/* -------------------------------------------------------------------------- */

interface CustomerSegmentCardProps {
  segment: CustomerSegment;
  isSelected: boolean;

  onToggle: (
    segmentId: string,
  ) => void;
}


function CustomerSegmentCard({
  segment,
  isSelected,
  onToggle,
}: CustomerSegmentCardProps) {
  const checkboxId =
    `segment-${segment.id}`;

  return (
    <div className="relative h-32.25 w-58 shrink-0 outline-none ring-0 focus-within:outline-none focus-within:ring-0">
      <Checkbox
        id={checkboxId}
        checked={isSelected}
        onCheckedChange={() => {
          onToggle(segment.id);
        }}
        aria-label={`انتخاب ${segment.title}`}
        className="
          absolute right-6 top-4 z-20
          size-6 rounded-lg
          border-2 border-border-muted
          bg-surface shadow-none

          outline-none ring-0
          focus:outline-none
          focus:ring-0
          focus-visible:outline-none
          focus-visible:ring-0
          focus-visible:ring-offset-0

          data-[state=checked]:border-primary
          data-[state=checked]:bg-primary
          data-[state=checked]:text-white
        "
      />

      {segment.featured && (
        <PremiumBadge />
      )}

      <Label
        htmlFor={checkboxId}
        className="block h-32.25 w-58 cursor-pointer outline-none ring-0 focus:outline-none focus-visible:outline-none"
      >
        <Card
          className={cn(
            "h-32.25 w-58 gap-0 overflow-hidden rounded-2xl",
            "border-2 p-0 py-0 shadow-none",
            "outline-none ring-0",
            "transition-colors duration-200",

            {
              "border-primary bg-primary-soft":
                isSelected,

              "border-border bg-surface hover:border-primary":
                !isSelected,
            },
          )}
        >
          <CardContent className="flex h-full w-full items-center justify-center p-0">
            <div className="flex h-24.25 w-46 flex-col items-center justify-center gap-4 text-center">
              <SegmentIcon
                icon={segment.icon}
              />

              <div className="flex flex-col items-center justify-center gap-1">
                <h3 className="m-0 text-base font-bold leading-6 text-text">
                  {segment.title}
                </h3>

                <p className="m-0 text-sm font-medium leading-5.25 text-text-muted">
                  {persianNumberFormatter.format(
                    segment.customerCount,
                  )}{" "}
                  نفر
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Label>
    </div>
  );
}


/* -------------------------------------------------------------------------- */
/*                            New segment card                                */
/* -------------------------------------------------------------------------- */

interface NewSegmentCardProps {
  onClick: () => void;
}


function NewSegmentCard({
  onClick,
}: NewSegmentCardProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="
        h-32.25 w-58 shrink-0
        rounded-2xl
        border-2 border-dashed
        border-primary/30
        bg-surface p-0
        text-text shadow-none

        hover:border-primary
        hover:bg-surface
        hover:text-text
      "
    >
      <span className="flex h-18 w-23.25 flex-col items-center justify-center gap-4">
        <Plus
          aria-hidden="true"
          strokeWidth={1.7}
          className="size-8 text-text-muted"
        />

        <span className="whitespace-nowrap text-base font-bold leading-6 text-text">
          سگمنت جدید
        </span>
      </span>
    </Button>
  );
}


/* -------------------------------------------------------------------------- */
/*                              Main component                                */
/* -------------------------------------------------------------------------- */

export default function CustomerSegmentSelectionStep() {
  const dispatch =
    useAppDispatch();

  const selectedSegmentIds =
    useAppSelector(
      selectSelectedSegmentIds,
    ) ?? [];

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const normalizedSearch =
    searchText
      .trim()
      .toLocaleLowerCase("fa");

  const filteredSegments =
    normalizedSearch
      ? customerSegments.filter(
          (segment) =>
            segment.title
              .toLocaleLowerCase("fa")
              .includes(
                normalizedSearch,
              ),
        )
      : customerSegments;


  return (
    <div className="flex h-188.25 w-full flex-col bg-surface">

      {/* Content */}
      <div className="mx-auto w-full max-w-192.75 flex-1 pt-16">

        {/* Search */}
        <div className="relative h-12 w-full lg:mr-auto lg:w-186.75">
          <Search
            aria-hidden="true"
            strokeWidth={1.7}
            className="pointer-events-none absolute right-6 top-1/2 z-10 size-5.5 -translate-y-1/2 text-text-muted"
          />

          <Input
            type="search"
            value={searchText}
            onChange={(event) => {
              setSearchText(
                event.target.value,
              );
            }}
            placeholder="چیزی بنویسید"
            aria-label="جستجوی سگمنت مشتریان"
            className="
              h-12 w-full
              rounded-2xl
              border-2 border-border
              bg-surface
              py-2 pr-15.5 pl-6
              text-right
              text-base font-medium
              leading-7 text-text
              shadow-none

              placeholder:text-text-muted

              focus-visible:border-primary
              focus-visible:ring-0
            "
          />
        </div>


        {/* Cards */}
        <ScrollArea
          dir="ltr"
          className="
            mt-4 h-113.5
            w-full max-w-192.75

            **:data-[slot=scroll-area-scrollbar]:w-2
            **:data-[slot=scroll-area-scrollbar]:rounded-full
            **:data-[slot=scroll-area-scrollbar]:bg-border
            **:data-[slot=scroll-area-scrollbar]:p-0
            **:data-[slot=scroll-area-scrollbar]:opacity-100

            **:data-[slot=scroll-area-thumb]:min-h-34.25
            **:data-[slot=scroll-area-thumb]:rounded-full
            **:data-[slot=scroll-area-thumb]:bg-primary
          "
        >
          <div
            dir="rtl"
            className="w-full pb-6 lg:w-186.75"
          >
            <div className="grid w-full content-start justify-center grid-cols-1 gap-6 py-0.5 sm:grid-cols-2 lg:min-h-112.5 lg:w-186.75 lg:grid-cols-[repeat(3,232px)]">
              {filteredSegments.map(
                (segment) => (
                  <CustomerSegmentCard
                    key={segment.id}
                    segment={segment}
                    isSelected={
                      selectedSegmentIds.includes(
                        segment.id,
                      )
                    }
                    onToggle={(
                      segmentId,
                    ) => {
                      dispatch(
                        customerSegmentToggled(
                          segmentId,
                        ),
                      );
                    }}
                  />
                ),
              )}

              <NewSegmentCard
                onClick={() => {
                  window.alert(
                    "ساخت سگمنت جدید را بعداً به API متصل می‌کنیم.",
                  );
                }}
              />
            </div>

            {filteredSegments.length ===
              0 && (
              <div className="flex h-75 items-center justify-center text-sm font-medium text-text-muted">
                سگمنتی با این عنوان پیدا نشد.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>


      {/* Footer */}
      <footer
        dir="ltr"
        className="flex h-28 shrink-0 items-center justify-between gap-4 px-8"
      >
        <Button
          type="button"
          variant="ghost"
          className="h-12 w-41.25 rounded-2xl px-4 text-base font-bold leading-6 text-primary hover:bg-primary-soft hover:text-primary"
        >
          ذخیره پیش‌نویس
        </Button>

        <div className="flex h-12 w-101.75 items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              dispatch(
                previousStep(),
              );
            }}
            className="h-12 w-[195.5px] rounded-2xl border-2 border-border bg-surface text-base font-bold leading-6 text-text shadow-none hover:bg-surface hover:text-text"
          >
            قبلی
          </Button>

          <Button
            type="button"
            disabled={
              selectedSegmentIds.length ===
              0
            }
            onClick={() => {
              dispatch(nextStep());
            }}
            className="h-12 w-[195.5px] rounded-2xl bg-primary text-base font-bold leading-6 text-white shadow-none hover:bg-primary-hover disabled:bg-primary disabled:opacity-40"
          >
            ادامه
          </Button>
        </div>
      </footer>
    </div>
  );
}