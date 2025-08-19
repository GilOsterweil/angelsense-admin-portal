import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Heart, MapPin, Calendar } from "lucide-react";

export default function Angels() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");

  // Mock data for angels
  const angels = [
    {
      id: "1",
      firstName: "Emma",
      lastName: "Johnson",
      age: 8,
      guardianName: "John Smith",
      status: "safe",
      deviceId: "GPS-001",
      lastLocation: "Home - 123 Main St",
      lastSeen: "2024-01-15T10:30:00Z",
      emergencyContacts: 3
    },
    {
      id: "2",
      firstName: "Michael",
      lastName: "Garcia",
      age: 12,
      guardianName: "Maria Garcia",
      status: "safe",
      deviceId: "GPS-002",
      lastLocation: "School - Lincoln Elementary",
      lastSeen: "2024-01-15T09:45:00Z",
      emergencyContacts: 2
    },
    {
      id: "3",
      firstName: "Sarah",
      lastName: "Wilson",
      age: 6,
      guardianName: "David Johnson",
      status: "alert",
      deviceId: "GPS-003",
      lastLocation: "Park - Central Park",
      lastSeen: "2024-01-15T08:20:00Z",
      emergencyContacts: 4
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-green-100 text-green-800";
      case "alert":
        return "bg-yellow-100 text-yellow-800";
      case "emergency":
        return "bg-red-100 text-red-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Angels</h1>
        <p className="text-gray-600">Monitor and manage angel profiles and safety status</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Angel List</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search angels..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="safe">Safe</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {angels.map((angel) => (
              <div
                key={angel.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-pink-600" />
                    <h3 className="font-medium text-gray-900">
                      {angel.firstName} {angel.lastName}
                    </h3>
                    <Badge className={getStatusColor(angel.status)}>
                      {angel.status}
                    </Badge>
                    <span className="text-sm text-gray-500">Age {angel.age}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    <p>Guardian: {angel.guardianName}</p>
                    <p>Device: {angel.deviceId}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{angel.lastLocation}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Last seen {new Date(angel.lastSeen).toLocaleString()}</span>
                    </div>
                    <span>{angel.emergencyContacts} emergency contacts</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Locate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}

            {angels.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No angels found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
