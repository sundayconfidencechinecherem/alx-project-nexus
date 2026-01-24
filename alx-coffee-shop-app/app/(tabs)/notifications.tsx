// app/(tabs)/notifications.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNotifications, NotificationType } from "@/contexts/NotificationsContext";
import { useRouter } from "expo-router";

export default function NotificationsScreen() {
  const router = useRouter();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotifications();

  const handleNotificationPress = (notification: NotificationType) => {
   if (notification.type === "order" && notification.orderId) {
  router.push({
    pathname: "/order/[id]",
    params: { id: notification.orderId } 
  });
}
    
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const getIconForType = (type: NotificationType["type"]) => {
    switch (type) {
      case "order":
        return "cart";
      case "promotion":
        return "gift";
      case "system":
        return "information-circle";
      default:
        return "notifications";
    }
  };

  const getColorForType = (type: NotificationType["type"]) => {
    switch (type) {
      case "order":
        return "#C67C4E";
      case "promotion":
        return "#FF6B6B";
      case "system":
        return "#4169E1";
      default:
        return "#8D8D8D";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
          </Text>
        </View>
        <View style={styles.headerButtons}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
          {notifications.length > 0 && (
            <TouchableOpacity onPress={clearAllNotifications} style={styles.clearAllButton}>
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyNotifications}>
          <Ionicons name="notifications-off-outline" size={80} color="#E0E0E0" />
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptyText}>You are all caught up!</Text>
        </View>
      ) : (
        <ScrollView style={styles.notificationsList}>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => handleNotificationPress(notification)}
              activeOpacity={0.7}
            >
              <View 
                style={[
                  styles.notificationCard,
                  !notification.read && styles.notificationUnread
                ]}
              >
                <View style={styles.notificationHeader}>
                  <View style={styles.notificationIconContainer}>
                    <View 
                      style={[
                        styles.notificationIcon,
                        { backgroundColor: getColorForType(notification.type) + '20' }
                      ]}
                    >
                      <Ionicons 
                        name={getIconForType(notification.type)} 
                        size={20} 
                        color={getColorForType(notification.type)} 
                      />
                    </View>
                    <View style={styles.notificationTextContainer}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      <Text style={styles.notificationTime}>{notification.time}</Text>
                    </View>
                  </View>
                  {!notification.read && (
                    <View style={styles.unreadIndicator} />
                  )}
                </View>
                
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                
                <View style={styles.notificationActions}>
                  {!notification.read && (
                    <TouchableOpacity 
                      style={styles.readButton}
                      onPress={() => markAsRead(notification.id)}
                    >
                      <Text style={styles.readButtonText}>Mark as read</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteNotification(notification.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>

               {notification.type === "order" && notification.orderId && (
  <TouchableOpacity 
    style={styles.trackOrderButton}
    onPress={() => router.push({
      pathname: "/order/[id]",
      params: { id: notification.orderId! } 
    })}
  >
    <Text style={styles.trackOrderText}>Track Order</Text>
    <Ionicons name="arrow-forward" size={16} color="#C67C4E" />
  </TouchableOpacity>
)}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#2F2D2C',
  },
  subtitle: {
    color: '#888',
    marginTop: 4,
    fontSize: 14,
  },
  headerButtons: {
    flexDirection: 'row' as const,
    gap: 12,
    alignItems: 'center' as const,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(198, 124, 78, 0.1)',
    borderRadius: 6,
  },
  markAllText: {
    fontSize: 12,
    color: '#C67C4E',
    fontWeight: '600' as const,
  },
  clearAllButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 8,
  },
  emptyNotifications: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold' as const,
    marginTop: 16,
    color: '#2F2D2C',
  },
  emptyText: {
    color: '#888',
    marginTop: 6,
    textAlign: 'center' as const,
  },
  notificationsList: {
    paddingHorizontal: 20,
  },
  notificationCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  notificationUnread: {
    backgroundColor: 'rgba(198, 124, 78, 0.05)',
    borderColor: 'rgba(198, 124, 78, 0.2)',
  },
  notificationHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 12,
  },
  notificationIconContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#2F2D2C',
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationActions: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  readButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(198, 124, 78, 0.1)',
    borderRadius: 6,
  },
  readButtonText: {
    fontSize: 12,
    color: '#C67C4E',
    fontWeight: '600' as const,
  },
  deleteButton: {
    padding: 6,
  },
  trackOrderButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(198, 124, 78, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(198, 124, 78, 0.1)',
    marginTop: 8,
    gap: 6,
  },
  trackOrderText: {
    fontSize: 14,
    color: '#C67C4E',
    fontWeight: '600' as const,
  },
});