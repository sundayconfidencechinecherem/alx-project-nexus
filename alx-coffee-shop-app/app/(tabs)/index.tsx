import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "expo-router";
import { useNotifications } from "@/contexts/NotificationsContext";




// Coffee categories
const categories = [
  {
    id: "1",
    name: "Cappuccino",
    icon: require("@/assets/images/icons/americano.png"),
  },
  {
    id: "2",
    name: "Espresso",
    icon: require("@/assets/images/icons/espresso.png"),
  },
  {
    id: "3",
    name: "Latte",
    icon: require("@/assets/images/icons/latte.png"),
  },
  {
    id: "4",
    name: "Mocha",
    icon: require("@/assets/images/icons/mocha.png"),
  },
  {
    id: "5",
    name: "Americano",
    icon: require("@/assets/images/icons/americano.png"),
  },
  {
    id: "6",
    name: "Flat White",
    icon: require("@/assets/images/icons/flat_white.png"),
  },
];

// Coffee items data with images
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

export default function HomeScreen() {
  const { addToCart, totalItems } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllCoffees, setShowAllCoffees] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { unreadCount } = useNotifications();

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<NodeJS.Timeout | null>(null);
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setShowAllCoffees(false);
  };

  // Toast notification system
  const showNotification = (message: string) => {

    // Clear timer
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

  const navigateToShop = () => {
    router.push("/shop");
  };

  const navigateToNotifications = () => {
    router.push("/notifications");
  };

  const filteredCoffees = coffees.filter((coffee) => {
    const matchesSearch =
      searchQuery === "" ||
      coffee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coffee.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || coffee.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const coffeesToShow =
    searchQuery !== "" || showAllCoffees
      ? filteredCoffees
      : filteredCoffees.slice(0, 4);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        
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

        {/* Header with Cart and Notifications */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning!</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color="#C67C4E" />
              <Text style={styles.locationText}>Ebonyi, Nigeria</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            {/* Cart Icon in Header */}
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={navigateToCart}
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
              {/* Notifications Icon with badge */}
            <TouchableOpacity onPress={navigateToNotifications}>
              <View style={styles.headerIconContainer}>
                <Ionicons name="notifications-outline" size={24} color="#2F2D2C" />
                {unreadCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#8D8D8D" />
            <TextInput
              placeholder="Find your coffee..."
              placeholderTextColor="#8D8D8D"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch} 
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#8D8D8D" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Promo Banner */}
        <TouchableOpacity 
          style={styles.promoBanner}
          onPress={() => router.push("/shop")}
        >
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Buy one get one free!</Text>
            <Text style={styles.promoSubtitle}>Valid until January 31, 2026</Text>
            <View style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Order Now</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={styles.arrowIcon} />
            </View>
          </View>
          <Image
            source={require("@/assets/images/coffee2.png")}
            style={styles.promoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoriesScroll}
          >
            {/* All Category */}
            <TouchableOpacity
              style={[styles.categoryItem, selectedCategory === "All" && styles.categoryItemActive]}
              onPress={() => setSelectedCategory("All")}
            >
              <View
                style={[
                  styles.categoryIcon,
                  selectedCategory === "All" && styles.categoryIconActive,
                ]}
              >
                <Ionicons name="cafe" size={24} color={selectedCategory === "All" ? "#C67C4E" : "#666"} />
              </View>
              <Text
                style={[
                  styles.categoryName,
                  selectedCategory === "All" && styles.categoryNameActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            {/* Other categories */}
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.name && styles.categoryItemActive,
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    selectedCategory === category.name && styles.categoryIconActive,
                  ]}
                >
                  <Image
                    source={category.icon}
                    style={{ width: 28, height: 28 }}
                    resizeMode="contain"
                  />
                </View>
                <Text
                  style={[
                    styles.categoryName,
                    selectedCategory === category.name && styles.categoryNameActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Coffees */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Now</Text>
            {filteredCoffees.length > 4 && !showAllCoffees && searchQuery === "" && (
              <TouchableOpacity onPress={() => setShowAllCoffees(true)}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            )}
          </View>

          {coffeesToShow.length > 0 ? (
            coffeesToShow.map((coffee) => (
              <TouchableOpacity
                key={coffee.id}
                style={styles.coffeeCard}
                onPress={() => navigateToCoffeeDetails(coffee)}
              >
                <Image source={coffee.image} style={styles.coffeeImage} resizeMode="cover" />
                <View style={styles.coffeeDetails}>
                  <Text style={styles.coffeeName}>{coffee.name}</Text>
                  <View style={styles.coffeeFooter}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.dollarSign}>$</Text>
                      <Text style={styles.coffeePrice}>{coffee.price.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAddToCart(coffee);
                      }}
                    >
                      <FontAwesome name="plus" size={14} color="#FFFFFF" />
                      <Text style={styles.addButtonText}> Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResults}>
              <Ionicons name="search-outline" size={48} color="#E0E0E0" />
              <Text style={styles.noResultsText}>No coffees found</Text>
              <Text style={styles.noResultsSubtext}>
                Try a different search or category
              </Text>
            </View>
          )}

          {/* Go to Shop Button */}
          {!showAllCoffees && searchQuery === "" && filteredCoffees.length > 4 && (
            <TouchableOpacity style={styles.goToShopButton} onPress={navigateToShop}>
              <Text style={styles.goToShopText}>Go to Shop</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer Card */}
        <View style={styles.footerCard}>
          <Text style={styles.footerText}>We are still brewing the best coffees for you</Text>
          <Text style={styles.footerSubText}>Located in your city, delivering freshness daily</Text>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 20,
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
  
  // Header styles
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 14,
    color: "#8D8D8D",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: "#2F2D2C",
    marginLeft: 6,
  },
  headerActions: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 16,
  },
  headerButton: {
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
  
  // Promo Banner
  promoBanner: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: "rgba(198, 124, 78, 0.1)",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    overflow: "hidden" as const,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: "bold" as const,
    color: "#2F2D2C",
    lineHeight: 28,
  },
  promoSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 8,
    marginBottom: 16,
  },
  promoButton: {
    backgroundColor: "#C67C4E",
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: "flex-start" as const,
  },
  promoButtonText: {
    color: "#FFFFFF",
    fontWeight: "600" as const,
    fontSize: 14,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  promoImage: {
    width: 100,
    height: 100,
    marginLeft: 16,
  },
  
  // Sections
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#2F2D2C",
  },
  seeAllText: {
    fontSize: 14,
    color: "#C67C4E",
    fontWeight: "600" as const,
  },
  
  // Categories
  categoriesScroll: {
    flexDirection: "row" as const,
    marginTop: 8,
  },
  categoryItem: {
    alignItems: "center" as const,
    marginRight: 16,
  },
  categoryItemActive: {
    opacity: 1,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F8F9FA",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoryIconActive: {
    backgroundColor: "rgba(198, 124, 78, 0.1)",
    borderColor: "#C67C4E",
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: "#666666",
    marginTop: 8,
    textAlign: "center" as const,
  },
  categoryNameActive: {
    color: "#C67C4E",
    fontWeight: "600" as const,
  },
  
  // Coffee Cards
  coffeeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F3F5",
  },
  coffeeImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  coffeeDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between" as const,
  },
  coffeeName: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#2F2D2C",
    marginBottom: 4,
  },
  coffeeFooter: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 8,
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
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#2F2D2C",
    marginLeft: 2,
  },
  addButton: {
    backgroundColor: "#C67C4E",
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: "flex-start" as const,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600" as const,
    fontSize: 14,
    marginLeft: 4,
  },
  
  // No Results
  noResults: {
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
  },
  
  // Bottom Spacing
  bottomSpacing: {
    height: 32,
  },
  
  // Go to Shop Button
  goToShopButton: {
    marginTop: 16,
    backgroundColor: '#C67C4E',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goToShopText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  
  // Footer Card
  footerCard: {
    backgroundColor: '#FFF3E0',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 24,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#C67C4E',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubText: {
    fontSize: 12,
    color: '#8D6E63',
    textAlign: 'center',
  },
  notificationBadge: {
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
  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold" as const,
  },

});