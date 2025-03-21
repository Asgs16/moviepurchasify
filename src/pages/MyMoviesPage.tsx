
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Film, Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useMovies } from "@/context/MovieContext";
import { toast } from "sonner";

const MyMoviesPage = () => {
  const { isAuthenticated, purchasedMovies } = useAuth();
  const { getMovie } = useMovies();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Get purchased movie objects from IDs
  const myMovies = purchasedMovies
    .map(purchase => getMovie(purchase.id))
    .filter(movie => movie !== undefined);
  
  // Filter movies based on search and genre filter
  const filteredMovies = myMovies.filter(movie => {
    const matchesSearch = movie?.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = activeFilter === "all" || movie?.genres.some(genre => 
      genre.toLowerCase() === activeFilter.toLowerCase()
    );
    return matchesSearch && matchesGenre;
  });
  
  // Get unique genres from purchased movies
  const allGenres = [...new Set(myMovies.flatMap(movie => movie?.genres || []))];

  // Set page title
  useEffect(() => {
    document.title = "My Movies | CinemaVault";
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view your movies");
      navigate("/login", { state: { redirectTo: "/my-movies" } });
    }
  }, [isAuthenticated, navigate]);

  const handlePlay = (movieId: number, movieTitle: string) => {
    toast.success(`Now playing: ${movieTitle}`, {
      description: "This is a demo. In a real app, your movie would start playing now."
    });
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Format purchase date
  const formatPurchaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Movies</h1>
          <p className="text-muted-foreground">
            Your purchased movies library
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your movies..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Genre Filters */}
      <div className="mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <div className="inline-flex gap-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("all")}
            className="rounded-full"
          >
            All
          </Button>
          
          {allGenres.map((genre) => (
            <Button
              key={genre}
              variant={activeFilter === genre ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange(genre)}
              className="rounded-full"
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>
      
      {filteredMovies.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent className="space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Film className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-medium mb-2">No movies found</h3>
              {myMovies.length === 0 ? (
                <>
                  <p className="text-muted-foreground mb-6">You haven't purchased any movies yet.</p>
                  <Button asChild>
                    <Link to="/">Browse Movies</Link>
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => {
            const purchaseInfo = purchasedMovies.find(p => p.id === movie?.id);
            
            return (
              <div key={movie?.id} className="group">
                <Card className="h-full overflow-hidden hover-lift">
                  {/* Movie Image */}
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img 
                      src={movie?.poster_path} 
                      alt={movie?.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button
                        variant="default"
                        size="icon"
                        className="rounded-full h-12 w-12 bg-white text-black hover:bg-white/90"
                        onClick={() => handlePlay(movie!.id, movie!.title)}
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Movie Info */}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-base mb-1 truncate">{movie?.title}</h3>
                    <div className="text-xs text-muted-foreground mb-4">
                      <span>Purchased: {formatPurchaseDate(purchaseInfo?.purchaseDate || '')}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link to={`/movie/${movie?.id}`}>
                          <Info className="h-3.5 w-3.5 mr-1" />
                          Details
                        </Link>
                      </Button>
                      
                      <Button 
                        variant="default"
                        size="sm"
                        onClick={() => handlePlay(movie!.id, movie!.title)}
                      >
                        <Play className="h-3.5 w-3.5 mr-1" />
                        Play
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyMoviesPage;
