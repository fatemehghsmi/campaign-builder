import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { RootState } from "@/lib/store";

import type { CampaignInformationFormValues } from "./campaignInformationSchema";
import type { EntryMessageFormValues } from "./entryMessageSchema";
import type { ResultMessageFormValues } from "./resultMessageSchema";
import type { ScheduleFormValues } from "./scheduleSchema";


export type CampaignStep =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7;


export interface CampaignBuilderState {
  currentStep: CampaignStep;

  campaignName: string;
  description: string;

  selectedJourneyId: string | null;
  selectedSegmentIds: string[];

  entryMessage: EntryMessageFormValues;
  resultMessage: ResultMessageFormValues;
  schedule: ScheduleFormValues;
}


const initialState: CampaignBuilderState = {
  currentStep: 1,

  campaignName: "",
  description: "",

  selectedJourneyId: null,
  selectedSegmentIds: [],

  entryMessage: {
    isEnabled: true,

    senderLineId: "1000000000",

    message:
      "سلام سعید احمدی عزیز\n" +
      "به باشگاه مشتریان عطر مجلسی خوش آمدید.\n" +
      "سطح کاربری شما طلایی است.\n" +
      "امتیاز فعلی شما ۱٬۲۰۰ است.\n" +
      "اعتبار فعلی شما ۵۰۰٬۰۰۰ تومان است.\n" +
      "برای مشاهده جزئیات روی لینک زیر بزنید:\n" +
      "https://www.atrmajlesi.ir\n" +
      "لغو 11",

    linkUrl:
      "https://www.atrmajlesi.ir",

    uniqueLinkPerCustomer: false,
  },

  resultMessage: {
    isEnabled: true,

    channel: "bale",

    imageUrl: "",

    message:
      "سلام سعید احمدی عزیز\n" +
      "ورود شما را به باشگاه مشتریان عطر مجلسی تبریک می‌گوییم.\n" +
      "امتیاز شما در باشگاه ما: ۱٬۲۰۰\n" +
      "https://www.atrmajlesi.ir\n" +
      "لغو 11",

    linkUrl:
      "https://www.atrmajlesi.ir",

    uniqueLinkPerCustomer: false,
  },

  schedule: {
    startDate: "",
    startHour: "",
    startMinute: "",
    startSecond: "",

    endDate: "",
    endHour: "",
    endMinute: "",
    endSecond: "",
  },
};


const campaignBuilderSlice = createSlice({
  name: "campaignBuilder",

  initialState,

  reducers: {
    campaignInformationSaved(
      state,
      action: PayloadAction<CampaignInformationFormValues>,
    ) {
      state.campaignName =
        action.payload.campaignName;

      state.description =
        action.payload.description;
    },


    journeySelected(
      state,
      action: PayloadAction<string>,
    ) {
      state.selectedJourneyId =
        action.payload;
    },


    customerSegmentsSaved(
      state,
      action: PayloadAction<string[]>,
    ) {
      state.selectedSegmentIds =
        action.payload;
    },


    entryMessageSaved(
      state,
      action: PayloadAction<EntryMessageFormValues>,
    ) {
      state.entryMessage =
        action.payload;
    },


    resultMessageSaved(
      state,
      action: PayloadAction<ResultMessageFormValues>,
    ) {
      state.resultMessage =
        action.payload;
    },


    scheduleSaved(
      state,
      action: PayloadAction<ScheduleFormValues>,
    ) {
      state.schedule =
        action.payload;
    },


    nextStep(state) {
      if (state.currentStep < 7) {
        state.currentStep = (
          state.currentStep + 1
        ) as CampaignStep;
      }
    },


    previousStep(state) {
      if (state.currentStep > 1) {
        state.currentStep = (
          state.currentStep - 1
        ) as CampaignStep;
      }
    },


    builderReset() {
      return initialState;
    },
  },
});


export const {
  campaignInformationSaved,
  journeySelected,
  customerSegmentsSaved,
  entryMessageSaved,
  resultMessageSaved,
  scheduleSaved,
  nextStep,
  previousStep,
  builderReset,
} = campaignBuilderSlice.actions;


export const selectCampaignBuilder = (
  state: RootState,
) => state.campaignBuilder;


export const selectCurrentStep = (
  state: RootState,
) =>
  state.campaignBuilder.currentStep;


export const selectSelectedJourneyId = (
  state: RootState,
) =>
  state.campaignBuilder.selectedJourneyId;


export const selectSelectedSegmentIds = (
  state: RootState,
) =>
  state.campaignBuilder.selectedSegmentIds;


export const selectEntryMessage = (
  state: RootState,
) =>
  state.campaignBuilder.entryMessage;


export const selectResultMessage = (
  state: RootState,
) =>
  state.campaignBuilder.resultMessage;


export const selectSchedule = (
  state: RootState,
) =>
  state.campaignBuilder.schedule;


export const selectCampaignInformation =
  createSelector(
    [selectCampaignBuilder],
    (campaignBuilder) => ({
      campaignName:
        campaignBuilder.campaignName,

      description:
        campaignBuilder.description,
    }),
  );


export default campaignBuilderSlice.reducer;