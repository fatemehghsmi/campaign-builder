"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

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

    return (
      parsedUrl.protocol === "http:" ||
      parsedUrl.protocol === "https:"
    );
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

  const [
    uniquePerCustomer,
    setUniquePerCustomer,
  ] = useState(initialUniquePerCustomer);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setUrl(initialUrl);
    setUniquePerCustomer(
      initialUniquePerCustomer,
    );
    setError("");
  }, [
    open,
    initialUrl,
    initialUniquePerCustomer,
  ]);

  function handleClose() {
    setError("");
    onOpenChange(false);
  }

function handleSubmit(
  event: FormEvent<HTMLFormElement>,
) {
  event.preventDefault();

  const normalizedUrl = url.trim();

  if (!normalizedUrl) {
    setError("وارد کردن لینک الزامی است");
    return;
  }

  if (!isValidHttpUrl(normalizedUrl)) {
    setError(
      "لینک باید با http:// یا https:// شروع شود",
    );
    return;
  }

  onAddLink({
    url: normalizedUrl,
    uniquePerCustomer,
  });
}

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        dir="rtl"
        className={cn(
          // Hide the default shadcn close button.
          "[&>button]:hidden",

          "w-[calc(100%-32px)]",
          "gap-0 overflow-hidden",
          "rounded-[28px] border-0",
          "bg-white p-0",
          "shadow-[0_24px_90px_rgba(0,0,0,0.2)]",
          "sm:max-w-[470px]",
        )}
      >
        <DialogHeader
          className={cn(
            "relative flex h-[88px]",
            "items-center justify-center",
            "border-b border-[#eeeeee]",
            "px-8 text-center",
            "sm:text-center",
          )}
        >
          <DialogTitle className="text-base font-bold text-[#414141]">
            افزودن لینک به پیام
          </DialogTitle>

          <DialogDescription className="sr-only">
            لینک موردنظر را وارد کنید.
          </DialogDescription>

          <button
            type="button"
            aria-label="بستن"
            onClick={handleClose}
            className={cn(
              "absolute left-7 top-1/2",
              "flex size-12",
              "-translate-y-1/2",
              "items-center justify-center",
              "rounded-2xl border",
              "border-[#e4e4e4]",
              "bg-white text-[#555]",
              "shadow-sm transition",

              "hover:bg-[#f8f8f8]",
            )}
          >
            <X className="size-5" />
          </button>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="px-8 pb-7 pt-8">
            <Label
              htmlFor="campaign-message-link"
              className="mb-3 block text-right font-medium text-[#444]"
            >
              لینک

              <span className="mr-1 text-red-500">
                *
              </span>
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

                error
                  ? "border-red-500"
                  : "border-[#dedede]",

                "focus-visible:border-[#ff7c4d]",
                "focus-visible:ring-[#ff7c4d]/15",
              )}
            />

            {error ? (
              <p
                role="alert"
                className="mt-2 text-right text-xs text-red-500"
              >
                {error}
              </p>
            ) : (
              <p className="mt-2 text-right text-xs text-[#999]">
                لینک باید به همراه http یا https
                باشد.
              </p>
            )}

            <div
              dir="rtl"
              className={cn(
                "mt-8 flex min-h-12",
                "items-center gap-3",
              )}
            >
              <Checkbox
                id="unique-customer-link"
                checked={uniquePerCustomer}
                onCheckedChange={(checked) => {
                  setUniquePerCustomer(
                    checked === true,
                  );
                }}
                className={cn(
                  "size-6 rounded-md",
                  "border-2 border-[#bdbdbd]",

                  "data-[state=checked]:border-[#ff7c4d]",
                  "data-[state=checked]:bg-[#ff7c4d]",
                )}
              />

              <Label
                htmlFor="unique-customer-link"
                className={cn(
                  "flex-1 cursor-pointer",
                  "text-right font-medium",
                  "text-[#444]",
                )}
              >
                لینک یکتا برای هر شخص تولید شود
              </Label>

              <span
                title="ویژگی ویژه"
                className={cn(
                  "flex size-6 shrink-0",
                  "items-center justify-center",
                  "rounded-md bg-[#ff7c4d]",
                  "text-white",
                )}
              >
                <Star className="size-3 fill-current" />
              </span>
            </div>
          </div>

          <div
            dir="rtl"
            className={cn(
              "grid grid-cols-2 gap-4",
              "px-8 pb-8",
            )}
          >
            <Button
              type="submit"
              className={cn(
                "h-12 rounded-2xl",
                "bg-[#ff7c4d]",
                "font-bold text-white",
                "shadow-none",

                "hover:bg-[#f16e40]",
              )}
            >
              افزودن لینک
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className={cn(
                "h-12 rounded-2xl",
                "border-[#dedede]",
                "bg-white font-bold",
                "text-[#555] shadow-none",

                "hover:bg-[#fafafa]",
              )}
            >
              لغو
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}