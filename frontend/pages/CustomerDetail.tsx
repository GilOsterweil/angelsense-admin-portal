import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Calendar, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { useBackend } from "../hooks/useBackend";

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const backend = useBackend();

  const { data: customer, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => backend.proxy.getCustomer({ id: id! }),
    enabled: !!id,
  });

  const { data: devices } = useQuery({
    queryKey: ["devices", { customerId: id }],
    queryFn: () => backend.proxy.listDevices({ customerId: id }),
    enabled: !!id,
  });

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

  const getDeviceStatusColor = (status: string) => {
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

  if (isLoading) {
    return <div className="text-center py-8">Loading customer details...</div>;
  }

  if (!customer) {
    return <div className="text-center py-8">Customer not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/customers">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-gray-600">Customer Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status</span>
                <Badge className={getStatusColor(customer.subscriptionStatus)}>
                  {customer.subscriptionStatus}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{customer.email}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{customer.phone}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Joined {new Date(customer.joinDate).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-gray-400" />
                <span>Last active {new Date(customer.lastActivity).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Devices ({customer.deviceCount})</CardTitle>
            </CardHeader>
            <CardContent>
              {devices?.devices.length === 0 ? (
                <p className="text-gray-500">No devices found</p>
              ) : (
                <div className="space-y-4">
                  {devices?.devices.map((device) => (
                    <div
                      key={device.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{device.deviceName}</h4>
                          <Badge className={getDeviceStatusColor(device.status)}>
                            {device.status}
                          </Badge>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          <p>Type: {device.deviceType}</p>
                          <p>Serial: {device.serialNumber}</p>
                          <p>Battery: {device.batteryLevel}%</p>
                        </div>
                        {device.lastLocation && (
                          <div className="mt-2 text-xs text-gray-500">
                            Last location: {device.lastLocation.address}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                Send Message
              </Button>
              <Button className="w-full" variant="outline">
                Create Ticket
              </Button>
              <Button className="w-full" variant="outline">
                View Billing
              </Button>
              <Button className="w-full" variant="outline">
                Account Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Devices</span>
                <span className="font-medium">{customer.deviceCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Account Type</span>
                <span className="font-medium">Premium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly Fee</span>
                <span className="font-medium">$39.99</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Next Billing</span>
                <span className="font-medium">Dec 15, 2024</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
