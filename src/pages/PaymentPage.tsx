
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle2, ArrowLeft, LockKeyhole, Shield, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

const PaymentPage = () => {
  const { isAuthenticated } = useAuth();
  const { cartItems, getCartTotal } = useCart();
  const navigate = useNavigate();
  
  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const cartTotal = getCartTotal();
  const subtotal = cartTotal;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Set page title
  useEffect(() => {
    document.title = "Payment | CinemaVault";
  }, []);

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to continue checkout");
      navigate("/login", { state: { redirectTo: "/payment" } });
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/");
    }
  }, [isAuthenticated, cartItems, navigate]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces every 4 digits
    const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const formattedValue = value.replace(/\B(?=(\d{4})+(?!\d))/g, ' ');
    setCardNumber(formattedValue);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format expiry date as MM/YY
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;
    
    if (value.length > 2) {
      formattedValue = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    setExpiryDate(formattedValue);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers, max 4 chars
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(value);
  };

  const handleCompletePayment = () => {
    // Basic validation
    if (!cardNumber.trim() || cardNumber.replace(/\s+/g, '').length < 16) {
      toast.error("Please enter a valid card number");
      return;
    }
    
    if (!cardName.trim()) {
      toast.error("Please enter the name on card");
      return;
    }
    
    if (!expiryDate.trim() || expiryDate.length < 5) {
      toast.error("Please enter a valid expiry date (MM/YY)");
      return;
    }
    
    if (!cvv.trim() || cvv.length < 3) {
      toast.error("Please enter a valid security code");
      return;
    }
    
    // Process payment (simulated)
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/confirmation");
    }, 2000);
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
        onClick={() => navigate('/checkout')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Billing Details
      </Button>
      
      <h1 className="text-3xl font-bold mb-2">Payment</h1>
      <p className="text-muted-foreground mb-8">Complete your purchase securely</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Select a payment method and enter your details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method Selection */}
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={setPaymentMethod}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="credit-card"
                    id="credit-card"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="credit-card"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <CreditCard className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium">Credit Card</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="paypal"
                    id="paypal"
                    className="peer sr-only"
                    disabled
                  />
                  <Label
                    htmlFor="paypal"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary opacity-50 cursor-not-allowed"
                  >
                    <svg className="mb-3 h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.5 6C20.8807 6 22 7.11929 22 8.5C22 11.5 20 12 19.5 12C19 12 12.5 12 12.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12.5 8.5C12.5 5.5 13.6193 4 15 4C19 4 19 8.5 19 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17.5 14C18.8807 14 20 15.1193 20 16.5C20 19.5 18 20 17.5 20C17 20 10.5 20 10.5 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.5 16.5C10.5 13.5 11.6193 12 13 12C17 12 17 16.5 17 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm font-medium">PayPal</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="apple-pay"
                    id="apple-pay"
                    className="peer sr-only"
                    disabled
                  />
                  <Label
                    htmlFor="apple-pay"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary opacity-50 cursor-not-allowed"
                  >
                    <svg className="mb-3 h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.7602 6.31997C16.5402 5.37997 17.0002 4.13997 16.8402 2.87997C15.7202 2.97997 14.3602 3.65997 13.5402 4.62997C12.7902 5.52997 12.2202 6.77997 12.4102 7.99997C13.6502 8.04997 14.9502 7.27997 15.7602 6.31997Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.59 9.07997C15.96 9.07997 15.37 9.22 14.86 9.46C14.31 9.72 13.8 10.1 13.43 10.58C13.01 11.11 12.75 11.78 12.75 12.5C12.75 13.06 12.9 13.6 13.17 14.06C13.42 14.5 13.8 14.88 14.26 15.16C15.14 15.7 16.29 15.9 17.35 15.5C17.88 15.3 18.34 14.96 18.69 14.53C19.4 13.61 19.69 12.3 19.31 11.14C18.92 9.93997 17.84 9.07997 16.59 9.07997Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12.19 15.02C11.53 15.67 10.68 16 9.79001 16C8.60001 16 7.58001 15.39 7.00001 14.47C6.68001 13.98 6.50001 13.4 6.50001 12.79C6.50001 12.2 6.67001 11.65 6.97001 11.18C7.27001 10.71 7.70001 10.33 8.22001 10.08C8.70001 9.83996 9.23001 9.70996 9.79001 9.70996C10.73 9.70996 11.55 10.02 12.17 10.64" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12.9698 20.21C12.6398 21.17 11.9598 21.93 11.1898 21.98C10.7798 22 10.3598 21.87 9.9998 21.6C9.6098 21.31 9.29981 20.92 9.19981 20.41C8.49981 20.93 7.89981 21 7.45981 21C7.0598 21 6.7098 20.88 6.4198 20.66C4.9998 19.65 4.7698 16.16 6.1798 12.19C6.5598 11.13 7.03981 10.2 7.57981 9.47C10.9598 5.07 15.9998 4.71 17.3498 5.71C17.9998 6.2 18.2198 7.41 17.7598 9.06L17.6398 9.49C16.7598 12.48 15.6898 15.42 14.4398 18.28L14.0498 19.28C13.9098 19.75 13.6798 20.19 12.9698 20.21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm font-medium">Apple Pay</span>
                  </Label>
                </div>
              </RadioGroup>
              
              {paymentMethod === "credit-card" && (
                <div className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <div className="relative">
                      <Input 
                        id="card-number" 
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                        className="pl-10"
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="card-name">Name on Card</Label>
                    <div className="relative">
                      <Input 
                        id="card-name" 
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry-date">Expiry Date</Label>
                      <div className="relative">
                        <Input 
                          id="expiry-date" 
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={handleExpiryDateChange}
                          maxLength={5}
                          className="pl-10"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="cvv">Security Code</Label>
                      <div className="relative">
                        <Input 
                          id="cvv" 
                          placeholder="CVV"
                          value={cvv}
                          onChange={handleCvvChange}
                          maxLength={4}
                          className="pl-10"
                        />
                        <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground p-2 border rounded-md bg-secondary/30">
                <LockKeyhole className="h-4 w-4" />
                <span>Your payment information is secured with encryption</span>
              </div>
              
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate('/checkout')}
              >
                Back
              </Button>
              <Button 
                onClick={handleCompletePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  <>Complete Purchase</>
                )}
              </Button>
            </CardFooter>
          </Card>
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
              
              <div className="flex items-center justify-center space-x-2 text-sm text-green-700 p-3 border rounded-md bg-green-50">
                <Shield className="h-4 w-4" />
                <span>Your purchase is protected by our secure checkout</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
