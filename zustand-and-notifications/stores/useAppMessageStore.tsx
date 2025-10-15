import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AppMessageType =
  | 'CHANGE_EMAIL_SUCCESS'
  | 'REGISTER_SUCCESS'
  | 'OFFLINE_WARNING'
  | 'LINK_FAILED_ERROR'
  | 'OFFLINE_WARNING'
  | 'AUTHENTICATION_FAILED_ERROR'
  | 'KID_DEVICE_SETUP_COMPLETE';

interface AppMessageStore {
  messageType: AppMessageType | null;
  setMessageType: (messageType: AppMessageType) => void;
  clearMessage: () => void;
}

export const useAppMessageStore = create<AppMessageStore>()(
  persist(
    set => ({
      messageType: null,
      setMessageType: messageType => set({ messageType }),
      clearMessage: () => set({ messageType: null }),
    }),
    {
      name: 'app-message-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// for testing
export const appMessageStore = useAppMessageStore;
