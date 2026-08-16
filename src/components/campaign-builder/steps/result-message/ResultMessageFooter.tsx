"use client";

import { Button } from "@/components/ui/button";

interface ResultMessageFooterProps {
  onPrevious: () => void;
  onSaveDraft: () => void;
  onNext: () => void;
}

export default function ResultMessageFooter({
  onPrevious,
  onSaveDraft,
  onNext,
}: ResultMessageFooterProps) {
  return (
    <footer
      dir="ltr"
      className="sticky bottom-0 z-30 flex h-19.25 w-full items-center justify-between border-t border-border bg-surface px-6 lg:px-25"
    >
      <Button
        type="button"
        variant="ghost"
        onClick={onSaveDraft}
        className="text-primary hover:bg-primary-soft hover:text-primary"
      >
        ذخیره پیش‌نویس
      </Button>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="h-12 min-w-44 rounded-2xl border-border-strong bg-surface text-text shadow-none hover:bg-background hover:text-text"
        >
          قبلی
        </Button>

        <Button
          type="button"
          onClick={onNext}
          className="h-12 min-w-44 rounded-2xl bg-primary font-bold text-white shadow-none hover:bg-primary-hover"
        >
          ادامه
        </Button>
      </div>
    </footer>
  );
}