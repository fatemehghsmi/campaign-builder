"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EntryMessageFooterProps {
  onPrevious: () => void;
  onSaveDraft: () => void;
}

export default function EntryMessageFooter({
  onPrevious,
  onSaveDraft,
}: EntryMessageFooterProps) {
  return (
    <footer
      dir="ltr"
      className={cn(
        /*
         * 1382 total
         * 119 header
         * 1186 content
         * Remaining footer: 77px
         */
        "absolute",
        "inset-x-0",
        "bottom-0",
        "flex h-[77px]",
        "items-center",
        "justify-between",
        "gap-4",
        "bg-white",
        "px-8",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        onClick={onSaveDraft}
        className={cn(
          "h-12 w-[165px]",
          "rounded-[16px]",
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

      <div
        className={cn(
          "flex h-12",
          "w-[407px]",
          "items-center",
          "gap-4",
        )}
      >
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className={cn(
            "h-12",
            "w-[195.5px]",
            "rounded-[16px]",
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
          type="submit"
          className={cn(
            "h-12",
            "w-[195.5px]",
            "rounded-[16px]",
            "bg-[#F38353]",
            "text-base",
            "font-bold",
            "leading-6",
            "text-white",
            "shadow-none",

            "hover:bg-[#ED6F39]",
          )}
        >
          ادامه
        </Button>
      </div>
    </footer>
  );
}