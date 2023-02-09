import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./user";
import chatReducer from "./chat";

const store = configureStore({
  reducer: { user: userReducer, chat: chatReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
