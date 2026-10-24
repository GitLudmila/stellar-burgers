import { expect, test, describe } from '@jest/globals';
import userSlice, {
  initialState,
  setIsInit,
  setIsLoading,
  setUser
} from './user-slice';
import {
  getUserThunk,
  loginUserThunk,
  logoutThunk,
  registerUserThunk,
  updateUserThunk
} from './actions';

const initialUserState = { ...initialState };
const user = {
  email: '',
  name: 'User-1'
};
const expectedResult = {
  success: true,
  refreshToken: '',
  accessToken: '',
  user: { ...user }
};

describe('тесты синхронных экшенов в user.slice', () => {
  test('Добавить пользователя', () => {
    const newState = userSlice(initialUserState, setUser(user));

    expect(newState.user).toEqual(expect.objectContaining(user));
  });
  test('Добавить метку о регистрации', () => {
    const isInit = false;
    const newState = userSlice(initialUserState, setIsInit(isInit));

    expect(newState.isInit).toBe(isInit);
  });
  test('Добавить метку загрузки', () => {
    const isLoading = false;
    const newState = userSlice(initialUserState, setIsLoading(isLoading));

    expect(newState.isLoading).toBe(isLoading);
  });
});

describe('тесты асинхронных экшенов в user.slice', () => {
  test('Состояние loginUserThunk.pending при инициализации пользователя', () => {
    const action = { type: loginUserThunk.pending.type };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(true);
  });
  test('Состояние loginUserThunk.fulfilled при инициализации пользователя', () => {
    const action = {
      type: loginUserThunk.fulfilled.type,
      payload: expectedResult
    };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(expectedResult.user);
    expect(state.isInit).toBe(true);
  });
  test('Состояние loginUserThunk.rejected при инициализации пользователя', () => {
    const action = { type: loginUserThunk.rejected.type };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(false);
  });

  test('Состояние registerUserThunk.pending при регистрации пользователя', () => {
    const action = { type: registerUserThunk.pending.type };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(true);
  });
  test('Состояние registerUserThunk.fulfilled при регистрации пользователя', () => {
    const action = {
      type: registerUserThunk.fulfilled.type,
      payload: expectedResult
    };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(expectedResult.user);
    expect(state.isInit).toBe(true);
  });
  test('Состояние registerUserThunk.rejected при регистрации пользователя', () => {
    const action = { type: registerUserThunk.rejected.type };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(false);
  });

  test('Состояние getUserThunk.pending', () => {
    const action = { type: getUserThunk.pending.type };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(true);
  });
  test('Состояние getUserThunk.fulfilled', () => {
    const action = {
      type: getUserThunk.fulfilled.type,
      payload: expectedResult
    };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(expectedResult.user);
    expect(state.isInit).toBe(true);
  });
  test('Состояние getUserThunk.rejected', () => {
    const action = { type: getUserThunk.rejected.type };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(false);
  });

  test('Состояние logoutThunk.pending', () => {
    const action = { type: logoutThunk.pending.type };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(true);
  });
  test('Состояние logoutThunk.fulfilled', () => {
    const action = { type: logoutThunk.fulfilled.type };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(false);
    expect(state.isInit).toBe(false);
  });
  test('Состояние logoutThunk.rejected', () => {
    const action = { type: logoutThunk.rejected.type };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(false);
  });

  test('Состояние updateUserThunk.pending', () => {
    const action = { type: updateUserThunk.pending.type };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(true);
  });
  test('Состояние updateUserThunk.fulfilled', () => {
    const expectedResponse = {
      success: true,
      user: { ...user }
    };
    const action = {
      type: updateUserThunk.fulfilled.type,
      payload: expectedResponse
    };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(expectedResponse.user);
  });
  test('Состояние updateUserThunk.rejected', () => {
    const action = { type: updateUserThunk.rejected.type };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(false);
  });
});
