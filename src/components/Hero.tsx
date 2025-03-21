
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, ShoppingCart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Movie } from "@/context/MovieContext";

interface HeroProps {
  movie: Movie;
}

const Hero = ({ movie }: HeroProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { hasUserPurchased } = useAuth();
  
  const isPurchased = hasUserPurchased(movie.id);
  const inCart = isInCart(movie.id);

  useEffect(() => {
    // Add small delay to trigger animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = () => {
    if (!isPurchased) {
      addToCart(movie);
      navigate('/cart');
    }
  };

  const handleMovieDetails = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] bg-black">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${movie.backdrop_path})`,
          opacity: isVisible ? 0.6 : 0
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
      </div>
      
      {/* Content */}
      <div 
        className={`container mx-auto px-4 md:px-6 h-full flex flex-col justify-end sm:justify-center py-16 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-3xl relative">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 text-balance leading-tight">
            {movie.title}
          </h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((genre, index) => (
              <span 
                key={index} 
                className="text-xs bg-primary/10 backdrop-blur-sm px-2 py-1 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
          
          <p className="text-base sm:text-lg mb-6 max-w-2xl text-muted-foreground">
            {movie.overview}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button
              variant="default"
              size="lg"
              className="group"
              onClick={handleAddToCart}
              disabled={isPurchased}
            >
              {isPurchased ? (
                "Watch Now"
              ) : inCart ? (
                "Go to Cart"
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Buy Now
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={handleMovieDetails}
            >
              <Info className="mr-2 h-5 w-5" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
