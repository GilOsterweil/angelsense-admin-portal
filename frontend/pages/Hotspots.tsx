import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Wifi, MapPin, Users } from "lucide-react";

export default function Hotspots() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("");

  // Mock data for hotspots
  const hotspots = [
    {
      id: "1",
      name: "Lincoln Elementary School",
      type: "school",
      address: "456 Oak Avenue, Springfield",
      status: "active",
      angelsCount: 12,
      radius: 100,
      createdDate: "2024-01-01",
      lastActivity: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      name: "Central Park Playground",
      type: "playground",
      address: "789 Park Drive, Springfield",
      status: "active",
      angelsCount: 8,
      radius: 50,
      createdDate: "2024-01-05",
      lastActivity: "2024-01-15T09:45:00Z"
    },
    {
      id: "3",
      name: "Springfield Library",
      type: "library",
      address: "321 Main Street, Springfield",
      status: "inactive",
      angelsCount: 3,
      radius: 75,
      createdDate: "2023-12-15",
      lastActivity: "2024-01-10T14:20:00Z"
    },
    {
      id: "4",
      name: "Grandma's House",
      type: "home",
      address: "654 Elm Street, Springfield",
      status: "active",
      angelsCount: 2,
      radius: 25,
      createdDate: "2024-01-08",
      lastActivity: "2024-01-15T08:15:00Z"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "school":
        return "bg-blue-100 text-blue-800";
      case "playground":
        return "bg-green-100 text-green-800";
      case "library":
        return "bg-purple-100 text-purple-800";
      case "home":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hotspots</h1>
        <p className="text-gray-600">Manage safe zones and location-based alerts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hotspot List</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search hotspots..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="school">School</SelectItem>
                <SelectItem value="playground">Playground</SelectItem>
                <SelectItem value="library">Library</SelectItem>
                <SelectItem value="home">Home</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hotspots.map((hotspot) => (
              <div
                key={hotspot.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-5 w-5 text-orange-600" />
                    <h3 className="font-medium text-gray-900">
                      {hotspot.name}
                    </h3>
                    <Badge className={getStatusColor(hotspot.status)}>
                      {hotspot.status}
                    </Badge>
                    <Badge variant="outline" className={getTypeColor(hotspot.type)}>
                      {hotspot.type}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{hotspot.address}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{hotspot.angelsCount} angels</span>
                    </div>
                    <span>Radius: {hotspot.radius}m</span>
                    <span>Created {new Date(hotspot.createdDate).toLocaleDateString()}</span>
                    <span>Last activity {new Date(hotspot.lastActivity).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Map
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}

            {hotspots.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hotspots found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
