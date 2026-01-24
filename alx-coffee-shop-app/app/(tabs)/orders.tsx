import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrders, Order } from '@/contexts/OrdersContext';

export default function OrdersScreen() {
  const { orders } = useOrders();

  const getStatusColor = (status: Order['status']) => {
     switch (status) {
    case 'delivered': return '#2E8B57';     
    case 'shipped': return '#4169E1';       
    case 'processing': return '#FFA500';    
    case 'preparing': return '#4169E1';     
    case 'ready': return '#FFA500';        
    case 'received': return '#666';        
    default: return '#FF6B6B';
  }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyOrders}>
          <Ionicons name="receipt-outline" size={80} color="#E0E0E0" />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>Your completed orders will appear here</Text>
        </View>
      ) : (
        <ScrollView style={styles.ordersList}>
          {orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
                  <Text style={styles.orderDate}>
                    {formatDate(order.createdAt)}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(order.status) + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(order.status) }
                  ]}>
                    {order.status}
                  </Text>
                </View>
              </View>

              <View style={styles.orderItems}>
                {order.items.slice(0, 2).map((item, index) => (
                  <Text key={index} style={styles.itemText}>
                    {item.quantity}x {item.name}
                  </Text>
                ))}
                {order.items.length > 2 && (
                  <Text style={styles.moreItems}>
                    +{order.items.length - 2} more items
                  </Text>
                )}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.totalText}>
                  Total: ${order.total.toFixed(2)}
                </Text>
                <TouchableOpacity style={styles.trackButton}>
                  <Text style={styles.trackButtonText}>Track Order</Text>
                  <Ionicons name="chevron-forward" size={16} color="#C67C4E" />
                </TouchableOpacity>
              </View>
            </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F2D2C',
  },
  subtitle: {
    color: '#888',
    marginTop: 4,
    fontSize: 14,
  },
  emptyOrders: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#2F2D2C',
  },
  emptyText: {
    color: '#888',
    marginTop: 6,
    textAlign: 'center',
  },
  ordersList: {
    paddingHorizontal: 20,
  },
  orderCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F2D2C',
  },
  orderDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  moreItems: {
    fontSize: 14,
    color: '#C67C4E',
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2F2D2C',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackButtonText: {
    fontSize: 14,
    color: '#C67C4E',
    fontWeight: '600',
    marginRight: 4,
  },
});