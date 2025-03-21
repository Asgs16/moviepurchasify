
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Clock, Calendar, ShoppingCart, Play, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMovies } from "@/context/MovieContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import MovieSlider from "@/components/MovieSlider";
import { toast } from "sonner";

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMovie, movies, loading } = useMovies();
  const { addToCart, isInCart } = useCart();
  const { hasUserPurchased, isAuthenticated } = useAuth();
  const [trailerOpen, setTrailerOpen] = useState(false);
  
  const movie = id ? getMovie(parseInt(id)) : undefined;
  const inCart = movie ? isInCart(movie.id) : false;
  const isPurchased = movie ? hasUserPurchased(movie.id) : false;
  
  // Set page title
  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} | CinemaVault`;
    } else {
      document.title = "Movie Details | CinemaVault";
    }
  }, [movie]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddToCart = () => {
    if (!movie) return;
    
    if (isPurchased) {
      toast.info("You already own this movie");
      return;
    }
    
    addToCart(movie);
  };

  const handleBuyNow = () => {
    if (!movie) return;
    
    if (isPurchased) {
      toast.info("You already own this movie");
      return;
    }
    
    addToCart(movie);
    navigate('/cart');
  };

  const handleWatchTrailer = () => {
    setTrailerOpen(true);
  };

  const handleCloseTrailer = () => {
    setTrailerOpen(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4">Movie Not Found</h1>
        <p className="text-muted-foreground mb-6">Sorry, we couldn't find the movie you're looking for.</p>
        <Button onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  const releaseYear = new Date(movie.release_date).getFullYear();
  const formattedRuntime = `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(movie.price);

  return (
    <div className="pt-16 md:pt-20"> {/* Padding for fixed header */}
      {/* Back button */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        <Button variant="ghost" onClick={handleBack} className="group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </Button>
      </div>
      
      {/* Movie Hero */}
      <div 
        className="relative w-full bg-cover bg-center py-20 md:py-24"
        style={{ backgroundImage: `url(${movie.backdrop_path})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="md:flex gap-8">
            {/* Poster */}
            <div className="md:w-1/3 lg:w-1/4 mb-8 md:mb-0">
              <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-xl bg-card/20 backdrop-blur-md border border-white/10">
                <img 
                  src={movie.poster_path} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Details */}
            <div className="md:w-2/3 lg:w-3/4 text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-yellow-500/90 text-black">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {movie.vote_average.toFixed(1)}
                </Badge>
                
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{formattedRuntime}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{releaseYear}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <p className="text-base lg:text-lg mb-6 text-gray-300 max-w-2xl">
                {movie.overview}
              </p>
              
              <div className="mb-6">
                <div className="text-sm text-gray-400">Director</div>
                <div className="font-medium">{movie.director}</div>
              </div>
              
              <div className="mb-8">
                <div className="text-sm text-gray-400">Starring</div>
                <div className="font-medium">{movie.starring.join(', ')}</div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-2xl font-bold">{formattedPrice}</div>
                
                {isPurchased ? (
                  <Button variant="outline" className="bg-green-600/20 text-white border-green-600/50 hover:bg-green-600/30">
                    <Check className="h-4 w-4 mr-2" />
                    Owned
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="default" 
                      className="bg-white text-black hover:bg-white/90"
                      onClick={handleBuyNow}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                    
                    <Button 
                      variant={inCart ? "secondary" : "outline"}
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={handleAddToCart}
                    >
                      {inCart ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          In Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </>
                )}
                
                {movie.trailer_key && (
                  <Button 
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={handleWatchTrailer}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Watch Trailer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar Movies */}
      <section className="container mx-auto px-4 md:px-6 py-12">
        <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>
        <MovieSlider 
          title="" 
          movies={movies.filter(m => m.id !== movie.id).slice(0, 5)}
        />
      </section>
      
      {/* Trailer Modal */}
      {trailerOpen && movie.trailer_key && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-5xl bg-black rounded-lg overflow-hidden shadow-2xl">
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-2 right-2 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full"
              onClick={handleCloseTrailer}
            >
              <Check className="h-5 w-5" />
            </Button>
            
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${movie.trailer_key}?autoplay=1`}
                title={`${movie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
