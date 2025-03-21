
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Film, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    document.title = "Page Not Found | CinemaVault";
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30">
      <div className="text-center px-4">
        <div className="mb-8">
          <Film className="h-20 w-20 mx-auto text-primary opacity-20" />
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold mb-4">404</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-6">
          Oops! This movie isn't in our collection.
        </p>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved to another URL.
        </p>
        
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
