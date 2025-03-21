
import { useEffect } from "react";
import Hero from "@/components/Hero";
import MovieSlider from "@/components/MovieSlider";
import { useMovies } from "@/context/MovieContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const { featuredMovies, newReleases, movies, loading } = useMovies();

  // Set page title
  useEffect(() => {
    document.title = "MovieCart | Premium Movie Shopping";
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20 bg-gradient-to-b from-background to-background/95"> {/* Dark gradient background */}
      {/* Hero Section */}
      {featuredMovies.length > 0 && <Hero movie={featuredMovies[0]} />}
      
      {/* Content Section */}
      <section className="container mx-auto px-4 md:px-6 py-12 space-y-16">
        {/* Featured Movies */}
        <div className="animate-on-scroll">
          <MovieSlider 
            title="Featured Movies" 
            movies={featuredMovies} 
            featured
          />
        </div>
        
        {/* New Releases */}
        <div className="animate-on-scroll">
          <MovieSlider 
            title="New Releases" 
            movies={newReleases}
          />
        </div>
        
        {/* All Movies */}
        <div className="animate-on-scroll">
          <h2 className="text-2xl font-semibold mb-6 text-gradient">All Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movies.map((movie) => (
              <Link 
                key={movie.id} 
                to={`/movie/${movie.id}`}
                className="movie-card overflow-hidden rounded-lg border border-border/40 bg-card transform transition-all duration-300"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img 
                    src={movie.poster_path} 
                    alt={movie.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <h3 className="text-sm sm:text-base font-medium line-clamp-1">{movie.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-white/80">{new Date(movie.release_date).getFullYear()}</span>
                      <span className="text-xs font-semibold bg-primary/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        ${movie.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" className="bg-muted/30 border-primary/20 hover:bg-primary/20">
              View All Movies
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
