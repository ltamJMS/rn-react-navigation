import {StateCreator} from 'zustand';
import {clearTokens} from '../utils/token_storage';

export type UserState = {
  isAuthenticated: boolean;
  authenticate: () => void;
  unAuthenticate: () => void;
};

const createUserSlice: StateCreator<UserState> = set => ({
  isAuthenticated: false,
  authenticate: () => set({isAuthenticated: true}),
  unAuthenticate: () => {
    set({isAuthenticated: false});
    clearTokens();
  },
});

export default createUserSlice;
