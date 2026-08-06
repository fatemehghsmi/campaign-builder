import { configureStore } from "@reduxjs/toolkit";

import campaignBuilderReducer from "@/lib/features/campaign-builder/campaignBuilderSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      campaignBuilder: campaignBuilderReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<
  AppStore["getState"]
>;

export type AppDispatch = AppStore["dispatch"];