import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import backend from "~backend/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Battery, Calendar } from "lucide-react";

export default function Devices() {
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["devices", { status, page, limit }],
    queryFn: () => backend.proxy.listDevices({
      status: status as any || undefined,
      page,
      limit,
    }),
  });

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
        <h1 className="text-2xl font-bold text-gray-900">Devices</h1>
        <p className="text-gray-600">Monitor and manage AngelSense devices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Device List</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
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
          {isLoading ? (
            <div className="text-center py-8">Loading devices...</div>
          ) : (
            <div className="space-y-4">
              {data?.devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">
                        {device.deviceName}
                      </h3>
                      <Badge className={getStatusColor(device.status)}>
                        {device.status}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {device.deviceType}
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <p>Serial: {device.serialNumber}</p>
                      <p>Customer ID: {device.customerId}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Battery className={`h-3 w-3 ${getBatteryColor(device.batteryLevel)}`} />
                        <span className={getBatteryColor(device.batteryLevel)}>
                          {device.batteryLevel}%
                        </span>
                      </div>
                      {device.lastLocation && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{device.lastLocation.address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Activated {new Date(device.activationDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {device.lastLocation && (
                      <div className="mt-2 text-xs text-gray-400">
                        Last update: {new Date(device.lastLocation.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Locate
                    </Button>
                  </div>
                </div>
              ))}

              {data?.devices.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No devices found
                </div>
              )}

              {data && data.total > limit && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-gray-600">
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total} devices
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page * limit >= data.total}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
