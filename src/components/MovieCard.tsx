
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Play, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Movie } from "@/context/MovieContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  featured?: boolean;
}

const MovieCard = ({ movie, featured = false }: MovieCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { hasUserPurchased, isAuthenticated } = useAuth();
  
  const isPurchased = hasUserPurchased(movie.id);
  const inCart = isInCart(movie.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPurchased) {
      toast.info("You already own this movie");
      return;
    }
    
    if (inCart) {
      toast.info("Movie already in cart");
      return;
    }
    
    addToCart(movie);
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(movie.price);

  return (
    <Link to={`/movie/${movie.id}`}>
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-300 hover-lift border border-border/40 bg-card",
          featured ? "lg:flex lg:h-[280px]" : "h-full"
        )}
      >
        <div className={cn(
          "relative overflow-hidden",
          featured ? "lg:w-[40%] h-[200px] lg:h-full" : "aspect-[2/3]"
        )}>
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <img
            src={movie.poster_path}
            alt={movie.title}
            className={cn(
              "object-cover w-full h-full img-transition",
              !imageLoaded && "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-sm text-xs">
              <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
              {movie.vote_average.toFixed(1)}
            </Badge>
            {isPurchased && (
              <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                <Check className="h-3 w-3 mr-1" />
                Owned
              </Badge>
            )}
          </div>
          
          <Button
            variant="default"
            size="icon"
            className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-black/80 hover:bg-primary backdrop-blur-sm text-white shadow-md"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
        
        <CardContent className={cn(
          "flex flex-col p-4",
          featured ? "lg:w-[60%] justify-between" : "h-[calc(100%-40%)]"
        )}>
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-1">{movie.title}</h3>
            
            <div className="text-xs text-muted-foreground mb-2">
              {new Date(movie.release_date).getFullYear()} • {movie.genres.join(', ')}
            </div>
            
            <p className={cn(
              "text-sm text-muted-foreground mb-4",
              featured ? "line-clamp-3" : "line-clamp-2"
            )}>
              {movie.overview}
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="font-semibold">{formattedPrice}</span>
            
            <Button
              variant={inCart || isPurchased ? "secondary" : "default"}
              size="sm"
              className={cn(
                "btn-hover",
                (isPurchased || inCart) && "opacity-80"
              )}
              onClick={handleAddToCart}
              disabled={isPurchased}
            >
              {isPurchased ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Owned
                </>
              ) : inCart ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  In Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MovieCard;
