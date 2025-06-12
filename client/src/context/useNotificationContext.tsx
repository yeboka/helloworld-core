import React, { createContext, useContext, useMemo } from 'react';
import { notification } from 'antd';
import type { NotificationArgsProps } from 'antd';

interface NotificationContextType {
  openNotification: (
    message: string,
    description: React.ReactNode,
    placement?: NotificationArgsProps['placement'],
    type?: NotificationArgsProps['type']
  ) => void;
  success: (message: string, description: React.ReactNode, placement?: NotificationArgsProps['placement']) => void;
  error: (message: string, description: React.ReactNode, placement?: NotificationArgsProps['placement']) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const notificationApi = useMemo<NotificationContextType>(() => {
    return {
      openNotification: (message, description, placement = 'topRight', type = 'info') => {
        api[type]({
          message,
          description,
          placement,
        });
      },
      success: (message, description, placement = 'topRight') => {
        api.success({ message, description, placement });
      },
      error: (message, description, placement = 'topRight') => {
        api.error({ message, description, placement });
      }
    };
  }, [api]);

  return (
    <NotificationContext.Provider value={notificationApi}>
      {contextHolder}
  {children}
  </NotificationContext.Provider>
);
};