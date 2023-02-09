import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from ".";
import Cookie from "js-cookie";
import fetchHeaders from "../fetchHeaders";

export type message = {
  date: string;
  author: string;
  content: string;
  read: string[];
  _id: string;
};

export type chat = {
  loggedUser: { id: string; avatarURL: string; username: string };
  contactUser: { id: string; avatarURL: string; username: string };
  messages: message[];
  _id: string;
};

type chatsData = {
  chats: chat[];
  selected: string;
  selectedChatroom: chat | null;
};

export const getMessages = createAsyncThunk<
  { messages: message[]; chatId: string },
  string,
  { state: RootState }
>("chat/getMessages", async (data, thunkApi) => {
  try {
    const { chat } = thunkApi.getState();
    if (chat.isPending && chat.requestId !== thunkApi.requestId) return;

    let selectedChatId = thunkApi.getState().chat.data.selectedChat;

    let selectedChat = thunkApi
      .getState()
      .chat.data.chats.find((el) => el._id == selectedChatId);

    let messagesLength = selectedChat?.messages.length;

    let response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}chat/messages/${
        thunkApi.getState().chat.data.selectedChat
      }/${messagesLength}`,
      {
        method: "GET",
        headers: fetchHeaders,
        credentials: "include",
      }
    );

    return response.json();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const getChatRoom = createAsyncThunk<chat, string, { state: RootState }>(
  "chat/getChatRoom",
  async (contactUser, thunkApi) => {
    try {
      let findChat = thunkApi
        .getState()
        .chat.data.chats.find((el) => el.contactUser.id === contactUser);
      if (findChat) return findChat;

      let response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}chat/get/${
          thunkApi.getState().user.data?._id
        }/${contactUser}`,
        {
          method: "GET",
          headers: fetchHeaders,
          credentials: "include",
        }
      );

      return response.json();
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const initialState = {
  data: {
    chats: [] as chat[],
    selectedChat: null as string | null,
  },
  isPending: false,
  requestId: false as boolean | string,
  error: null,
};

const slice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    pushMessage: (state, action) => {
      if (!state.data) return;
      let { chatId, ...messageData } = action.payload;
      let chat = state.data.chats.find(
        (el) => el._id === action.payload.chatId
      );

      if (chat?.messages.find((el) => el.date == messageData.date)) return;
      chat?.messages.unshift(messageData);
    },
    clearChatStore: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<typeof initialState>) => {
    builder
      .addCase(getChatRoom.fulfilled, (state, action) => {
        state.data.chats.findIndex(
          (el) =>
            el.contactUser === action.payload.contactUser &&
            el.loggedUser === action.payload.loggedUser
        ) == -1 && state.data.chats.push(action.payload);
        state.data.selectedChat = action.payload._id;
      })
      .addCase(getMessages.pending, (state, action) => {
        if (state.isPending) return;

        state.isPending = true;
        state.requestId = action.meta.requestId;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.isPending = false;
        state.requestId = false;

        state.data.chats
          .find((el) => el._id === action.payload.chatId)
          ?.messages.push(...action.payload.messages);
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isPending = false;
        state.requestId = false;
      });
  },
});

export default slice.reducer;
export const { pushMessage, clearChatStore } = slice.actions;
