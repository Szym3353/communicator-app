import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from ".";
import fetchHeaders from "../fetchHeaders";
import { socket } from "../socket";

export type message = {
  date: string;
  author: string;
  content: string;
  read: string[];
  _id: string;
};

export type chatUser = {
  id: string;
  avatarURL: string;
  username: string;
};

export type callUser = {
  mic?: boolean;
  cam?: boolean;
} & chatUser;

export type call = {
  started: string;
  chatId: string;
  accepted: boolean | null;
};

export type chat = {
  loggedUser: chatUser;
  contactUser: chatUser;
  messages: message[];
  _id: string;
  call: (call & { users: string[] }) | null;
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
      .chat.data.chats.find((el) => el._id === selectedChatId);
    let messagesLength = selectedChat?.messages.length;

    let response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}chat/messages/${
        thunkApi.getState().chat.data.selectedChat
      }/${messagesLength}`,
      {
        method: "GET",
        headers: fetchHeaders(),
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
          headers: fetchHeaders(),
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

      if (chat?.messages.find((el) => el.date === messageData.date)) return;
      chat?.messages.unshift(messageData);
    },
    readMessages: (
      state,
      { payload }: { payload: { chatId: string; userId: string } }
    ) => {
      if (!payload) return;

      let chat = state.data.chats.find((el) => el._id === payload.chatId);
      if (!chat) return;

      chat.messages = chat.messages.map((message) =>
        message.read.findIndex((el) => el === payload.userId) === -1
          ? { ...message, read: [...message.read, payload.userId] }
          : message
      );
    },
    addUserToCall: (state, action) => {
      let chat = state.data.chats.find(
        (el) => el._id === action.payload.chatId
      );
      if (!chat || !chat.call) return;

      chat.call.users.push();
    },
    setCall: (state, { payload }: { payload: call & { users: string[] } }) => {
      let chat = state.data.chats.find((el) => el._id === payload.chatId);
      if (!chat) return;

      chat.call = payload;
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
        ) === -1 && state.data.chats.push(action.payload);
        state.data.selectedChat = action.payload._id;

        socket.emit("message:read:contact", {
          chatId: action.payload._id,
          messageAuthor: action.payload.contactUser.id,
          userId: action.payload.loggedUser.id,
        });
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
export const {
  pushMessage,
  addUserToCall,
  clearChatStore,
  setCall,
  readMessages,
} = slice.actions;
