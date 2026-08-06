"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResultMessageFooterProps {
  onPrevious: () => void;
  onSaveDraft: () => void;
}

export default function ResultMessageFooter({
  onPrevious,
  onSaveDraft,
}: ResultMessageFooterProps) {
  return (
    <footer
      dir="ltr"
      className={cn(
        "sticky bottom-0 z-30 flex h-[77px] w-full items-center",
        "justify-between border-t border-[#EBEBEB] bg-white px-6",
        "lg:px-[100px]",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        onClick={onSaveDraft}
        className="text-[#F38353] hover:bg-[#FFF4EF] hover:text-[#F38353]"
      >
        ذخیره پیش‌نویس
      </Button>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className={cn(
            "h-12 min-w-44 rounded-[16px] border-[#DEDEDE]",
            "bg-white text-[#555] shadow-none hover:bg-[#FAFAFA]",
          )}
        >
          قبلی
        </Button>

        <Button
          type="submit"
          className={cn(
            "h-12 min-w-44 rounded-[16px] bg-[#F38353]",
            "font-bold text-white shadow-none hover:bg-[#ED6D36]",
          )}
        >
          ادامه
        </Button>
      </div>
    </footer>
  );
}
