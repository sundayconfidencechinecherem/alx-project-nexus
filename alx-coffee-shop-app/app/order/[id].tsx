// app/order/[id].tsx
import { OrderStatus, useOrders } from "@/contexts/OrdersContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const statusConfig: Record<
  OrderStatus,
  {
    title: string;
    message: string;
    icon: string;
    color: string;
    nextSteps: string[];
  }
> = {
  received: {
    title: "Order Received",
    message: "We have received your order and will start preparing it shortly.",
    icon: "checkmark-circle",
    color: "#FF9800",
    nextSteps: ["Preparing your coffee", "Quality check"],
  },
  processing: {
    title: "Processing Order",
    message: "Your order is being processed and will move to preparation soon.",
    icon: "sync",
    color: "#9C27B0",
    nextSteps: ["Verifying details", "Moving to preparation"],
  },
  preparing: {
    title: "Preparing Your Order",
    message: "Our barista is crafting your coffee with care.",
    icon: "cafe",
    color: "#2196F3",
    nextSteps: ["Finishing touches", "Packaging"],
  },
  ready: {
    title: "Ready for Pickup",
    message: "Your order is ready!",
    icon: "time",
    color: "#4CAF50",
    nextSteps: ["Awaiting pickup", "Will be delivered shortly"],
  },
  shipped: {
    title: "Order Shipped",
    message: "Your order is on its way to you!",
    icon: "car",
    color: "#FF5722",
    nextSteps: ["In transit", "Will arrive soon"],
  },
  delivered: {
    title: "Order Delivered",
    message: "Your coffee has been delivered. Enjoy! ☕",
    icon: "checkmark-done",
    color: "#2E8B57",
    nextSteps: ["Rate your order", "Order again"],
  },
};

export default function OrderTracking() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getOrderById, updateOrderStatus } = useOrders();
  const [order, setOrder] = useState(() => getOrderById(id as string));
  const [progress] = useState(new Animated.Value(0));

  const orderId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {

    // Refresh order data periodically
    const interval = setInterval(() => {
      const updatedOrder = getOrderById(orderId);
      if (updatedOrder) {
        setOrder(updatedOrder);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, getOrderById]);

  const statusIndex = order
    ? Object.keys(statusConfig).indexOf(order.status)
    : 0;
  const statusPercentage =
    (statusIndex + 1) * (100 / Object.keys(statusConfig).length);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: statusPercentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [statusPercentage]);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#2F2D2C" />
          </TouchableOpacity>
          <Text style={styles.title}>Order Not Found</Text>
        </View>
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={80} color="#E0E0E0" />
          <Text style={styles.errorText}>Order #{orderId}</Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.homeButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const config = statusConfig[order.status];
  const isDelivered =
    order.status === "delivered" || order.status === "shipped";

  const handleContinueShopping = () => {
    router.push("/shop");
  };

  const handleGoHome = () => {
    router.push("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#2F2D2C" />
          </TouchableOpacity>
          <Text style={styles.title}>Order Tracking</Text>
        </View>

        <View style={styles.statusCard}>
          <View
            style={[
              styles.statusIcon,
              { backgroundColor: `${config.color}20` },
            ]}
          >
            <Ionicons
              name={config.icon as any}
              size={32}
              color={config.color}
            />
          </View>
          <Text style={styles.statusTitle}>{config.title}</Text>
          <Text style={styles.statusMessage}>{config.message}</Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progress.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                    backgroundColor: config.color,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Order Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID</Text>
            <Text style={styles.detailValue}>#{order.id.slice(-8)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Placed On</Text>
            <Text style={styles.detailValue}>
              {order.createdAt.toLocaleDateString()} at{" "}
              {order.createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount</Text>
            <Text style={styles.detailValue}>${order.total.toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Items</Text>
            <Text style={styles.detailValue}>{order.items.length} items</Text>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.stepsCard}>
          <Text style={styles.sectionTitle}>What is Next?</Text>
          {config.nextSteps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View
                style={[
                  styles.stepIcon,
                  { backgroundColor: `${config.color}20` },
                ]}
              >
                <Text style={[styles.stepNumber, { color: config.color }]}>
                  {index + 1}
                </Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Order Items */}
        <View style={styles.itemsCard}>
          <Text style={styles.sectionTitle}>Your Order</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>
                  {item.quantity} × ${item.price.toFixed(2)} • Size:{" "}
                  {item.size || "Medium"}
                </Text>
              </View>
              <Text style={styles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {isDelivered ? (
          <>
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleContinueShopping}
            >
              <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
              <Text style={styles.successButtonText}>Continue Shopping</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleGoHome}
            >
              <Ionicons name="home-outline" size={20} color="#C67C4E" />
              <Text style={styles.secondaryButtonText}>Go to Home</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.trackButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Ionicons name="home-outline" size={20} color="#FFFFFF" />
            <Text style={styles.trackButtonText}>Back to Home</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2F2D2C",
    marginTop: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2F2D2C",
    marginLeft: 16,
  },
  statusCard: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F3F5",
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2F2D2C",
    marginBottom: 8,
    textAlign: "center",
  },
  statusMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  progressContainer: {
    width: "100%",
    marginTop: 8,
  },
  progressBackground: {
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: "#8D8D8D",
    fontWeight: "500",
  },
  detailsCard: {
    backgroundColor: "#F9F9F9",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2F2D2C",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: "#666",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2F2D2C",
  },
  stepsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F3F5",
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "bold",
  },
  stepText: {
    fontSize: 15,
    color: "#2F2D2C",
    flex: 1,
  },
  itemsCard: {
    backgroundColor: "#F9F9F9",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2F2D2C",
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: "#8D8D8D",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C67C4E",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  trackButton: {
    backgroundColor: "#C67C4E",
    padding: 18,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#C67C4E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  trackButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  successButton: {
    backgroundColor: "#C67C4E",
    padding: 18,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#C67C4E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  successButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "rgba(198, 124, 78, 0.05)",
    padding: 18,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(198, 124, 78, 0.1)",
  },
  secondaryButtonText: {
    color: "#C67C4E",
    fontSize: 16,
    fontWeight: "600",
  },
  homeButton: {
    backgroundColor: "#C67C4E",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  homeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
