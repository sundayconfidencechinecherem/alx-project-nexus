import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "expo-router";


// Coffee data with categories
const coffees = [
  {
    id: "1",
    name: "Cappuccino",
    description: "With steamed milk and dense milk foam",
    price: 4.2,
    rating: 4.5,
    image: require("@/assets/images/coffee1.png"),
    category: "Cappuccino",
  },
  {
    id: "2",
    name: "Caramel Macchiato",
    description: "With vanilla syrup, milk, espresso, caramel sauce",
    price: 4.5,
    rating: 4.7,
    image: require("@/assets/images/coffee2.png"),
    category: "Caramel Macchiato",
  },
  {
    id: "3",
    name: "Espresso",
    description: "Strong black coffee shot",
    price: 3.5,
    rating: 4.8,
    image: require("@/assets/images/coffee3.png"),
    category: "Espresso",
  },
  {
    id: "4",
    name: "Latte",
    description: "Espresso with steamed milk",
    price: 4.0,
    rating: 4.3,
    image: require("@/assets/images/coffee4.png"),
    category: "Latte",
  },
  {
    id: "5",
    name: "Mocha",
    description: "With chocolate syrup and whipped cream",
    price: 4.8,
    rating: 4.6,
    image: require("@/assets/images/coffee5.png"),
    category: "Mocha",
  },
  {
    id: "6",
    name: "Flat White",
    description: "Smooth espresso with microfoam",
    price: 4.3,
    rating: 4.4,
    image: require("@/assets/images/coffee6.png"),
    category: "Flat White",
  },
  {
    id: "7",
    name: "Americano",
    description: "Espresso with hot water",
    price: 3.8,
    rating: 4.2,
    image: require("@/assets/images/coffee7.png"),
    category: "Americano",
  },
  {
    id: "8",
    name: "Irish Coffee",
    description: "With whiskey and cream",
    price: 5.5,
    rating: 4.9,
    image: require("@/assets/images/coffee1.png"),
    category: "Irish Coffee",
  },
];

// Categories (all coffee categories from the data)
const categories = ["All", "Cappuccino", "Caramel Macchiato", "Espresso", "Latte", "Mocha", "Flat White", "Americano", "Irish Coffee"];

export default function ShopScreen() {
  const { addToCart, totalItems } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  // Toast notification system
  const showNotification = (message: string) => {
   
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    
    setToastMessage(message);
    setShowToast(true);
    
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowToast(false);
    });
  };

  const handleAddToCart = (coffee: any) => {
    addToCart(coffee, "Medium");
    showNotification(`${coffee.name} added to cart`);
  };

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

  const navigateToCart = () => {
    router.push("/cart");
  };

  const handleBack = () => {
    router.back();
  };

  // Filter coffees
  const filteredCoffees = coffees.filter((coffee) => {
    let matchesSearch = true;
    let matchesCategory = true;

   
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      matchesSearch = (
        coffee.name.toLowerCase().includes(searchLower) ||
        coffee.description.toLowerCase().includes(searchLower)
      );
    }

    
    if (selectedCategory !== "All") {
      matchesCategory = coffee.category === selectedCategory;
    }

   
    return matchesSearch && matchesCategory;
  });

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <SafeAreaView style={styles.container}>
   
      {showToast && (
        <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
          <Ionicons 
            name="checkmark-circle" 
            size={20} 
            color="#FFFFFF" 
          />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}

     
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleBack} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <View style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#2F2D2C" />
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Coffee Shop</Text>
          <Text style={styles.subtitle}>Discover our premium selection</Text>
        </View>
        
        <TouchableOpacity 
          onPress={navigateToCart} 
          style={styles.cartButton}
          activeOpacity={0.7}
        >
          <View style={styles.headerIconContainer}>
            <Ionicons name="cart-outline" size={24} color="#2F2D2C" />
            {totalItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {totalItems > 9 ? '9+' : totalItems}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8D8D8D" />
          <TextInput
            placeholder="Search coffees..."
            placeholderTextColor="#8D8D8D"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={20} color="#8D8D8D" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories  */}
      <View style={styles.categoriesWrapper}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
                numberOfLines={1}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {searchQuery 
            ? `Search results for "${searchQuery}"`
            : selectedCategory !== "All" 
              ? `${selectedCategory} Coffees`
              : "All Coffees"
          }
        </Text>
        <Text style={styles.resultsCount}>
          {filteredCoffees.length} {filteredCoffees.length === 1 ? 'coffee' : 'coffees'}
        </Text>
      </View>

      {/* Coffee Grid */}
      {filteredCoffees.length > 0 ? (
        <FlatList
          data={filteredCoffees}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.coffeeCard}
              onPress={() => navigateToCoffeeDetails(item)}
            >
              <Image source={item.image} style={styles.coffeeImage} />
              <View style={styles.coffeeInfo}>
                <Text style={styles.coffeeName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.coffeeDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.coffeeFooter}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.dollarSign}>$</Text>
                    <Text style={styles.coffeePrice}>{item.price.toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                  >
                    <FontAwesome name="plus" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.noResults}>
          <Ionicons name="search-outline" size={48} color="#E0E0E0" />
          <Text style={styles.noResultsText}>No coffees found</Text>
          <Text style={styles.noResultsSubtext}>
            {searchQuery 
              ? `No results for "${searchQuery}"${selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}`
              : selectedCategory !== "All"
                ? `No ${selectedCategory} coffees available`
                : "Try a different search or category"
            }
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  toast: {
    position: 'absolute',
    top: '50%', 
    left: 20,
    right: 20,
    backgroundColor: '#2F2D2C',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ translateY: -25 }], 
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
    flex: 1,
  },
  
  // Header with back arrow and cart
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: "#2F2D2C",
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: "#8D8D8D",
    marginTop: 4,
    textAlign: 'center',
  },
  cartButton: {
    padding: 4,
  },
  headerIconContainer: {
    position: "relative" as const,
  },
  cartBadge: {
    position: "absolute" as const,
    top: -4,
    right: -4,
    backgroundColor: "#FF6B6B",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold" as const,
  },
  
  // Search Bar
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#2F2D2C",
  },
  
  // Categories wrapper 
  categoriesWrapper: {
    marginTop: 16,
    marginBottom: 20,
    minHeight: 80, 
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#2F2D2C",
    marginLeft: 20,
    marginBottom: 12,
  },
  categoriesScroll: {
    flexGrow: 0, 
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingRight: 24,
    alignItems: "center" as const,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "#F8F9FA",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "transparent",
    minHeight: 48, // Fixed minimum height
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  categoryButtonActive: {
    backgroundColor: "rgba(198, 124, 78, 0.1)",
    borderColor: "#C67C4E",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500" as const,
    textAlign: "center" as const,
  },
  categoryTextActive: {
    color: "#C67C4E",
    fontWeight: "600" as const,
  },
  
  // Results section
  resultsContainer: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#2F2D2C",
    flex: 1,
  },
  resultsCount: {
    fontSize: 14,
    color: "#8D8D8D",
  },
  
  // Grid styles
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  coffeeCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F3F5",
  },
  coffeeImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
  },
  coffeeInfo: {
    padding: 12,
  },
  coffeeName: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: "#2F2D2C",
    marginBottom: 4,
  },
  coffeeDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    lineHeight: 16,
  },
  coffeeFooter: {
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
  coffeePrice: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#2F2D2C",
    marginLeft: 2,
  },
  addButton: {
    backgroundColor: "#C67C4E",
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  
  // No Results
  noResults: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 48,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#2F2D2C",
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#8D8D8D",
    textAlign: "center" as const,
    paddingHorizontal: 40,
  },
});