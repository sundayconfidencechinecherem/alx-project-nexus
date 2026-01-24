import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons} from "@expo/vector-icons";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useRouter } from "expo-router";


// Mock coffee images for favorites
const coffeeImages = [
  require("@/assets/images/coffee1.png"),
  require("@/assets/images/coffee2.png"),
  require("@/assets/images/coffee3.png"),
  require("@/assets/images/coffee4.png"),
  require("@/assets/images/coffee5.png"),
  require("@/assets/images/coffee6.png"),
  require("@/assets/images/coffee7.png"),
];

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavorites();
  const router = useRouter();

  const navigateToCoffeeDetails = (coffee: any) => {
    router.push({
      pathname: "/shop/[id]",
      params: { 
        id: coffee.id,
        name: coffee.name,
        description: coffee.description,
        price: coffee.price,
        rating: coffee.rating
      }
    });
  };

  const renderFavoriteItem = ({ item }: { item: any }) => {
    
    // Get a coffee image based on the item's id or use a default
    const imageIndex = parseInt(item.id) - 1;
    const coffeeImage = coffeeImages[imageIndex] || coffeeImages[0];

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigateToCoffeeDetails(item)}
      >
        <View style={styles.cardContent}>
          <Image 
            source={coffeeImage} 
            style={styles.coffeeImage} 
            resizeMode="cover"
          />
          <View style={styles.coffeeInfo}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
           
       
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            <View style={styles.cardFooter}>
              <View style={styles.priceContainer}>
                <Text style={styles.dollarSign}>$</Text>
                <Text style={styles.price}>{item.price.toFixed(2)}</Text>
              </View>
             
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.rating}>{item.rating}</Text>
              </View>
               <View>
                 <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeFavorite(item.id)}
          >
            <Ionicons name="heart" size={24} color="#C67C4E" />
          </TouchableOpacity>
              </View>
            </View>
          </View>
          
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>{favorites.length} {favorites.length === 1 ? 'item' : 'items'}</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={80} color="#E0E0E0" />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart icon on any coffee to add it here
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderFavoriteItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFFFFF" 
  },
  header: { 
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold" as const,
    color: "#2F2D2C" 
  },
  subtitle: { 
    color: "#8D8D8D", 
    marginTop: 4,
    fontSize: 14 
  },
  empty: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    paddingHorizontal: 40 
  },
  emptyTitle: { 
    fontSize: 22, 
    fontWeight: "bold" as const,
    marginTop: 16,
    color: "#2F2D2C" 
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#8D8D8D",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F3F5",
  },
  cardContent: {
    flexDirection: "row" as const,
    padding: 12,
    alignItems: "center" as const,
  },
  coffeeImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  coffeeInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  name: { 
    fontSize: 18, 
    fontWeight: "bold" as const,
    color: "#2F2D2C",
    marginBottom: 4 
  },
  description: { 
    fontSize: 13,
    color: "#666666",
    lineHeight: 18,
    marginBottom: 8 
  },
  cardFooter: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  priceContainer: {
    flexDirection: "row" as const,
    alignItems: "baseline" as const,
  },
  dollarSign: {
    fontSize: 14,
    fontWeight: "bold" as const,
    color: "#C67C4E",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#2F2D2C",
    marginLeft: 2,
  },
  ratingContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 4,
  },
  rating: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#2F2D2C",
    marginLeft: 4,
  },
  removeButton: {
    width: 40,
    height: 40,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
});