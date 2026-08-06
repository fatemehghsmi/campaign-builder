"use client";

import * as React from "react";

import {
  ScrollArea as ScrollAreaPrimitive,
} from "radix-ui";

import { cn } from "@/lib/utils";

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      /*
       * Keeps the custom shadcn/Radix scrollbar
       * visible whenever content is scrollable.
       */
      type="always"
      className={cn(
        "relative overflow-hidden",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full",
          "rounded-[inherit]",
          "outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-ring/50",
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>

      <ScrollBar />

      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Scrollbar
>) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none select-none",
        "transition-colors",

        orientation === "vertical" && [
          "h-full w-2",
          "rounded-full",
          "bg-[#EBEBEB]",
          "p-0",
        ],

        orientation === "horizontal" && [
          "h-2 w-full",
          "flex-col",
          "rounded-full",
          "bg-[#EBEBEB]",
          "p-0",
        ],

        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className={cn(
          "relative flex-1",
          "rounded-full",
          "bg-[#F38353]",

          /*
           * Figma thumb is approximately 137px.
           * Radix can make it larger when needed.
           */
          orientation === "vertical" &&
            "min-h-34.25",

          orientation === "horizontal" &&
            "min-w-34.25",
        )}
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export {
  ScrollArea,
  ScrollBar,
};