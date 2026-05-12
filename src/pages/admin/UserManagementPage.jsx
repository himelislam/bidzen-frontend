import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import toast from "react-hot-toast";
import { getAllUsers, deactivateUser, activateUser } from "@/api/admin.api";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deactivateDialog, setDeactivateDialog] = useState({ open: false, userId: null });
  const [isDeactivating, setIsDeactivating] = useState(false);

  useEffect(() => {
    document.title = "User Management - BidZen";
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data.users || response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeactivateUser = async (userId) => {
    try {
      setIsDeactivating(true);
      await deactivateUser(userId);

      setUsers(users.map(u =>
        u._id === userId ? { ...u, isActive: false } : u
      ));

      toast.success("User deactivated successfully");
      setDeactivateDialog({ open: false, userId: null });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to deactivate user");
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await activateUser(userId);

      setUsers(users.map(u =>
        u._id === userId ? { ...u, isActive: true } : u
      ));

      toast.success("User activated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to activate user");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin h-10 w-10 border-2 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-slate-950 text-white">

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[140px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">User Management</h1>
          <p className="text-slate-400 mt-1">
            Manage users & permissions
          </p>
        </div>

        {/* Filters */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-8">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <Input
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border-white/10 focus:border-purple-500"
            />

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="bg-slate-900 border-white/10">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="buyer">Buyer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-900 border-white/10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </div>

        {/* Users */}
        {filteredUsers.length === 0 ? (
          <EmptyState title="No users found" />
        ) : (
          <div className="space-y-4">

            {filteredUsers.map((user) => (
              <Card
                key={user._id}
                className="bg-white/5 border border-white/10 backdrop-blur-xl hover:border-purple-500/50 transition hover:scale-[1.01]"
              >
                <CardHeader>
                  <div className="flex justify-between items-center">

                    <div>
                      <CardTitle className="text-white">
                        {user.name}
                      </CardTitle>
                      <p className="text-sm text-slate-400">
                        {user.email}
                      </p>
                    </div>

                    <div className="flex gap-2">

                      <span className="px-2 py-1 text-xs rounded bg-purple-500/20 text-purple-300">
                        {user.role}
                      </span>

                      <span className={`px-2 py-1 text-xs rounded ${user.isActive
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                        }`}>
                        {user.isActive ? "active" : "inactive"}
                      </span>

                    </div>

                  </div>
                </CardHeader>

                <CardContent className="flex justify-between items-center">

                  <div className="text-sm text-slate-400">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </div>

                  {user.isActive ? (
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() =>
                        setDeactivateDialog({ open: true, userId: user._id })
                      }
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleActivateUser(user._id)}
                    >
                      Activate
                    </Button>
                  )}

                </CardContent>
              </Card>
            ))}

          </div>
        )}

      </div>

      {/* Dialog */}
      <ConfirmDialog
        open={deactivateDialog.open}
        onOpenChange={(open) =>
          setDeactivateDialog({ ...deactivateDialog, open })
        }
        title="Deactivate User?"
        description="User will lose access"
        confirmText="Deactivate"
        onConfirm={() => handleDeactivateUser(deactivateDialog.userId)}
        isDestructive
        loading={isDeactivating}
      />
    </div>
  );
}