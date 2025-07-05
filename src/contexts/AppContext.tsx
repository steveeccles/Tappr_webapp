import React, { createContext, useContext, useState } from 'react';

type AppContextType = {
  vibrationEnabled: boolean;
  toggleVibration: () => void;

  notifications: {
    chats: number;
    stories: number;
  };
  setNotifications: (n: { chats: number; stories: number }) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notifications, setNotifications] = useState({ chats: 0, stories: 0 });

  const toggleVibration = () => setVibrationEnabled((prev) => !prev);

  return (
    <AppContext.Provider
      value={{ vibrationEnabled, toggleVibration, notifications, setNotifications }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}; 