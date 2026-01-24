// contexts/NotificationsContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useOrders } from './OrdersContext';

export type NotificationType = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "order" | "promotion" | "system";
  orderId?: string;
  timestamp: Date;
};

interface NotificationsContextType {
  notifications: NotificationType[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notification: Omit<NotificationType, 'id' | 'timestamp'>) => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { orders } = useOrders();
  const [notifications, setNotifications] = useState<NotificationType[]>([
    {
      id: "promo-1",
      title: "Special Offer",
      message: "Get 20% off on all espresso drinks this weekend!",
      time: "1 hour ago",
      read: false,
      type: "promotion",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "promo-2",
      title: "New Coffee Added",
      message: "Try our new Seasonal Pumpkin Spice Latte!",
      time: "1 day ago",
      read: true,
      type: "promotion",
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: "system-1",
      title: "App Update",
      message: "New features added! Check out the improved order tracking.",
      time: "2 days ago",
      read: true,
      type: "system",
      timestamp: new Date(Date.now() - 172800000),
    },
  ]);

  // Format time ago
  const formatTimeAgo = useCallback((date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    return date.toLocaleDateString();
  }, []);

  const addNotification = useCallback((notificationData: Omit<NotificationType, 'id' | 'timestamp'>) => {
    const newNotification: NotificationType = {
      ...notificationData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    setNotifications(prev => {
      // Avoid duplicates within the last 1 minute
      const oneMinuteAgo = Date.now() - 60000;
      const isRecentDuplicate = prev.some(n => 
        n.type === newNotification.type && 
        n.orderId === newNotification.orderId && 
        n.title === newNotification.title &&
        n.timestamp.getTime() > oneMinuteAgo
      );
      
      if (isRecentDuplicate) return prev;
      
      return [newNotification, ...prev];
    });
  }, []);

  // Generate order notifications - UPDATED TO INCLUDE ALL STATUSES
  useEffect(() => {
    const lastNotificationTimes: Record<string, number> = {};
    
    orders.forEach(order => {
      let title = "";
      let message = "";
      let shouldNotify = false;
      
      switch (order.status) {
        case "received":
          title = "Order Received";
          message = `Your order #${order.id.slice(-6)} has been received and is being processed.`;
          shouldNotify = true;
          break;
        case "processing":
          title = "Order Processing";
          message = `Your order #${order.id.slice(-6)} is now being processed.`;
          shouldNotify = true;
          break;
        case "preparing":
          title = "Preparing Your Order";
          message = `Your order #${order.id.slice(-6)} is now being prepared.`;
          shouldNotify = true;
          break;
        case "ready":
          title = "Order Ready";
          message = `Your order #${order.id.slice(-6)} is ready for pickup!`;
          shouldNotify = true;
          break;
        case "shipped":
          title = "Order Shipped";
          message = `Your order #${order.id.slice(-6)} has been shipped and is on its way!`;
          shouldNotify = true;
          break;
        case "delivered":
          title = "Order Delivered";
          message = `Your order #${order.id.slice(-6)} has been delivered. Enjoy your coffee!`;
          shouldNotify = true;
          break;
      }

      // Check if we should notify (at least 1 minute since last notification for this order)
      const lastTime = lastNotificationTimes[order.id] || 0;
      const now = Date.now();
      const oneMinute = 60000;
      
      if (shouldNotify && title && message && (now - lastTime) > oneMinute) {
        // Check if this notification already exists
        const existingNotification = notifications.find(
          n => n.orderId === order.id && n.title === title
        );

        if (!existingNotification) {
          addNotification({
            title,
            message,
            time: formatTimeAgo(order.createdAt),
            read: false,
            type: "order",
            orderId: order.id,
          });
          
          // Update last notification time for this order
          lastNotificationTimes[order.id] = now;
        }
      }
    });
  }, [orders, addNotification, formatTimeAgo, notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({
        ...notification,
        read: true
      }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications,
      addNotification,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error('useNotifications must be used within NotificationsProvider');
  return context;
};