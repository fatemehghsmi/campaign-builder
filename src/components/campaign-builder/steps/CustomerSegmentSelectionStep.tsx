"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  BadgeCheck,
  Circle,
  Gem,
  Plus,
  Search,
  Star,
  UsersRound,
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
  type CustomerSegmentIcon,
} from "@/lib/features/campaign-builder/customerSegments";

import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/hooks";

import { cn } from "@/lib/utils";

const persianNumberFormatter =
  new Intl.NumberFormat("fa-IR");

/* -------------------------------------------------------------------------- */
/*                               Segment icons                                */
/* -------------------------------------------------------------------------- */

interface SegmentIconProps {
  icon: CustomerSegmentIcon;
}

function SegmentIcon({
  icon,
}: SegmentIconProps) {
  if (icon === "users") {
    return (
      <UsersRound
        aria-hidden="true"
        strokeWidth={1.7}
        className="size-8 text-[#848382]"
      />
    );
  }

  if (icon === "bronze") {
    return (
      <BadgeCheck
        aria-hidden="true"
        strokeWidth={1.7}
        className={cn(
          "size-8",
          "fill-[#DEA78F]",
          "text-[#9A4E2D]",
        )}
      />
    );
  }

  if (icon === "silver") {
    return (
      <BadgeCheck
        aria-hidden="true"
        strokeWidth={1.7}
        className={cn(
          "size-8",
          "fill-[#B6B6B7]",
          "text-[#646366]",
        )}
      />
    );
  }

  if (icon === "gold") {
    return (
      <BadgeCheck
        aria-hidden="true"
        strokeWidth={1.7}
        className={cn(
          "size-8",
          "fill-[#FFC76E]",
          "text-[#C97C00]",
        )}
      />
    );
  }

  if (icon === "diamond") {
    return (
      <Gem
        aria-hidden="true"
        strokeWidth={1.7}
        className={cn(
          "size-8",
          "fill-[#6ECFFF]",
          "text-[#0086C9]",
        )}
      />
    );
  }

  if (icon === "loyal") {
    return (
      <Circle
        aria-hidden="true"
        strokeWidth={2}
        className={cn(
          "size-8",
          "fill-[#D4E8FF]",
          "text-[#A9D2FF]",
        )}
      />
    );
  }

  if (icon === "potential") {
    return (
      <Circle
        aria-hidden="true"
        strokeWidth={2}
        className={cn(
          "size-8",
          "fill-[#D1F4FA]",
          "text-[#A2E8F6]",
        )}
      />
    );
  }

  return (
    <Circle
      aria-hidden="true"
      strokeWidth={2}
      className={cn(
        "size-8",
        "fill-[#FFF1C9]",
        "text-[#FFE292]",
      )}
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
      className={cn(
        "absolute left-6 top-4 z-20",
        "flex size-6 items-center",
        "justify-center p-0.5",
      )}
    >
      <span
        className={cn(
          "flex size-5",
          "items-center justify-center",
          "rounded-md",
          "bg-[#F38353]",
          "text-white",
          "shadow-[inset_-1.5px_-1.5px_1.5px_#ED591A]",
        )}
      >
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

  function handleToggle() {
    onToggle(segment.id);
  }

  return (
    <div
  className={cn(
    "relative h-32.25 w-58 shrink-0",
    "outline-none ring-0",
    "focus-within:outline-none",
    "focus-within:ring-0",
  )}
>
  <Checkbox
    id={checkboxId}
    checked={isSelected}
    onCheckedChange={handleToggle}
    aria-label={`انتخاب ${segment.title}`}
    className={cn(
      "absolute right-6 top-4 z-20",
      "size-6 rounded-lg",
      "border-2 border-[#B4B4B4]",
      "bg-white shadow-none",

      // Remove the black focus ring
      "outline-none",
      "ring-0",
      "focus:outline-none",
      "focus:ring-0",
      "focus-visible:outline-none",
      "focus-visible:ring-0",
      "focus-visible:ring-offset-0",

      "data-[state=checked]:border-[#F38353]",
      "data-[state=checked]:bg-[#F38353]",
      "data-[state=checked]:text-white",
    )}
  />

  {segment.featured && <PremiumBadge />}

  <Label
    htmlFor={checkboxId}
    className={cn(
      "block h-32.25 w-58",
      "cursor-pointer",
      "outline-none ring-0",
      "focus:outline-none",
      "focus-visible:outline-none",
    )}
  >
    <Card
      style={{
        borderColor: isSelected
          ? "#F38353"
          : "#EBEBEB",
        outline: "none",
        boxShadow: "none",
      }}
      className={cn(
        "h-32.25 w-58",
        "gap-0 overflow-hidden",
        "rounded-2xl",
        "border-2",
        "bg-white",
        "p-0 py-0",

        // Remove every possible black outline/ring
        "shadow-none",
        "outline-none",
        "ring-0",
        "focus:outline-none",
        "focus:ring-0",
        "focus-visible:outline-none",
        "focus-visible:ring-0",
        "focus-within:outline-none",
        "focus-within:ring-0",

        "transition-colors duration-200",

        isSelected
          ? "bg-[#FFFDFC]"
          : "hover:border-[#F38353]!",
      )}
    >
      <CardContent
        className="flex h-full w-full items-center justify-center p-0"
      >
        <div
          className={cn(
            "flex h-24.25 w-46",
            "flex-col items-center justify-center",
            "gap-4 text-center",
          )}
        >
          <SegmentIcon icon={segment.icon} />

          <div className="flex flex-col items-center justify-center gap-1">
            <h3 className="m-0 text-base font-bold leading-6 text-[#434343]">
              {segment.title}
            </h3>

            <p className="m-0 text-sm font-medium leading-5.25 text-[#848382]">
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
      className={cn(
        "h-32.25",
        "w-58",
        "shrink-0",
        "rounded-2xl",
        "border-2",
        "border-dashed",
        "border-[#F6D4C6]",
        "bg-white",
        "p-0",
        "text-[#434343]",
        "shadow-none",

        "hover:border-[#F38353]",
        "hover:bg-white",
        "hover:text-[#434343]",
      )}
    >
      <span
        className={cn(
          "flex",
          "h-18",
          "w-23.25",
          "flex-col",
          "items-center",
          "justify-center",
          "gap-4",
        )}
      >
        <Plus
          aria-hidden="true"
          strokeWidth={1.7}
          className="size-8 text-[#848382]"
        />

        <span
          className={cn(
            "whitespace-nowrap",
            "text-base",
            "font-bold",
            "leading-6",
            "text-[#434343]",
          )}
        >
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

  const storedSelectedSegmentIds =
    useAppSelector(
      selectSelectedSegmentIds,
    );

  const selectedSegmentIds =
    storedSelectedSegmentIds ?? [];

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const selectedSegmentIdSet =
    useMemo(
      () =>
        new Set(
          selectedSegmentIds,
        ),
      [selectedSegmentIds],
    );

  const filteredSegments =
    useMemo(() => {
      const normalizedSearch =
        searchText
          .trim()
          .toLocaleLowerCase(
            "fa",
          );

      if (!normalizedSearch) {
        return customerSegments;
      }

      return customerSegments.filter(
        (segment) => {
          const normalizedTitle =
            segment.title
              .toLocaleLowerCase(
                "fa",
              );

          return normalizedTitle.includes(
            normalizedSearch,
          );
        },
      );
    }, [searchText]);

  const canContinue =
    selectedSegmentIds.length > 0;

  function handleSegmentToggle(
    segmentId: string,
  ) {
    dispatch(
      customerSegmentToggled(
        segmentId,
      ),
    );
  }

  function handleContinue() {
    if (!canContinue) {
      return;
    }

    dispatch(nextStep());
  }

  function handlePrevious() {
    dispatch(previousStep());
  }

  function handleSaveDraft() {
    window.alert(
      "پیش‌نویس کمپین ذخیره شد.",
    );
  }

  function handleCreateNewSegment() {
    window.alert(
      "ساخت سگمنت جدید را بعداً به API متصل می‌کنیم.",
    );
  }

  return (
    <div
      className={cn(
        "flex",
        "h-188.25",
        "w-full",
        "flex-col",
        "bg-white",
      )}
    >
      {/* Content */}
      <div
        className={cn(
          "mx-auto",
          "w-full",
          "max-w-192.75",
          "flex-1",
          "pt-16",
        )}
      >
        {/* Search */}
        <div
          className={cn(
            "relative",
            "h-12",
            "w-full",
            "lg:mr-auto",
            "lg:w-186.75",
          )}
        >
          <Search
            aria-hidden="true"
            strokeWidth={1.7}
            className={cn(
              "pointer-events-none",
              "absolute",
              "right-6",
              "top-1/2",
              "z-10",
              "size-5.5",
              "-translate-y-1/2",
              "text-[#848382]",
            )}
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
            className={cn(
              "h-12",
              "w-full",
              "rounded-2xl",
              "border-2",
              "border-[#EBEBEB]",
              "bg-white",
              "py-2",
              "pr-15.5",
              "pl-6",
              "text-right",
              "text-base",
              "font-medium",
              "leading-7",
              "text-[#434343]",
              "shadow-none",

              "placeholder:text-[#848382]",

              "focus-visible:border-[#F38353]",
              "focus-visible:ring-0",
            )}
          />
        </div>

        {/* Cards */}
        <ScrollArea
          dir="ltr"
          className={cn(
            "mt-4",
            "h-113.5",
            "w-full",
            "max-w-192.75",

            /*
             * Figma scrollbar:
             * width: 8px
             * track: #EBEBEB
             * thumb: #F38353
             */
            "**:data-[slot=scroll-area-scrollbar]:w-2",
            "**:data-[slot=scroll-area-scrollbar]:rounded-full",
            "**:data-[slot=scroll-area-scrollbar]:bg-[#EBEBEB]",
            "**:data-[slot=scroll-area-scrollbar]:p-0",
            "**:data-[slot=scroll-area-scrollbar]:opacity-100",

            "**:data-[slot=scroll-area-thumb]:min-h-34.25",
            "**:data-[slot=scroll-area-thumb]:rounded-full",
            "**:data-[slot=scroll-area-thumb]:bg-[#F38353]",
          )}
        >
          <div
            dir="rtl"
            className={cn(
              "w-full",
              "pb-6",
              "lg:w-186.75",
            )}
          >
            <div
              className={cn(
                "grid",
                "w-full",
                "content-start",
                "justify-center",
                "grid-cols-1",
                "gap-6",
                "py-0.5",

                "sm:grid-cols-2",

                "lg:min-h-112.5",
                "lg:w-186.75",
                "lg:grid-cols-[repeat(3,232px)]",
              )}
            >
              {filteredSegments.map(
                (segment) => (
                  <CustomerSegmentCard
                    key={segment.id}
                    segment={
                      segment
                    }
                    isSelected={selectedSegmentIdSet.has(
                      segment.id,
                    )}
                    onToggle={
                      handleSegmentToggle
                    }
                  />
                ),
              )}

              <NewSegmentCard
                onClick={
                  handleCreateNewSegment
                }
              />
            </div>

            {filteredSegments.length ===
              0 && (
              <div
                className={cn(
                  "flex",
                  "h-75",
                  "items-center",
                  "justify-center",
                  "text-sm",
                  "font-medium",
                  "text-[#848382]",
                )}
              >
                سگمنتی با این عنوان پیدا نشد.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <footer
        dir="ltr"
        className={cn(
          "flex",
          "h-28",
          "shrink-0",
          "items-center",
          "justify-between",
          "gap-4",
          "px-8",
        )}
      >
        {/* Draft */}
        <Button
          type="button"
          variant="ghost"
          onClick={
            handleSaveDraft
          }
          className={cn(
            "h-12",
            "w-41.25",
            "rounded-2xl",
            "px-4",
            "text-base",
            "font-bold",
            "leading-6",
            "text-[#F38353]",

            "hover:bg-transparent",
            "hover:text-[#F38353]",
          )}
        >
          ذخیره پیش‌نویس
        </Button>

        {/* Navigation */}
        <div
          className={cn(
            "flex",
            "h-12",
            "w-101.75",
            "items-center",
            "gap-4",
          )}
        >
          <Button
            type="button"
            variant="outline"
            onClick={
              handlePrevious
            }
            className={cn(
              "h-12",
              "w-[195.5px]",
              "rounded-2xl",
              "border-2",
              "border-[#EBEBEB]",
              "bg-white",
              "text-base",
              "font-bold",
              "leading-6",
              "text-[#434343]",
              "shadow-none",

              "hover:bg-white",
              "hover:text-[#434343]",
            )}
          >
            قبلی
          </Button>

          <Button
            type="button"
            disabled={
              !canContinue
            }
            onClick={
              handleContinue
            }
            className={cn(
              "h-12",
              "w-[195.5px]",
              "rounded-2xl",
              "bg-[#F38353]",
              "text-base",
              "font-bold",
              "leading-6",
              "text-white",
              "shadow-none",

              "hover:bg-[#ED6F39]",

              "disabled:bg-[#F38353]",
              "disabled:opacity-40",
            )}
          >
            ادامه
          </Button>
        </div>
      </footer>
    </div>
  );
}