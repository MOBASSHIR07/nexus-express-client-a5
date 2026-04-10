/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminService } from "@/service/admin.service";
import { approveRiderAction } from "@/actions/admin.action";
import { 
  UserCheck, 
  Mail, 
  Phone, 
  Calendar, 
  ArrowRight,
  Clock,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  XCircle,
  Users,
  DollarSign,
  Truck,
  Bike,
  Car,
  Navigation,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const getVehicleIcon = (vehicle: string) => {
  const vehicleType = vehicle?.toLowerCase() || "";
  if (vehicleType.includes("bike") || vehicleType.includes("motorcycle")) return Bike;
  if (vehicleType.includes("cycle")) return Bike;
  if (vehicleType.includes("car")) return Car;
  return Truck;
};

const getStatusBadge = (status: string) => {
  const statuses: Record<string, any> = {
    AVAILABLE: { label: "Available", color: "emerald", icon: CheckCircle },
    BUSY: { label: "On Delivery", color: "blue", icon: Truck },
    OFFLINE: { label: "Offline", color: "gray", icon: Clock },
  };
  return statuses[status] || statuses.AVAILABLE;
};

export default async function RiderApplicationsPage() {
  const response = await adminService.getAllRiders();
  const riders = response?.data?.data || [];
  const meta = response?.data?.meta;
  
  const totalRiders = meta?.total || riders.length;
  const approvedRiders = riders.filter((rider: any) => rider.isApproved);
  const pendingRiders = riders.filter((rider: any) => !rider.isApproved);
  const totalEarnings = riders.reduce((sum: number, rider: any) => 
    sum + parseFloat(rider.totalEarned || 0), 0
  );
  const approvalRate = totalRiders > 0 
    ? ((approvedRiders.length / totalRiders) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        
        {/* Header Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
              Nexus Rider Management
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Rider <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Management</span>
          </h1>
          <p className="text-sm text-gray-400 max-w-2xl">
            Manage all riders in the Nexus delivery network. View performance, earnings, and approve new applications.
          </p>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Total Riders</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalRiders}</p>
            <p className="text-xs text-gray-500 mt-1">Active network members</p>
          </div>

          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Approved</span>
            </div>
            <p className="text-3xl font-bold text-emerald-400">{approvedRiders.length}</p>
            <p className="text-xs text-gray-500 mt-1">Verified riders</p>
          </div>

          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Pending</span>
            </div>
            <p className="text-3xl font-bold text-amber-400">{pendingRiders.length}</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting verification</p>
          </div>

          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <DollarSign className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Total Earnings</span>
            </div>
            <p className="text-3xl font-bold text-white">${totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Across all riders</p>
          </div>

          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Approval Rate</span>
            </div>
            <p className="text-3xl font-bold text-white">{approvalRate}%</p>
            <p className="text-xs text-gray-500 mt-1">Success rate</p>
          </div>
        </div>

        {/* Riders List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">All Riders</h2>
            <Badge variant="outline" className="border-white/20 text-gray-400">
              {totalRiders} total
            </Badge>
          </div>

          {riders.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-20 text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-6">
                  <Users className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Riders Found</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  No riders have joined the platform yet. New applications will appear here.
                </p>
              </div>
            </div>
          ) : (
            riders.map((rider: any) => {
              const VehicleIcon = getVehicleIcon(rider.vehicle);
              const StatusBadge = getStatusBadge(rider.status);
              const StatusIcon = StatusBadge.icon;
              const isPending = !rider.isApproved;
              const withdrawableBalance = parseFloat(rider.withdrawableBalance || 0);
              const totalEarned = parseFloat(rider.totalEarned || 0);
              
              return (
                <div 
                  key={rider.id} 
                  className={`group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border transition-all duration-300
                    ${isPending ? 'border-amber-500/20 hover:border-amber-500/40' : 'border-white/10 hover:border-white/20'}`}
                >
                  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative p-6 md:p-8">
                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                      <div className="flex items-start gap-5">
                        <div className={`p-3 rounded-2xl ${isPending ? 'bg-amber-500/10' : 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5'}`}>
                          <UserCheck className={`w-6 h-6 ${isPending ? 'text-amber-400' : 'text-emerald-400'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 flex-wrap mb-2">
                            <h3 className="text-xl font-bold text-white">
                              {rider.user?.name || "Unknown Rider"}
                            </h3>
                            {isPending ? (
                              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending Approval
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Approved
                              </Badge>
                            )}
                            <Badge className={`bg-${StatusBadge.color}-500/10 text-${StatusBadge.color}-400 border-${StatusBadge.color}-500/20`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {StatusBadge.label}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5" />
                              {rider.user?.email || "No email"}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5" />
                              {rider.phone || "No phone"}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              Joined: {new Date(rider.appliedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" /> Location
                        </p>
                        <p className="text-sm text-white/80">
                          {rider.district}, {rider.region}
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1 mb-2">
                          <VehicleIcon className="w-3 h-3" /> Vehicle
                        </p>
                        <p className="text-sm text-white/80">
                          {rider.vehicle || "Not specified"}
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1 mb-2">
                          <DollarSign className="w-3 h-3" /> Total Earned
                        </p>
                        <p className="text-sm font-semibold text-emerald-400">
                          ${totalEarned.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1 mb-2">
                          <Wallet className="w-3 h-3" /> Withdrawable
                        </p>
                        <p className="text-sm font-semibold text-blue-400">
                          ${withdrawableBalance.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                      {isPending ? (
                        <form action={async () => {
                          "use server";
                          await approveRiderAction(rider.id);
                        }}>
                          <Button 
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20 rounded-xl px-6"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Approve Rider
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </form>
                      ) : (
                        <Button 
                          className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-6"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          View Performance
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        className="border-white/20 hover:bg-white/10 rounded-xl px-6"
                      >
                        View Details
                      </Button>
                      
                      {!isPending && (
                        <Button 
                          variant="ghost" 
                          className="text-gray-400 hover:text-white rounded-xl"
                        >
                          Contact Rider
                        </Button>
                      )}
                    </div>

                    {/* Performance Note for Top Riders */}
                    {!isPending && totalEarned > 500 && (
                      <div className="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <p className="text-xs text-emerald-400">
                            Top performer with ${totalEarned.toLocaleString()} total earnings
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Info */}
        {meta && meta.total > meta.limit && (
          <div className="flex items-center justify-between pt-6">
            <div className="text-xs text-gray-500">
              Showing {((meta.page - 1) * meta.limit) + 1} - {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} riders
            </div>
            <div className="flex items-center gap-3">
              <Button 
                disabled={meta.page === 1} 
                variant="outline"
                className="border-white/10 hover:bg-white/10 rounded-xl px-4"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-400">
                Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
              </span>
              <Button 
                disabled={meta.page === Math.ceil(meta.total / meta.limit)} 
                variant="outline"
                className="border-white/10 hover:bg-white/10 rounded-xl px-4"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


import { Wallet } from "lucide-react";
