"use client";

import { Button } from "@/components/ui/button";

interface EntryMessageFooterProps {
  onPrevious: () => void;
  onSaveDraft: () => void;
  onNext: () => void;
}

export default function EntryMessageFooter({
  onPrevious,
  onSaveDraft,
  onNext,
}: EntryMessageFooterProps) {
  return (
    <footer
      dir="ltr"
      className="absolute inset-x-0 bottom-0 flex h-19.25 items-center justify-between gap-4 bg-surface px-8"
    >
      <Button
        type="button"
        variant="ghost"
        onClick={onSaveDraft}
        className="h-12 w-41.25 rounded-2xl px-4 text-base font-bold leading-6 text-primary hover:bg-transparent hover:text-primary"
      >
        ذخیره پیش‌نویس
      </Button>

      <div className="flex h-12 w-101.75 items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="h-12 w-[195.5px] rounded-2xl border-2 border-border bg-surface text-base font-bold leading-6 text-text shadow-none hover:bg-surface hover:text-text"
        >
          قبلی
        </Button>

        <Button
          type="button"
          onClick={onNext}
          className="h-12 w-[195.5px] rounded-2xl bg-primary text-base font-bold leading-6 text-white shadow-none hover:bg-primary-hover"
        >
          ادامه
        </Button>
      </div>
    </footer>
  );
}