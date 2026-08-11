"use client";

import { useEffect, useState } from "react";

import { Star, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

export interface AddedLink {
  url: string;
  uniquePerCustomer: boolean;
}

interface AddLinkDialogProps {
  open: boolean;
  initialUrl?: string;
  initialUniquePerCustomer?: boolean;

  onOpenChange: (open: boolean) => void;

  onAddLink: (link: AddedLink) => void;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const parsedUrl = new URL(value);

    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

export default function AddLinkDialog({
  open,
  initialUrl = "",
  initialUniquePerCustomer = false,
  onOpenChange,
  onAddLink,
}: AddLinkDialogProps) {
  const [url, setUrl] = useState(initialUrl);

  const [uniquePerCustomer, setUniquePerCustomer] = useState(
    initialUniquePerCustomer,
  );

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setUrl(initialUrl);

    setUniquePerCustomer(initialUniquePerCustomer);

    setError("");
  }, [open, initialUrl, initialUniquePerCustomer]);

  function handleClose() {
    setError("");

    onOpenChange(false);
  }

  function handleSubmit() {
    const normalizedUrl = url.trim();

    if (!normalizedUrl) {
      setError("وارد کردن لینک الزامی است");

      return;
    }

    if (!isValidHttpUrl(normalizedUrl)) {
      setError("لینک باید با http:// یا https:// شروع شود");

      return;
    }

    onAddLink({
      url: normalizedUrl,
      uniquePerCustomer,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="
          [&>button]:hidden
          w-[calc(100%-32px)]
          gap-0 overflow-hidden
          rounded-[28px] border-0
          bg-surface p-0
          shadow-[0_24px_90px_rgba(0,0,0,0.2)]
          sm:max-w-117.5
        "
      >
        <DialogHeader
          className="
            relative flex h-22
            items-center justify-center
            border-b border-border
            px-8 text-center
            sm:text-center
          "
        >
          <DialogTitle className="text-base font-bold text-text">
            افزودن لینک به پیام
          </DialogTitle>

          <DialogDescription className="sr-only">
            لینک موردنظر را وارد کنید.
          </DialogDescription>

          <button
            type="button"
            aria-label="بستن"
            onClick={handleClose}
            className="
              absolute left-7 top-1/2
              flex size-12
              -translate-y-1/2
              items-center justify-center
              rounded-2xl
              border border-border
              bg-surface
              text-text
              shadow-sm
              transition
              hover:bg-background
            "
          >
            <X className="size-5" />
          </button>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
          noValidate
        >
          <div className="px-8 pb-7 pt-8">
            <Label
              htmlFor="campaign-message-link"
              className="mb-3 block text-right font-medium text-text"
            >
              لینک
              <span className="mr-1 text-danger">*</span>
            </Label>

            <Input
              id="campaign-message-link"
              type="url"
              dir="ltr"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);

                if (error) {
                  setError("");
                }
              }}
              placeholder="https://www.atrmajlesi.ir"
              aria-invalid={Boolean(error)}
              className={cn(
                "h-12 rounded-2xl",
                "px-5 text-left",
                "text-[15px] shadow-none",
                "focus-visible:border-primary",
                "focus-visible:ring-primary/15",

                {
                  "border-danger": !!error,

                  "border-border-strong": !error,
                },
              )}
            />

            {error ? (
              <p role="alert" className="mt-2 text-right text-xs text-danger">
                {error}
              </p>
            ) : (
              <p className="mt-2 text-right text-xs text-text-subtle">
                لینک باید به همراه http یا https باشد.
              </p>
            )}

            <div dir="rtl" className="mt-8 flex min-h-12 items-center gap-3">
              <Checkbox
                id="unique-customer-link"
                checked={uniquePerCustomer}
                onCheckedChange={(checked) => {
                  setUniquePerCustomer(checked === true);
                }}
                className="
                  size-6 rounded-md
                  border-2 border-border-muted
                  data-[state=checked]:border-primary
                  data-[state=checked]:bg-primary
                "
              />

              <Label
                htmlFor="unique-customer-link"
                className="flex-1 cursor-pointer text-right font-medium text-text"
              >
                لینک یکتا برای هر شخص تولید شود
              </Label>

              <span
                title="ویژگی ویژه"
                className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-white"
              >
                <Star className="size-3 fill-current" />
              </span>
            </div>
          </div>

          <div dir="rtl" className="grid grid-cols-2 gap-4 px-8 pb-8">
            <Button
              type="submit"
              className="
                h-12 rounded-2xl
                bg-primary
                font-bold text-white
                shadow-none
                hover:bg-primary-hover
              "
            >
              افزودن لینک
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="
                h-12 rounded-2xl
                border-border-strong
                bg-surface
                font-bold text-text
                shadow-none
                hover:bg-background
              "
            >
              لغو
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
