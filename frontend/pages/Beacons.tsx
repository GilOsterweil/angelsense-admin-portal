import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Bluetooth, MapPin, Battery, Calendar } from "lucide-react";

export default function Beacons() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");

  // Mock data for beacons
  const beacons = [
    {
      id: "1",
      name: "School Entrance Beacon",
      macAddress: "AA:BB:CC:DD:EE:01",
      location: "Lincoln Elementary - Main Entrance",
      status: "active",
      batteryLevel: 78,
      signalStrength: -45,
      lastSeen: "2024-01-15T10:30:00Z",
      installDate: "2024-01-01",
      detectedAngels: 5
    },
    {
      id: "2",
      name: "Playground Beacon",
      macAddress: "AA:BB:CC:DD:EE:02",
      location: "Central Park - Playground Area",
      status: "active",
      batteryLevel: 92,
      signalStrength: -38,
      lastSeen: "2024-01-15T10:28:00Z",
      installDate: "2024-01-05",
      detectedAngels: 3
    },
    {
      id: "3",
      name: "Library Beacon",
      macAddress: "AA:BB:CC:DD:EE:03",
      location: "Springfield Library - Children's Section",
      status: "low_battery",
      batteryLevel: 15,
      signalStrength: -52,
      lastSeen: "2024-01-15T09:45:00Z",
      installDate: "2023-12-15",
      detectedAngels: 1
    },
    {
      id: "4",
      name: "Home Beacon",
      macAddress: "AA:BB:CC:DD:EE:04",
      location: "Johnson Residence - Living Room",
      status: "offline",
      batteryLevel: 0,
      signalStrength: null,
      lastSeen: "2024-01-12T16:20:00Z",
      installDate: "2024-01-08",
      detectedAngels: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "low_battery":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-green-600";
    if (level > 20) return "text-yellow-600";
    return "text-red-600";
  };

  const getSignalColor = (strength: number | null) => {
    if (strength === null) return "text-gray-400";
    if (strength > -40) return "text-green-600";
    if (strength > -60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Beacons</h1>
        <p className="text-gray-600">Monitor and manage Bluetooth beacons for indoor tracking</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Beacon List</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search beacons..."
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
                <SelectItem value="low_battery">Low Battery</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {beacons.map((beacon) => (
              <div
                key={beacon.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Bluetooth className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium text-gray-900">
                      {beacon.name}
                    </h3>
                    <Badge className={getStatusColor(beacon.status)}>
                      {beacon.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    <p>MAC: {beacon.macAddress}</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{beacon.location}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Battery className={`h-3 w-3 ${getBatteryColor(beacon.batteryLevel)}`} />
                      <span className={getBatteryColor(beacon.batteryLevel)}>
                        {beacon.batteryLevel}%
                      </span>
                    </div>
                    {beacon.signalStrength !== null && (
                      <div className="flex items-center gap-1">
                        <Bluetooth className={`h-3 w-3 ${getSignalColor(beacon.signalStrength)}`} />
                        <span className={getSignalColor(beacon.signalStrength)}>
                          {beacon.signalStrength} dBm
                        </span>
                      </div>
                    )}
                    <span>{beacon.detectedAngels} angels detected</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Installed {new Date(beacon.installDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Last seen: {new Date(beacon.lastSeen).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Locate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </div>
              </div>
            ))}

            {beacons.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No beacons found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
