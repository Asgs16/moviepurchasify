
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, FileText, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useMovies } from "@/context/MovieContext";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ConfirmationPage = () => {
  const { isAuthenticated, addPurchasedMovie } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { getMovie } = useMovies();
  const navigate = useNavigate();
  
  const cartTotal = getCartTotal();
  const subtotal = cartTotal;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  
  const orderNumber = `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Set page title
  useEffect(() => {
    document.title = "Order Confirmation | CinemaVault";
  }, []);

  // Process order and redirect if necessary
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view your order");
      navigate("/login");
      return;
    }
    
    if (cartItems.length === 0) {
      navigate("/");
      return;
    }
    
    // Add purchased movies to user's library
    cartItems.forEach(item => {
      addPurchasedMovie(item.movie.id);
    });
    
    // Clear cart
    clearCart();
    
    // Success message
    toast.success("Purchase complete! Your movies are now available in your library.");
  }, [isAuthenticated, cartItems, navigate, addPurchasedMovie, clearCart]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 mt-8">
      <motion.div 
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div 
          className="text-center mb-12"
          variants={fadeIn}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your movies are now available in your library.
          </p>
        </motion.div>
        
        <motion.div variants={fadeIn}>
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                  <p className="text-sm text-muted-foreground">Order #{orderNumber}</p>
                </div>
                <p className="text-sm text-muted-foreground">{orderDate}</p>
              </div>
              
              <Separator className="mb-6" />
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <motion.div 
                    key={item.movie.id}
                    className="flex justify-between items-center"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={item.movie.poster_path} 
                          alt={item.movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.movie.title}</h3>
                        <p className="text-xs text-muted-foreground">Digital Purchase</p>
                      </div>
                    </div>
                    <span>{formatCurrency(item.movie.price)}</span>
                  </motion.div>
                ))}
              </div>
              
              <Separator className="mb-4" />
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between font-semibold mt-4">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              
              <Separator className="mb-6" />
              
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Payment Method: Credit Card ending in **** 1234</p>
                <p>A receipt has been sent to your email address.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          className="space-y-6 text-center"
          variants={fadeIn}
        >
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild>
              <Link to="/my-movies">
                <Film className="mr-2 h-4 w-4" />
                View My Movies
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link to="/">
                Continue Shopping
              </Link>
            </Button>
          </div>
          
          <p className="text-muted-foreground text-sm">
            For any support inquiries, please contact our customer service team.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ConfirmationPage;
