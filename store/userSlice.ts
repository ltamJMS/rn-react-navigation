import {StateCreator} from 'zustand';

export type UserState = {
  isAuthenticated: boolean;
  authenticate: () => void;
  unAuthenticate: () => void;
};

const createUserSlice: StateCreator<UserState> = set => ({
  isAuthenticated: false,
  authenticate: () => set({isAuthenticated: true}),
  unAuthenticate: () => set({isAuthenticated: false}),
});

export default createUserSlice;
