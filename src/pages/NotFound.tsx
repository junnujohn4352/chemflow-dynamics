
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md text-center p-8">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center">
            <span className="text-4xl font-bold text-flow-blue">404</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-flow-blue text-white font-medium shadow-sm hover:bg-flow-blue/90 transition-colors"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
