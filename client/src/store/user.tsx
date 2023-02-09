import {
  createSlice,
  createAsyncThunk,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import { RootState } from ".";
import jwt_decode from "jwt-decode";
import Cookie from "js-cookie";
import { socket } from "../socket";
import fetchHeaders from "../fetchHeaders";

export type activityStatus =
  | "online"
  | "offline"
  | "away"
  | "doNotDisturb"
  | "hidden";

export type contact = {
  id: string;
  username: string;
  avatarURL: string;
  newMessage: boolean;
  contactType: "friend" | "temporary";
  registered: string;
  activityStatus: { currentStatus: activityStatus };
};

export type userData = {
  _id: string;
  username: string;
  email: string;
  avatarURL: string;
  contacts: contact[];
  registered: string;
  code: string;
};

function setCookie(token: string) {
  let decoded: string = jwt_decode(token);
  document.cookie = `token=${token}; expires=${new Date(
    new Date().getTime() + 1000 * 24 * 60 * 60
  ).toUTCString()}`;
  return decoded;
}

export const getUser = createAsyncThunk<userData, string, { state: RootState }>(
  "user/getUser",
  async (id, thunkApi) => {
    try {
      const { user } = thunkApi.getState();

      if (user.isPending && user.requestId !== thunkApi.requestId) return;

      let response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}user/${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: fetchHeaders,
        }
      );

      return response.json();
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const authUser = createAsyncThunk<
  { token: string },
  {
    email: string;
    password: string;
    confirmPassword?: string;
    username?: string;
  },
  { state: RootState }
>("user/authUser", async (data, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState();
    if (user.isPending && user.requestId !== thunkAPI.requestId) return;

    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}auth/${
        data.username ? "register" : "login"
      }`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

const initialState = {
  data: null as userData | null,
  showContacts: false,
  isPending: false,
  requestId: null as null | string,
  error: undefined as string | undefined,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addContact: (state, action) => {
      if (!state.data?.contacts.find((el) => el.id === action.payload.id)) {
        state.data?.contacts.push(action.payload);
      }
    },
    updateContact: (state, action) => {
      let contact = state.data?.contacts.find(
        (el) => el.id == action.payload.contactId
      );
      if (!contact) return;
      contact.activityStatus.currentStatus = action.payload.status;
    },
    contactOnTop: (state, action) => {
      if (!state.data) return;
      if (!action.payload) {
        let contactFromList = state.data?.contacts.find(
          (el) => el.id === action.payload.id
        );
        if (!contactFromList) return;

        state.data.contacts = state.data?.contacts.filter(
          (el) => el !== action.payload.id
        );
        state.data.contacts.unshift(contactFromList);
      } else {
        state.data.contacts.unshift(action.payload);
      }
    },
    toggleShowContacts: (state, action) => {
      state.showContacts = action.payload;
    },
    clearUserStore: (state) => {
      state = initialState;
      Cookie.remove("token");
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<typeof initialState>) => {
    builder
      .addCase(authUser.pending, (state, action) => {
        if (state.isPending) return;

        state.isPending = true;
        state.requestId = action.meta.requestId;
      })
      .addCase(authUser.fulfilled, (state, { payload }) => {
        if (!payload) return;

        state.isPending = false;
        state.requestId = null;
        setCookie(payload.token);
      })
      .addCase(authUser.rejected, (state, action) => {
        state.isPending = false;
        state.requestId = null;
        state.error = action.error.message;
      })
      .addCase(getUser.pending, (state, action) => {
        if (state.isPending) return;
        state.isPending = true;
        state.requestId = action.meta.requestId;
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        if (!payload) return;

        state.isPending = false;
        state.requestId = null;
        state.data = payload;
        socket.emit("user:setStatus:online", { id: payload._id });
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isPending = false;
        state.requestId = null;
        state.error = action.error.message;
      });
  },
});

export default slice.reducer;
export const {
  addContact,
  updateContact,
  contactOnTop,
  clearUserStore,
  toggleShowContacts,
} = slice.actions;
