"use client";

import type { ComponentType, CSSProperties, SVGProps } from "react";

import { Check } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import type { CampaignStep } from "@/lib/features/campaign-builder/campaignBuilderSlice";

import { cn } from "@/lib/utils";

export interface CampaignStepDefinition {
  id: CampaignStep;
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
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
      className="hidden shrink-0 border-0 bg-transparent lg:flex"
    >
      <SidebarContent className="h-218.25 w-92 overflow-hidden rounded-3xl bg-surface px-5 py-1.5">
        <SidebarGroup className="h-full w-full p-0">
          <SidebarGroupContent className="h-full">
            <SidebarMenu className="mx-auto h-full w-82.25 gap-4.5 py-4">
              {steps.map((step) => {
                const StepIcon = step.icon;

                const isActive = currentStep === step.id;

                const isCompleted = currentStep > step.id;

                return (
                  <SidebarMenuItem key={step.id} className="h-22 w-82.25">
                    <SidebarMenuButton
                      type="button"
                      size="lg"
                      isActive={isActive}
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "flex h-22 min-h-22 w-82.25 items-center gap-4",
                        "rounded-2xl border-2 bg-surface p-4",
                        "whitespace-normal text-right shadow-none",

                        "[&>svg]:size-8 [&>svg]:shrink-0",

                        "hover:bg-surface",
                        "active:bg-surface",
                        "data-[active=true]:bg-surface",
                        "data-[active=true]:font-normal",
                        "data-[active=true]:text-inherit",

                        isActive ? "border-primary" : "border-border",
                      )}
                    >
                      {/* Icon */}
                      <StepIcon
                        aria-hidden="true"
                        className={cn(
                          "size-8 shrink-0",
                          isActive ? "text-primary" : "text-text-muted",
                        )}
                      />

                      {/* Texts */}
                      <span className="flex min-w-0 flex-1 flex-col items-start justify-center gap-1 text-right">
                        <span
                          className={cn(
                            "block w-full text-right text-base font-medium leading-7",
                            isActive ? "text-primary" : "text-text",
                          )}
                        >
                          {step.title}
                        </span>

                        <span className="block w-full text-right text-sm font-medium leading-5.25 text-text-muted">
                          {step.description}
                        </span>
                      </span>

                      {/* Status */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full",
                          isCompleted
                            ? "bg-primary text-white"
                            : "border-2 border-border-strong bg-surface",
                        )}
                      >
                        {isCompleted && (
                          <Check className="size-3.5" strokeWidth={3} />
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
