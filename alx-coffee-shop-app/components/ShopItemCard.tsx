import { View, Text } from "react-native";

export default function ShopItemCard({ item }: { item: { id: string; name: string; price: number } }) {
  return (
    <View style={{ padding: 16, marginBottom: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ddd" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
      <Text>${item.price.toFixed(2)}</Text>
    </View>
  );
}
