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
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrdersContext";
import { useRouter } from "expo-router";

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();

  const deliveryFee = 2.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + deliveryFee + tax;

  const handlePlaceOrder = () => {
    
    // Convert cart items to order items
    const orderItems = cart.map(item => ({
      id: item.id,
      name: item.coffee.name,
      price: item.coffee.price,
      quantity: item.quantity,
      size: item.size
    }));

    // Add order with proper data
    addOrder({
      items: orderItems,
      total: orderTotal,
      customerName: 'John Doe',
      address: '123 Coffee Street, Coffee City',
      phone: '(123) 456-7890'
    });
    
    // Clear the cart
    clearCart();
    
    // Navigate to order confirmation
    router.push({
      pathname: "/order/[id]",
      params: { 
        id: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2F2D2C" />
          </TouchableOpacity>
          <Text style={styles.title}>Checkout</Text>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cart.map((item) => (
            <View key={`${item.id}-${item.size}`} style={styles.orderItem}>
              <View style={styles.orderItemInfo}>
                <Text style={styles.itemName}>{item.coffee.name}</Text>
                <Text style={styles.itemDetails}>
                  {item.quantity} × ${item.coffee.price.toFixed(2)} • Size: {item.size}
                </Text>
              </View>
              <Text style={styles.itemPrice}>
                ${(item.coffee.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>${totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery Fee</Text>
            <Text style={styles.priceValue}>${deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax (8%)</Text>
            <Text style={styles.priceValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>${orderTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Delivery Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#8D8D8D" />
              <Text style={styles.infoText}>123 Coffee Street, Coffee City, CC 12345</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#8D8D8D" />
              <Text style={styles.infoText}>Estimated delivery: 20-30 minutes</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={20} color="#8D8D8D" />
              <Text style={styles.infoText}>Cash on Delivery</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>Place Order • ${orderTotal.toFixed(2)}</Text>
        </TouchableOpacity>
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
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2F2D2C",
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderItemInfo: {
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
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: "#666",
  },
  priceValue: {
    fontSize: 16,
    color: "#2F2D2C",
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2F2D2C",
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#C67C4E",
  },
  infoCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  placeOrderBtn: {
    backgroundColor: "#C67C4E",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#C67C4E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  placeOrderText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});