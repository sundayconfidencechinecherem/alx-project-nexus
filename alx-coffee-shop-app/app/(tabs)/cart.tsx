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
import { useRouter } from "expo-router";

export default function CartScreen() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();

  const deliveryFee = 2.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + deliveryFee + tax;

  const handleCheckout = () => {
    
    router.push("/checkout");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Cart</Text>
        <Text style={styles.subtitle}>
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={80} color="#E0E0E0" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add some coffee to get started</Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.cartItems}>
            {cart.map((item) => (
              <View key={`${item.id}-${item.size}`} style={styles.cartItem}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.coffee.name}</Text>
                  <Text style={styles.itemSize}>Size: {item.size}</Text>
                </View>

                <View style={styles.row}>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      onPress={() =>
                        item.quantity === 1
                          ? removeFromCart(item.id)
                          : updateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      <Ionicons name="remove-circle-outline" size={24} color="#C67C4E" />
                    </TouchableOpacity>

                    <Text style={styles.qty}>{item.quantity}</Text>

                    <TouchableOpacity
                      onPress={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <Ionicons name="add-circle-outline" size={24} color="#C67C4E" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.price}>
                    ${(item.coffee.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Order Summary */}
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (8%)</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>${orderTotal.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.clearCartBtn}
              onPress={clearCart}
            >
              <Text style={styles.clearCartText}>Clear Cart</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", color: "#2F2D2C" },
  subtitle: { color: "#888", marginTop: 4 },

  cartItems: { paddingHorizontal: 24 },
  cartItem: {
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  itemHeader: {
    marginBottom: 8,
  },
  itemName: { fontSize: 18, fontWeight: "600", color: "#2F2D2C" },
  itemSize: { fontSize: 14, color: "#8D8D8D", marginTop: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  qtyRow: { 
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  qty: { 
    marginHorizontal: 12, 
    fontSize: 16, 
    fontWeight: "600",
    color: "#2F2D2C",
    minWidth: 30,
    textAlign: 'center',
  },
  price: { 
    fontWeight: "bold", 
    fontSize: 18, 
    color: "#C67C4E" 
  },

  orderSummary: {
    padding: 24,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#F9F9F9",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: { 
    fontSize: 16, 
    color: "#666" 
  },
  summaryValue: { 
    fontSize: 16, 
    color: "#2F2D2C",
    fontWeight: "500" 
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  totalLabel: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#2F2D2C" 
  },
  totalPrice: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#C67C4E" 
  },
  
  checkoutBtn: {
    backgroundColor: "#C67C4E",
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#C67C4E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  
  clearCartBtn: {
    backgroundColor: "transparent",
    padding: 16,
    borderRadius: 14,
    marginTop: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  clearCartText: { 
    color: "#FF6B6B", 
    fontSize: 16, 
    fontWeight: "600" 
  },

  emptyCart: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginTop: 12,
    color: "#2F2D2C",
  },
  emptyText: { 
    color: "#888", 
    marginTop: 6, 
    textAlign: "center",
    fontSize: 16,
  },
});