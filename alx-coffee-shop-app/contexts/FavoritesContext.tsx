// contexts/FavoritesContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Coffee {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image?: any;
  category?: string;
  size?: string;
}

interface FavoritesContextType {
  favorites: Coffee[];
  addFavorite: (coffee: Coffee) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (coffee: Coffee) => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Coffee[]>([]);

  const addFavorite = (coffee: Coffee) => {
    if (!favorites.find((c) => c.id === coffee.id)) {
      setFavorites([...favorites, coffee]);
    }
  };

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter((c) => c.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some((c) => c.id === id);
  };

  const toggleFavorite = (coffee: Coffee) => {
    if (isFavorite(coffee.id)) {
      removeFavorite(coffee.id);
    } else {
      addFavorite(coffee);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ 
        favorites, 
        addFavorite, 
        removeFavorite, 
        isFavorite,
        toggleFavorite 
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
};