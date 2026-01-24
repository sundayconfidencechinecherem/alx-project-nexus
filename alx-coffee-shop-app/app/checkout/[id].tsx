import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const shopItems = [
  { id: "1", name: "Latte", price: 4 },
  { id: "2", name: "Espresso", price: 3 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const item = shopItems.find((i) => i.id === id);

  if (!item) return <Text>Item not found!</Text>;

  const handlePlaceOrder = () => {
  
    router.push(`/order/${item.id}`);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>
        Checkout
      </Text>
      <Text style={{ fontSize: 20 }}>{item.name}</Text>
      <Text style={{ fontSize: 18, color: "gray", marginBottom: 16 }}>
        Price: ${item.price}
      </Text>

      <TouchableOpacity
        onPress={handlePlaceOrder}
        style={{
          backgroundColor: "#2E8B57",
          padding: 16,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
}