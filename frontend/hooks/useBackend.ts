import { useAuth } from "../contexts/AuthContext";
import backend from "~backend/client";

export function useBackend() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return backend;
  }
  
  // The session cookie is automatically sent with requests
  // so we don't need to manually add authentication headers
  return backend;
}
