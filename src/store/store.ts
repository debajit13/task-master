import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type State = {
  username: string;
  email: string;
  uid: string;
};

type Action = {
  login: (payload: State) => void;
  logout: () => void;
};

const useStore = create<State & Action>()(
  devtools(
    persist(
      (set) => ({
        username: '',
        email: '',
        uid: '',
        login: (payload: State) =>
          set(() => ({
            username: payload.username,
            email: payload.email,
            uid: payload.uid,
          })),
        logout: () =>
          set(() => ({
            username: '',
            email: '',
            uid: '',
          })),
      }),
      { name: 'auth' }
    )
  )
);

export default useStore;
