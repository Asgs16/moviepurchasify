
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie } from "@/context/MovieContext";
import MovieCard from "./MovieCard";

interface MovieSliderProps {
  title: string;
  movies: Movie[];
  featured?: boolean;
}

const MovieSlider = ({ title, movies, featured = false }: MovieSliderProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  };

  const scrollTo = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => scrollTo('left')}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Scroll left</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => scrollTo('right')}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      </div>
      
      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={handleScroll}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className={featured ? "min-w-full sm:min-w-[80%] md:min-w-[70%] lg:min-w-[60%]" : "min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[240px]"}
          >
            <MovieCard movie={movie} featured={featured} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieSlider;
