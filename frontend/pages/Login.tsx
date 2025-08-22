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

const FloatingQuote = ({ quote, delay }: { quote: string; delay: number }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`absolute bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs transition-all duration-1000 ${
        isVisible ? 'animate-float opacity-100' : 'opacity-0 translate-y-10'
      }`}
      style={{
        left: `${Math.random() * 70 + 10}%`,
        animationDelay: `${delay}ms`,
        animationDuration: '15s',
        animationIterationCount: 'infinite',
      }}
    >
      <p className="text-sm text-gray-700 italic">"{quote}"</p>
    </div>
  );
};

const FloatingQuotes = () => {
  const quotes = [
    "AngelSense has given me peace of mind knowing exactly where my child is at all times.",
    "The GPS tracking is incredibly accurate and the alerts are so helpful.",
    "Finally, a device that my child actually wants to wear every day.",
    "The two-way voice feature has been a game-changer for our family.",
    "I can focus on work knowing I'll be notified if anything unusual happens.",
    "The battery life is amazing - it lasts all day without any issues.",
    "Setting up safe zones was so easy and the notifications work perfectly.",
    "The customer support team is incredibly responsive and helpful.",
    "This device has transformed how we handle my child's independence.",
    "The app is intuitive and gives me all the information I need.",
    "AngelSense understands the unique needs of special needs families.",
    "The speed alerts help me know when my teen is driving safely.",
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float 15s linear infinite;
        }
      `}</style>
      {quotes.map((quote, index) => (
        <FloatingQuote
          key={index}
          quote={quote}
          delay={index * 2000 + Math.random() * 1000}
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
