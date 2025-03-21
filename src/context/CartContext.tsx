
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { Movie } from './MovieContext';

interface CartItem {
  movie: Movie;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (movie: Movie, quantity?: number) => void;
  removeFromCart: (movieId: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isInCart: (movieId: number) => boolean;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getCartItemCount: () => 0,
  isInCart: () => false,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (movie: Movie, quantity = 1) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.movie.id === movie.id);
      
      if (existingItemIndex >= 0) {
        // If already in cart, update the quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
        
        toast.success(`Updated quantity for "${movie.title}" in cart`);
        return newItems;
      } else {
        // If not in cart, add it
        toast.success(`Added "${movie.title}" to cart`);
        return [...prevItems, { movie, quantity }];
      }
    });
  };

  const removeFromCart = (movieId: number) => {
    setCartItems(prevItems => {
      const movieToRemove = prevItems.find(item => item.movie.id === movieId);
      if (movieToRemove) {
        toast.success(`Removed "${movieToRemove.movie.title}" from cart`);
      }
      return prevItems.filter(item => item.movie.id !== movieId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.movie.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (movieId: number) => {
    return cartItems.some(item => item.movie.id === movieId);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartItemCount,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
