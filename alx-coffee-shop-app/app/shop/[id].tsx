import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

const { width: screenWidth } = Dimensions.get('window');

const coffeeSizes = [
  { id: 'small', name: 'S', price: 0 },
  { id: 'medium', name: 'M', price: 0.5 },
  { id: 'large', name: 'L', price: 1 },
];

// Coffee images for different coffee types
const coffeeImages: { [key: string]: any } = {
  '1': require('@/assets/images/coffee1.png'),
  '2': require('@/assets/images/coffee2.png'),
  '3': require('@/assets/images/coffee3.png'),
  '4': require('@/assets/images/coffee4.png'),
  '5': require('@/assets/images/coffee5.png'),
  '6': require('@/assets/images/coffee6.png'),
  '7': require('@/assets/images/coffee7.png'),
  '8': require('@/assets/images/coffee1.png'), 
};

export default function CoffeeDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [selectedSize, setSelectedSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  const coffee = {
    id: params.id as string,
    name: params.name as string,
    description: params.description as string,
    price: parseFloat(params.price as string),
    rating: parseFloat(params.rating as string),
    image: coffeeImages[params.id as string] || require('@/assets/images/coffee1.png'),
  };

  const sizePrice = coffeeSizes.find(s => s.id === selectedSize)?.price || 0;
  const totalPrice = (coffee.price + sizePrice) * quantity;

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

  const handleAddToCart = () => {
    const coffeeWithSize = {
      ...coffee,
      size: selectedSize,
    };
    
    for (let i = 0; i < quantity; i++) {
      addToCart(coffeeWithSize, selectedSize);
    }
    
    showNotification(`${quantity} ${coffee.name}${quantity > 1 ? 's' : ''} added  to cart`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      router.push('/cart');
    }, 500);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(coffee);
    showNotification(
      isFavorite(coffee.id) 
        ? `${coffee.name} from favorites` 
        : `${coffee.name} to favorites`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        
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

       
        <View style={styles.imageContainer}>
          <Image 
            source={coffee.image} 
            style={styles.coffeeImage} 
            resizeMode="cover"
          />
          <View />
          
          {/* Header Overlay */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <View style={styles.iconButton}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
              activeOpacity={0.7}
            >
              <View style={styles.iconButton}>
                <Ionicons 
                  name={isFavorite(coffee.id) ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isFavorite(coffee.id) ? "#C67C4E" : "#FFFFFF"} 
                />
              </View>
            </TouchableOpacity>
          </View>
          
        
        </View>

        {/* Coffee Info */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.coffeeName}>{coffee.name}</Text>
            <View style={styles.priceTag}>
              <Text style={styles.dollarSign}>$</Text>
              <Text style={styles.coffeePrice}>{coffee.price.toFixed(2)}</Text>
            </View>

          </View>
          
          <Text style={styles.coffeeDescription}>{coffee.description}</Text>
            
         
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingValue}>{coffee.rating.toFixed(1)}</Text>
              <Text style={styles.ratingText}>/5</Text>
            
          </View>
          

          {/* Size Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Size</Text>
            <View style={styles.sizeContainer}>
              {coffeeSizes.map((size) => (
                <TouchableOpacity
                  key={size.id}
                  style={[
                    styles.sizeButton,
                    selectedSize === size.id && styles.sizeButtonActive,
                  ]}
                  onPress={() => setSelectedSize(size.id)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === size.id && styles.sizeTextActive,
                    ]}
                  >
                    {size.name}
                  </Text>
                  {size.price > 0 && (
                    <Text style={styles.sizePrice}>+${size.price.toFixed(2)}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity === 1}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={24} color={quantity === 1 ? "#CCC" : "#2F2D2C"} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={24} color="#2F2D2C" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Price Summary */}
          <View style={styles.priceSummary}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.priceValue}>${coffee.price.toFixed(2)}</Text>
            </View>
            {sizePrice > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Size ({selectedSize.toUpperCase()})</Text>
                <Text style={styles.priceValue}>+${sizePrice.toFixed(2)}</Text>
              </View>
            )}
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            </View>
            
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.addToCartButton]}
              onPress={handleAddToCart}
              activeOpacity={0.8}
            >
              <Ionicons name="cart" size={20} color="#C67C4E" />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.buyNowButton]}
              onPress={handleBuyNow}
              activeOpacity={0.8}
            >
              <Text style={styles.buyNowText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
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
  
 
  imageContainer: {
    width: screenWidth,
    height: screenWidth * 0.8, 
    position: 'relative',
  },
  coffeeImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  
  // Header Overlay
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    zIndex: 10,
  },
  backButton: {
    padding: 4,
  },
  favoriteButton: {
    padding: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Rating Overlay
  ratingOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingBottom: 12,
  },
  ratingValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2F2D2C',
    marginLeft: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#8D8D8D',
    marginLeft: 4,
  },
  
  // Content
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  coffeeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F2D2C',
    flex: 1,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(198, 124, 78, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dollarSign: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C67C4E',
  },
  coffeePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F2D2C',
    marginLeft: 2,
  },
  coffeeDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2F2D2C',
    marginBottom: 16,
  },
  sizeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sizeButtonActive: {
    backgroundColor: 'rgba(198, 124, 78, 0.1)',
    borderColor: '#C67C4E',
  },
  sizeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  sizeTextActive: {
    color: '#C67C4E',
  },
  sizePrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 200,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2F2D2C',
    marginHorizontal: 24,
  },
  priceSummary: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    color: '#2F2D2C',
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2F2D2C',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C67C4E',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButton: {
    backgroundColor: 'rgba(198, 124, 78, 0.1)',
    flexDirection: 'row',
    gap: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C67C4E',
  },
  buyNowButton: {
    backgroundColor: '#C67C4E',
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});