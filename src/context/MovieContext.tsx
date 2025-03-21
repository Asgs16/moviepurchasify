
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

// Movie types
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  price: number;
  genres: string[];
  runtime: number;
  director: string;
  starring: string[];
  trailer_key?: string;
}

interface MovieContextType {
  movies: Movie[];
  featuredMovies: Movie[];
  newReleases: Movie[];
  getMovie: (id: number) => Movie | undefined;
  loading: boolean;
}

const MovieContext = createContext<MovieContextType>({
  movies: [],
  featuredMovies: [],
  newReleases: [],
  getMovie: () => undefined,
  loading: true,
});

export const useMovies = () => useContext(MovieContext);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading movies from an API
    const fetchMovies = async () => {
      try {
        setLoading(true);
        // This is mock data; in a real app, you would fetch from an API
        const mockMovies: Movie[] = [
          {
            id: 1,
            title: "Dune: Part Two",
            overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
            poster_path: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
            backdrop_path: "https://image.tmdb.org/t/p/original/oUQjm6oEDsb5wVYjuZUH1GnvITC.jpg",
            release_date: "2024-03-01",
            vote_average: 8.4,
            price: 19.99,
            genres: ["Science Fiction", "Adventure"],
            runtime: 166,
            director: "Denis Villeneuve",
            starring: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
            trailer_key: "Way3Dmt3ZxQ"
          },
          {
            id: 2,
            title: "The Batman",
            overview: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
            poster_path: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
            backdrop_path: "https://image.tmdb.org/t/p/original/5P8SmMzSNYikXpxil6BYzJ16611.jpg",
            release_date: "2022-03-01",
            vote_average: 7.8,
            price: 14.99,
            genres: ["Crime", "Mystery", "Thriller"],
            runtime: 176,
            director: "Matt Reeves",
            starring: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano"],
            trailer_key: "mqqft2x_Aa4"
          },
          {
            id: 3,
            title: "Oppenheimer",
            overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
            poster_path: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
            backdrop_path: "https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
            release_date: "2023-07-19",
            vote_average: 8.2,
            price: 17.99,
            genres: ["Drama", "History", "Thriller"],
            runtime: 180,
            director: "Christopher Nolan",
            starring: ["Cillian Murphy", "Emily Blunt", "Matt Damon"],
            trailer_key: "uYPbbksJxIg"
          },
          {
            id: 4,
            title: "Barbie",
            overview: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
            poster_path: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi8Qzrd8jyeQ4.jpg",
            backdrop_path: "https://image.tmdb.org/t/p/original/nHf61UzkfFno5X1ofIhugCPus2R.jpg",
            release_date: "2023-07-19",
            vote_average: 7.2,
            price: 15.99,
            genres: ["Comedy", "Adventure", "Fantasy"],
            runtime: 114,
            director: "Greta Gerwig",
            starring: ["Margot Robbie", "Ryan Gosling", "America Ferrera"],
            trailer_key: "8zIf0XvoL9Y"
          },
          {
            id: 5,
            title: "Poor Things",
            overview: "The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.",
            poster_path: "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
            backdrop_path: "https://image.tmdb.org/t/p/original/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg",
            release_date: "2023-12-08",
            vote_average: 8.0,
            price: 18.99,
            genres: ["Science Fiction", "Romance", "Comedy"],
            runtime: 141,
            director: "Yorgos Lanthimos",
            starring: ["Emma Stone", "Mark Ruffalo", "Willem Dafoe"],
            trailer_key: "RlbR5N6veqw"
          },
          {
            id: 6,
            title: "Challengers",
            overview: "Follows three players who knew each other when they were teenagers as they compete in a tennis tournament to be the world-famous grand slam winner, and reignite old rivalries on and off the court.",
            poster_path: "https://image.tmdb.org/t/p/w500/jDdnDHWZvGqkxe1KSoJuMnqGYKZ.jpg",
            backdrop_path: "https://image.tmdb.org/t/p/original/lwexJlmR6SMqEYdM7FpJfp5jw51.jpg",
            release_date: "2024-04-26",
            vote_average: 7.5,
            price: 19.99,
            genres: ["Drama", "Romance"],
            runtime: 131,
            director: "Luca Guadagnino",
            starring: ["Zendaya", "Mike Faist", "Josh O'Connor"],
            trailer_key: "Wk8LGk4X_PU"
          },
          {
            id: 7,
            title: "The Fall Guy",
            overview: "Colt Seavers, a battle-scarred stuntman who, having left the business a year earlier to focus on both physical and mental health, is drafted back into service when the star of a mega-budget studio movie—being directed by his ex, Jody Moreno—goes missing.",
            poster_path: "https://image.tmdb.org/t/p/w500/bnVKUv2WiBZgfOvRCvdSfzl5J5o.jpg",
            backdrop_path: "https://image.tmdb.org/t/p/original/4woSOUD0er5lRRxEqZwfYVOCEFV.jpg",
            release_date: "2024-05-03",
            vote_average: 7.1,
            price: 19.99,
            genres: ["Action", "Comedy"],
            runtime: 126,
            director: "David Leitch",
            starring: ["Ryan Gosling", "Emily Blunt", "Winston Duke"],
            trailer_key: "I0Nv-wr_qmo"
          },
          {
            id: 8,
            title: "Kingdom of the Planet of the Apes",
            overview: "Several generations in the future following Caesar's reign, apes are now the dominant species and live harmoniously while humans have been reduced to living in the shadows. As a new tyrannical ape leader builds his empire, one young ape undertakes a harrowing journey that will cause him to question all that he has known about the past and to make choices that will define a future for apes and humans alike.",
            poster_path: "https://image.tmdb.org/t/p/w500/5APanzjYYIjB2pNEKUIvT7HQz9Y.jpg",
            backdrop_path: "https://image.tmdb.org/t/p/original/lu5JTgVPfYvWJwrGNulJJnqkaVp.jpg",
            release_date: "2024-05-10",
            vote_average: 7.2,
            price: 21.99,
            genres: ["Science Fiction", "Adventure", "Action"],
            runtime: 145,
            director: "Wes Ball",
            starring: ["Owen Teague", "Freya Allan", "Kevin Durand"],
            trailer_key: "SXu5uqH6Z28"
          }
        ];
        
        setMovies(mockMovies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        toast.error('Failed to load movies. Please try again.');
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Get movie by ID
  const getMovie = (id: number) => {
    return movies.find(movie => movie.id === id);
  };

  // Featured movies (could be based on rating, popularity, etc.)
  const featuredMovies = movies.slice(0, 4);
  
  // New releases (based on release date)
  const newReleases = [...movies]
    .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
    .slice(0, 4);

  return (
    <MovieContext.Provider value={{ 
      movies, 
      featuredMovies, 
      newReleases, 
      getMovie,
      loading
    }}>
      {children}
    </MovieContext.Provider>
  );
};
