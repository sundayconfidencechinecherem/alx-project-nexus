import { Stack } from "expo-router";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { OrdersProvider } from "@/contexts/OrdersContext";
import { StatusBar } from "expo-status-bar";
import { NotificationsProvider } from "@/contexts/NotificationsContext";

export default function RootLayout() {
  return (
    <OrdersProvider>
      <CartProvider>
        <FavoritesProvider>
         <NotificationsProvider>

          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            {/* Get Started screen */}
            <Stack.Screen name="index" />
            {/* Tabs navigation */}
            <Stack.Screen name="(tabs)" />
          </Stack>
        
         </NotificationsProvider>
        </FavoritesProvider>
      </CartProvider>
    </OrdersProvider>
  

  );
}