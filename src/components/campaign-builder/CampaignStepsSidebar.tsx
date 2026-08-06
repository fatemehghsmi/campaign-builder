"use client";

import type {
  CSSProperties,
} from "react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  Check,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import type {
  CampaignStep,
} from "@/lib/features/campaign-builder/campaignBuilderSlice";

import { cn } from "@/lib/utils";

export interface CampaignStepDefinition {
  id: CampaignStep;
  title: string;
  description: string;
  icon: LucideIcon;
  headerTitle: string;
  headerDescription: string;
}

interface CampaignStepsSidebarProps {
  currentStep: CampaignStep;
  steps: readonly CampaignStepDefinition[];
}

export default function CampaignStepsSidebar({
  currentStep,
  steps,
}: CampaignStepsSidebarProps) {
  return (
    <Sidebar
      side="right"
      variant="sidebar"
      collapsible="none"
      dir="rtl"
      style={
        {
          "--sidebar-width": "368px",
        } as CSSProperties
      }
      className={cn(
        "hidden shrink-0 border-0",
        "bg-transparent lg:flex",
      )}
    >
      <SidebarContent
        className={cn(
          "h-[873px] w-[368px]",
          "overflow-hidden",
          "rounded-[24px]",
          "bg-white",
          "px-5 py-1.5",
        )}
      >
        <SidebarGroup
          className={cn(
            "h-full w-full",
            "p-0",
          )}
        >
          <SidebarGroupContent
            className="h-full"
          >
            <SidebarMenu
              className={cn(
                "mx-auto h-full",
                "w-[329px]",
                "gap-[18px]",
                "py-4",
              )}
            >
              {steps.map((step) => {
                const StepIcon =
                  step.icon;

                const isActive =
                  currentStep === step.id;

                const isCompleted =
                  currentStep > step.id;

                return (
                  <SidebarMenuItem
                    key={step.id}
                    className="h-[88px] w-[329px]"
                  >
                    <SidebarMenuButton
                      type="button"
                      size="lg"
                      isActive={isActive}
                      aria-current={
                        isActive
                          ? "step"
                          : undefined
                      }
                      className={cn(
                        /*
                         * Figma card:
                         * width: 329px
                         * height: 88px
                         * padding: 16px
                         * border-radius: 16px
                         */
                        "flex h-[88px]",
                        "min-h-[88px]",
                        "w-[329px]",
                        "items-center",
                        "gap-4",
                        "rounded-[16px]",
                        "border-2",
                        "bg-white p-4",
                        "text-right",
                        "shadow-none",
                        "whitespace-normal",

                        /*
                         * Remove default shadcn styles.
                         */
                        "hover:bg-white",
                        "active:bg-white",
                        "data-[active=true]:bg-white",
                        "data-[active=true]:font-normal",
                        "data-[active=true]:text-inherit",

                        isActive
                          ? "border-[#F38353]"
                          : "border-[#EBEBEB]",
                      )}
                    >
                      {/* Right-side icon */}
                      <StepIcon
                        aria-hidden="true"
                        strokeWidth={1.7}
                        className={cn(
                          "size-8 shrink-0",

                          isActive
                            ? "text-[#F38353]"
                            : "text-[#848382]",
                        )}
                      />

                      {/* Middle texts */}
                      <span
                        className={cn(
                          "flex min-w-0",
                          "flex-1 flex-col",
                          "items-start",
                          "justify-center",
                          "gap-1",
                          "text-right",
                        )}
                      >
                        <span
                          className={cn(
                            "block w-full",
                            "text-right",
                            "text-base",
                            "font-medium",
                            "leading-7",

                            isActive
                              ? "text-[#F38353]"
                              : "text-[#434343]",
                          )}
                        >
                          {step.title}
                        </span>

                        <span
                          className={cn(
                            "block w-full",
                            "text-right",
                            "text-sm",
                            "font-medium",
                            "leading-[21px]",
                            "text-[#848382]",
                          )}
                        >
                          {step.description}
                        </span>
                      </span>

                      {/* Left-side status circle */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-6",
                          "shrink-0",
                          "items-center",
                          "justify-center",
                          "rounded-full",

                          isCompleted
                            ? [
                                "bg-[#F38353]",
                                "text-white",
                              ]
                            : [
                                "border-2",
                                "border-[#DEDEDE]",
                                "bg-white",
                              ],
                        )}
                      >
                        {isCompleted && (
                          <Check
                            className="size-[14px]"
                            strokeWidth={3}
                          />
                        )}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}