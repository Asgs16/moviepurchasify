
import { useEffect } from "react";
import Hero from "@/components/Hero";
import MovieSlider from "@/components/MovieSlider";
import { useMovies } from "@/context/MovieContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const HomePage = () => {
  const { featuredMovies, newReleases, movies, loading } = useMovies();

  // Set page title
  useEffect(() => {
    document.title = "CinemaVault | Premium Movie Shopping";
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20"> {/* Padding for fixed header */}
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
          <h2 className="text-2xl font-semibold mb-6">All Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="h-full">
                <MovieSlider 
                  title=""
                  movies={[movie]}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
