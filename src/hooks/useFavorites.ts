import { useState, useCallback } from 'react';
import { Product } from '@/lib/appwrite';

const STORAGE_KEY = 'yaga_favorites';

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

export function useFavorites() {
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

  return { favorites, toggleFavorite, isFavorite, removeFavorite };
}
