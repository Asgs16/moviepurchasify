
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
}

interface PurchasedMovie {
  id: number;
  purchaseDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  purchasedMovies: PurchasedMovie[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addPurchasedMovie: (movieId: number) => void;
  hasUserPurchased: (movieId: number) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  purchasedMovies: [],
  login: async () => false,
  register: async () => false,
  logout: () => {},
  addPurchasedMovie: () => {},
  hasUserPurchased: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [purchasedMovies, setPurchasedMovies] = useState<PurchasedMovie[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedPurchases = localStorage.getItem('purchasedMovies');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
      }
    }

    if (savedPurchases) {
      try {
        setPurchasedMovies(JSON.parse(savedPurchases));
      } catch (error) {
        console.error('Failed to parse purchased movies from localStorage:', error);
      }
    }
  }, []);

  // Save user and purchases to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (purchasedMovies.length > 0) {
      localStorage.setItem('purchasedMovies', JSON.stringify(purchasedMovies));
    }
  }, [purchasedMovies]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // This is a mock authentication
      // In a real app, you would make an API request to authenticate
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (email === "user@example.com" && password === "password") {
        setUser({
          id: "1",
          email: "user@example.com",
          name: "Demo User"
        });
        setIsAuthenticated(true);
        toast.success('Logged in successfully');
        return true;
      }
      
      // For demo purposes, allow any login
      if (email && password) {
        setUser({
          id: Math.random().toString(36).substring(2, 9),
          email,
          name: email.split('@')[0]
        });
        setIsAuthenticated(true);
        toast.success('Logged in successfully');
        return true;
      }

      toast.error('Invalid email or password');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // This is a mock registration
      // In a real app, you would make an API request to create a user
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (!email || !password || !name) {
        toast.error('All fields are required');
        return false;
      }

      setUser({
        id: Math.random().toString(36).substring(2, 9),
        email,
        name
      });
      setIsAuthenticated(true);
      toast.success('Registered and logged in successfully');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Note: We don't clear purchased movies to persist them across sessions
    toast.success('Logged out successfully');
  };

  const addPurchasedMovie = (movieId: number) => {
    setPurchasedMovies(prev => {
      // Check if already purchased
      if (prev.some(movie => movie.id === movieId)) {
        return prev;
      }
      
      // Add to purchased movies
      return [...prev, {
        id: movieId,
        purchaseDate: new Date().toISOString()
      }];
    });
  };

  const hasUserPurchased = (movieId: number) => {
    return purchasedMovies.some(movie => movie.id === movieId);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      purchasedMovies,
      login,
      register,
      logout,
      addPurchasedMovie,
      hasUserPurchased
    }}>
      {children}
    </AuthContext.Provider>
  );
};
