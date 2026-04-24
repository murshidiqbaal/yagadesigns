import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product } from '@/lib/appwrite';

const STORAGE_KEY = 'yaga_favorites';

interface FavoritesContextType {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
  removeFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

function readFromStorage(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeToStorage(items: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage quota exceeded — silent fail
  }
}

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>(readFromStorage);

  const toggleFavorite = useCallback((product: Product) => {
    setFavorites(prev => {
      const exists = prev.findIndex(p => p.$id === product.$id);
      const next = exists >= 0
        ? prev.filter(p => p.$id !== product.$id)
        : [...prev, product];
      writeToStorage(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some(p => p.$id === id),
    [favorites]
  );

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.filter(p => p.$id !== id);
      writeToStorage(next);
      return next;
    });
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
};
