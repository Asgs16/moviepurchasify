
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, CreditCard, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const CheckoutPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { cartItems, getCartTotal } = useCart();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  
  const cartTotal = getCartTotal();
  const subtotal = cartTotal;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Set page title
  useEffect(() => {
    document.title = "Checkout | CinemaVault";
    
    // Prefill user data if authenticated
    if (isAuthenticated && user) {
      setEmail(user.email);
      setFullName(user.name);
    }
  }, [isAuthenticated, user]);

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to continue checkout");
      navigate("/login", { state: { redirectTo: "/checkout" } });
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/");
    }
  }, [isAuthenticated, cartItems, navigate]);

  const handleContinueToPayment = () => {
    // Basic validation
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    
    if (!email.trim() || !email.includes('@')) {
      toast.error("Please enter a valid email");
      return;
    }
    
    navigate("/payment");
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
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/cart')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Button>
      
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-muted-foreground mb-8">Complete your purchase securely</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Checkout Form */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account Info</TabsTrigger>
              <TabsTrigger value="billing" disabled>Payment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Enter your details for your digital purchase.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Your purchase receipts will be sent to this email
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea 
                      id="notes"
                      placeholder="Add any special instructions or notes about your order"
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/cart')}
                  >
                    Back to Cart
                  </Button>
                  <Button onClick={handleContinueToPayment}>
                    Continue to Payment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.movie.id} className="flex justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-14 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={item.movie.poster_path} 
                          alt={item.movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-sm truncate max-w-[180px]">
                        {item.movie.title}
                      </span>
                    </div>
                    <span className="text-sm">{formatCurrency(item.movie.price)}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>
                  By completing this purchase, you'll be able to instantly stream your movies from your account.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
