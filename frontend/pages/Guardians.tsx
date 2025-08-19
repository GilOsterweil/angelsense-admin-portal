import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Phone, Mail, Shield } from "lucide-react";

export default function Guardians() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");

  // Mock data for guardians
  const guardians = [
    {
      id: "1",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0123",
      status: "active",
      angelsCount: 2,
      joinDate: "2024-01-15",
      lastActivity: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      firstName: "Maria",
      lastName: "Garcia",
      email: "maria.garcia@email.com",
      phone: "+1-555-0124",
      status: "active",
      angelsCount: 1,
      joinDate: "2024-01-10",
      lastActivity: "2024-01-15T09:45:00Z"
    },
    {
      id: "3",
      firstName: "David",
      lastName: "Johnson",
      email: "david.johnson@email.com",
      phone: "+1-555-0125",
      status: "inactive",
      angelsCount: 3,
      joinDate: "2023-12-20",
      lastActivity: "2024-01-10T14:20:00Z"
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Guardians</h1>
        <p className="text-gray-600">Manage guardian accounts and their angels</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Guardian List</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search guardians..."
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
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {guardians.map((guardian) => (
              <div
                key={guardian.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-gray-900">
                      {guardian.firstName} {guardian.lastName}
                    </h3>
                    <Badge className={getStatusColor(guardian.status)}>
                      {guardian.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{guardian.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{guardian.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span>{guardian.angelsCount} angels</span>
                    <span>Joined {new Date(guardian.joinDate).toLocaleDateString()}</span>
                    <span>Last active {new Date(guardian.lastActivity).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            ))}

            {guardians.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No guardians found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
