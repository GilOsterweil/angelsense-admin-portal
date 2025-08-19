import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Battery, Calendar } from "lucide-react";

export default function GPSTrackers() {
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState("");

  // Mock data for GPS trackers
  const trackers = [
    {
      id: "1",
      deviceName: "Emma's Tracker",
      angelName: "Emma Johnson",
      status: "active",
      batteryLevel: 85,
      lastLocation: {
        address: "123 Main St, New York, NY",
        timestamp: "2024-01-15T10:30:00Z"
      },
      activationDate: "2024-01-01"
    },
    {
      id: "2",
      deviceName: "Michael's Watch",
      angelName: "Michael Smith",
      status: "active",
      batteryLevel: 42,
      lastLocation: {
        address: "456 Oak Ave, Los Angeles, CA",
        timestamp: "2024-01-15T10:25:00Z"
      },
      activationDate: "2024-01-05"
    },
    {
      id: "3",
      deviceName: "Sarah's Tracker",
      angelName: "Sarah Wilson",
      status: "inactive",
      batteryLevel: 15,
      lastLocation: {
        address: "789 Pine St, Chicago, IL",
        timestamp: "2024-01-15T09:45:00Z"
      },
      activationDate: "2023-12-20"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "lost":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-green-600";
    if (level > 20) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">GPS Device Trackers</h1>
        <p className="text-gray-600">Monitor and manage GPS tracking devices</p>
      </div>

      {/* Google Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Live Tracking Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">Google Maps Integration</p>
              <p className="text-gray-400 text-sm">Real-time GPS tracker locations will be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>GPS Tracker List</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search trackers..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trackers.map((tracker) => (
              <div
                key={tracker.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-gray-900">
                      {tracker.deviceName}
                    </h3>
                    <Badge className={getStatusColor(tracker.status)}>
                      {tracker.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    <p>Angel: {tracker.angelName}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Battery className={`h-3 w-3 ${getBatteryColor(tracker.batteryLevel)}`} />
                      <span className={getBatteryColor(tracker.batteryLevel)}>
                        {tracker.batteryLevel}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{tracker.lastLocation.address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Activated {new Date(tracker.activationDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Last update: {new Date(tracker.lastLocation.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View on Map
                  </Button>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
