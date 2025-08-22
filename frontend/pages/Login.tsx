import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import backend from "~backend/client";

const AngelSenseLogo = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10C35 10 25 25 25 40C25 55 35 70 50 70C65 70 75 55 75 40C75 25 65 10 50 10Z" fill="#4ECDC4"/>
    <circle cx="50" cy="35" r="8" fill="white"/>
    <path d="M42 45C42 45 46 50 50 50C54 50 58 45 58 45" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <path d="M30 75L50 85L70 75" stroke="#4ECDC4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HealthIndicator = () => {
  const { data: healthStatus, isLoading } = useQuery({
    queryKey: ["health"],
    queryFn: () => backend.proxy.checkHealth(),
    refetchInterval: 30000, // Check every 30 seconds
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span>Checking backend status...</span>
      </div>
    );
  }

  const isOnline = healthStatus?.status === "online";

  return (
    <div className="flex items-center gap-2 text-sm">
      <div 
        className={`w-2 h-2 rounded-full ${
          isOnline ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
      <span className={isOnline ? "text-green-600" : "text-red-600"}>
        Backend {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
};

interface QuoteData {
  text: string;
  author: string;
  date: string;
  source: string;
}

interface ActiveQuote {
  id: number;
  startTime: number;
  quoteIndex: number;
  side: 'left' | 'right';
}

const FloatingQuote = ({ quote, side, onComplete }: { quote: QuoteData; side: 'left' | 'right'; onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start the animation immediately
    setIsVisible(true);

    // Remove the quote after animation completes (20 seconds)
    const timer = setTimeout(() => {
      onComplete();
    }, 20000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const sidePosition = side === 'left' ? 'left-4' : 'right-4';

  return (
    <div
      className={`fixed ${sidePosition} bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs transition-all duration-1000 z-0 ${
        isVisible ? 'animate-float opacity-100' : 'opacity-0 translate-y-10'
      }`}
      style={{
        animationDuration: '20s',
        animationIterationCount: '1',
        animationFillMode: 'forwards',
      }}
    >
      <p className="text-sm text-gray-700 italic mb-3">"{quote.text}"</p>
      <div className="text-xs text-gray-500 space-y-1">
        <p className="font-medium">— {quote.author}</p>
        <p>{quote.date}</p>
        <p className="text-blue-600">{quote.source}</p>
      </div>
    </div>
  );
};

const FloatingQuotes = () => {
  const [activeQuotes, setActiveQuotes] = useState<ActiveQuote[]>([]);
  const [nextQuoteIndex, setNextQuoteIndex] = useState(0);

  const quotes: QuoteData[] = [
    {
      text: "AngelSense has given me peace of mind knowing exactly where my child is at all times.",
      author: "Sarah M.",
      date: "January 2024",
      source: "AngelSense Blog - Parent Stories"
    },
    {
      text: "The GPS tracking is incredibly accurate and the alerts are so helpful.",
      author: "Michael R.",
      date: "December 2023",
      source: "AngelSense Blog - Product Reviews"
    },
    {
      text: "Finally, a device that my child actually wants to wear every day.",
      author: "Jennifer L.",
      date: "February 2024",
      source: "AngelSense Blog - Success Stories"
    },
    {
      text: "The two-way voice feature has been a game-changer for our family.",
      author: "David K.",
      date: "November 2023",
      source: "AngelSense Blog - Feature Highlights"
    },
    {
      text: "I can focus on work knowing I'll be notified if anything unusual happens.",
      author: "Lisa T.",
      date: "January 2024",
      source: "AngelSense Blog - Working Parents"
    },
    {
      text: "The battery life is amazing - it lasts all day without any issues.",
      author: "Robert H.",
      date: "March 2024",
      source: "AngelSense Blog - Technical Reviews"
    },
    {
      text: "Setting up safe zones was so easy and the notifications work perfectly.",
      author: "Amanda S.",
      date: "December 2023",
      source: "AngelSense Blog - Setup Guide"
    },
    {
      text: "The customer support team is incredibly responsive and helpful.",
      author: "Mark W.",
      date: "February 2024",
      source: "AngelSense Blog - Customer Service"
    },
    {
      text: "This device has transformed how we handle my child's independence.",
      author: "Rachel P.",
      date: "January 2024",
      source: "AngelSense Blog - Independence Stories"
    },
    {
      text: "The app is intuitive and gives me all the information I need.",
      author: "Kevin J.",
      date: "March 2024",
      source: "AngelSense Blog - App Reviews"
    },
    {
      text: "AngelSense understands the unique needs of special needs families.",
      author: "Maria G.",
      date: "November 2023",
      source: "AngelSense Blog - Special Needs Support"
    },
    {
      text: "The speed alerts help me know when my teen is driving safely.",
      author: "Thomas B.",
      date: "February 2024",
      source: "AngelSense Blog - Teen Safety"
    }
  ];

  const removeQuote = (id: number) => {
    setActiveQuotes(prev => prev.filter(quote => quote.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuotes(prev => {
        // Only add a new quote if we have less than 4 active quotes
        if (prev.length < 4) {
          const newQuote: ActiveQuote = {
            id: Date.now(),
            startTime: Date.now(),
            quoteIndex: nextQuoteIndex,
            side: prev.length % 2 === 0 ? 'left' : 'right'
          };
          
          setNextQuoteIndex((nextQuoteIndex + 1) % quotes.length);
          return [...prev, newQuote];
        }
        
        return prev;
      });
    }, 5000); // Try to add new quote every 5 seconds

    return () => clearInterval(interval);
  }, [nextQuoteIndex, quotes.length]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(-200px);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float 20s linear forwards;
        }
      `}</style>
      {activeQuotes.map((activeQuote) => (
        <FloatingQuote
          key={activeQuote.id}
          quote={quotes[activeQuote.quoteIndex]}
          side={activeQuote.side}
          onComplete={() => removeQuote(activeQuote.id)}
        />
      ))}
    </div>
  );
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <FloatingQuotes />
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center">
            <AngelSenseLogo />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            AngelSense Admin
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your admin account
          </p>
          <div className="mt-4 flex justify-center">
            <HealthIndicator />
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-white/90">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Accounts:</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div>
                  <strong>Admin:</strong> admin@angelsense.com / admin123
                </div>
                <div>
                  <strong>Support:</strong> support@angelsense.com / support123
                </div>
                <div>
                  <strong>Manager:</strong> manager@angelsense.com / manager123
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
