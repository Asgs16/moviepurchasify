
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash, ShoppingCart, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Card, 
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const CartPage = () => {
  const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const cartTotal = getCartTotal();
  const subtotal = cartTotal;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Set page title
  useEffect(() => {
    document.title = "Your Cart | CinemaVault";
  }, []);

  const handleRemoveItem = (movieId: number, movieTitle: string) => {
    removeFromCart(movieId);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue to checkout", {
        description: "You need to be logged in to complete your purchase."
      });
      navigate("/login", { state: { redirectTo: "/checkout" } });
      return;
    }
    
    navigate("/checkout");
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 mt-8">
      <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
      <p className="text-muted-foreground mb-8">Review your items before checkout</p>
      
      {cartItems.length === 0 ? (
        <Card className="text-center py-16 bg-card">
          <CardContent className="space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">Looks like you haven't added any movies to your cart yet.</p>
              <Button asChild>
                <Link to="/">Browse Movies</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Movie</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.movie.id}>
                        <TableCell>
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-24 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={item.movie.poster_path} 
                                alt={item.movie.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <Link 
                                to={`/movie/${item.movie.id}`}
                                className="font-medium hover:underline"
                              >
                                {item.movie.title}
                              </Link>
                              <div className="text-sm text-muted-foreground">
                                {new Date(item.movie.release_date).getFullYear()}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.movie.price)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.movie.id, item.movie.title)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="py-4 px-6 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                >
                  <Link to="/">Continue Shopping</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  
                  {!isAuthenticated && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800 flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">You need to be logged in to complete your purchase.</p>
                        <Link to="/login" className="underline">Login or create an account</Link>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  className="w-full"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
