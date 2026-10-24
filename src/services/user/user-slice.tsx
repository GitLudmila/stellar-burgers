import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserThunk,
  loginUserThunk,
  logoutThunk,
  registerUserThunk,
  updateUserThunk
} from './actions';

export interface UserState {
  isInit: boolean;
  isCheckingSession: boolean;
  isLoading: boolean;
  user: TUser | null;
}

export const initialState: UserState = {
  isInit: false,
  isCheckingSession: true,
  isLoading: false,
  user: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
    setIsInit: (state, action: PayloadAction<boolean>) => {
      state.isInit = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSessionCheckComplete: (state) => {
      state.isCheckingSession = false;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthInit: (state) => state.isInit,
    selectIsLoading: (state) => state.isLoading,
    selectIsCheckingSession: (state) => state.isCheckingSession
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isInit = true;
      state.user = payload.user;
    });
    builder.addCase(loginUserThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(registerUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isInit = true;
      state.user = payload.user;
    });
    builder.addCase(registerUserThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isInit = true;
      state.isCheckingSession = false;
      state.user = payload.user;
    });
    builder.addCase(getUserThunk.rejected, (state) => {
      state.isLoading = false;
      state.isInit = false;
      state.isCheckingSession = false;
    });
    builder.addCase(logoutThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isInit = false;
      state.user = null;
    });
    builder.addCase(logoutThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
      })
      .addCase(updateUserThunk.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const { setIsInit, setIsLoading, setUser } = userSlice.actions;
export const {
  selectUser,
  selectIsAuthInit,
  selectIsLoading,
  selectIsCheckingSession
} = userSlice.selectors;

export default userSlice.reducer;
