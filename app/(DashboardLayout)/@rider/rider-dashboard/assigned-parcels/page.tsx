/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyParcelsAction } from "@/actions/parcel.action";
import { respondParcelAction } from "@/actions/rider.action";
import { 
  Package, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  User, 
  Phone, 
  DollarSign,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  AlertCircle,
  Navigation,
  Calendar,
  ArrowRight,
  XCircle,
  CheckCircle,
  Eye,
  Weight,
  Hash,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ParcelSearchBar from "@/components/dashboard/ParcelSearchBar";
import { Badge } from "@/components/ui/badge";

const getStatusConfig = (status: string) => {
  const configs = {
    DELIVERED: {
      icon: CheckCircle2,
      label: "Delivered",
      bgClass: "bg-emerald-500/10",
      textClass: "text-emerald-400",
      borderClass: "border-emerald-500/20",
      gradient: "from-emerald-500/20 to-transparent"
    },
    PICKED_UP: {
      icon: PackageCheck,
      label: "Picked Up",
      bgClass: "bg-sky-500/10",
      textClass: "text-sky-400",
      borderClass: "border-sky-500/20",
      gradient: "from-sky-500/20 to-transparent"
    },
    IN_TRANSIT: {
      icon: Truck,
      label: "In Transit",
      bgClass: "bg-blue-500/10",
      textClass: "text-blue-400",
      borderClass: "border-blue-500/20",
      gradient: "from-blue-500/20 to-transparent"
    },
    RIDER_ASSIGNED: {
      icon: Clock,
      label: "Awaiting Response",
      bgClass: "bg-purple-500/10",
      textClass: "text-purple-400",
      borderClass: "border-purple-500/20",
      gradient: "from-purple-500/20 to-transparent"
    },
    PENDING: {
      icon: Clock,
      label: "Pending",
      bgClass: "bg-amber-500/10",
      textClass: "text-amber-400",
      borderClass: "border-amber-500/20",
      gradient: "from-amber-500/20 to-transparent"
    }
  };
  return configs[status as keyof typeof configs] || configs.PENDING;
};

const getPaymentStatusConfig = (status: string) => {
  if (status === "PAID") {
    return {
      icon: CheckCircle,
      label: "Payment Received",
      bgClass: "bg-emerald-500/10",
      textClass: "text-emerald-400",
      borderClass: "border-emerald-500/20"
    };
  }
  return {
    icon: AlertCircle,
    label: "Pending Payment",
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-400",
    borderClass: "border-amber-500/20"
  };
};

export default async function AssignedParcelsPage({
  searchParams,
}: {
  searchParams: Promise<{ searchTerm?: string; page?: string }>;
}) {
  // ✅ Await searchParams
  const params = await searchParams;
  const rawSearchTerm = params?.searchTerm || "";
  const searchTerm = rawSearchTerm.trim();
  const currentPage = Number(params?.page) || 1;
  const limit = 10;

  const query: Record<string, string | number> = { page: currentPage, limit };
  if (searchTerm) query.searchTerm = searchTerm;

  const result = await getMyParcelsAction(query);
  const parcels = Array.isArray(result?.data) ? result.data : [];
  const meta = result?.meta;
  
  const assignedCount = meta?.total ?? parcels.length;
  const totalPages = Math.max(1, Math.ceil(assignedCount / limit));
  
  // Calculate statistics for rider
  const pendingResponses = parcels.filter((p: any) => p.deliveryStatus === "RIDER_ASSIGNED").length;
  const inProgress = parcels.filter((p: any) => 
    p.deliveryStatus === "PICKED_UP" || p.deliveryStatus === "IN_TRANSIT"
  ).length;
  const completed = parcels.filter((p: any) => p.deliveryStatus === "DELIVERED").length;

  const makeHref = (page: number) => {
    const p = new URLSearchParams();
    if (searchTerm) p.set("searchTerm", searchTerm);
    p.set("page", String(page));
    return `?${p.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        
        {/* Header with Stats */}
        <div className="space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Truck className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  Rider Operations
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Assigned <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Parcels</span>
              </h1>
              <p className="text-sm text-gray-400 max-w-2xl">
                Manage your delivery queue, accept new assignments, and update delivery status in real-time.
              </p>
            </div>
            <ParcelSearchBar initialSearchTerm={searchTerm} />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-2xl font-bold text-white">{assignedCount}</span>
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Total Assigned</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-2xl font-bold text-purple-400">{pendingResponses}</span>
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Pending Response</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <Truck className="w-4 h-4 text-blue-400" />
                <span className="text-2xl font-bold text-blue-400">{inProgress}</span>
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">In Progress</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-2xl font-bold text-emerald-400">{completed}</span>
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Completed</p>
            </div>
          </div>
        </div>

        {/* Parcels Grid */}
        <div className="grid gap-6">
          {parcels.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-20 text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
                  <Package className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Active Assignments</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  {searchTerm 
                    ? "No parcels match your search criteria. Try a different tracking code or title." 
                    : "You don't have any assigned parcels at the moment. New assignments will appear here."}
                </p>
              </div>
            </div>
          ) : (
            parcels.map((parcel: any) => {
              const status = getStatusConfig(parcel.deliveryStatus);
              const StatusIcon = status.icon;
              const paymentStatus = getPaymentStatusConfig(parcel.paymentStatus);
              const PaymentIcon = paymentStatus.icon;

              return (
                <div 
                  key={parcel.id} 
                  className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  {/* Background Gradient */}
                  <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl ${status.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative p-6 md:p-8">
                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
                          <Package className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 flex-wrap mb-2">
                            <h3 className="text-xl font-bold text-white">{parcel.title || "Untitled Parcel"}</h3>
                            <Badge variant="outline" className="border-white/20 text-gray-400 font-mono text-[10px]">
                              <Hash className="w-3 h-3 mr-1" />
                              {parcel.trackingCode}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(parcel.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Weight className="w-3 h-3" />
                              {parcel.weight} kg
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">৳{parcel.price}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bgClass} ${status.borderClass} border`}>
                          <StatusIcon className={`w-3 h-3 ${status.textClass}`} />
                          <span className={`text-xs font-medium ${status.textClass}`}>
                            {status.label}
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${paymentStatus.bgClass} ${paymentStatus.borderClass} border`}>
                          <PaymentIcon className={`w-3 h-3 ${paymentStatus.textClass}`} />
                          <span className={`text-xs font-medium ${paymentStatus.textClass}`}>
                            {paymentStatus.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Location Details */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-400" /> Pickup Location
                        </p>
                        <p className="text-sm text-white/80">{parcel.pickupAddress || "N/A"}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1">
                          <Navigation className="w-3 h-3 text-emerald-400" /> Delivery Location
                        </p>
                        <p className="text-sm text-white/80">{parcel.deliveryAddress || "N/A"}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1">
                              <User className="w-3 h-3" /> Receiver
                            </p>
                            <p className="text-sm text-white/80">{parcel.receiverName}</p>
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> Contact
                            </p>
                            <p className="text-sm text-white/80 font-mono">{parcel.receiverPhone}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                      {parcel.deliveryStatus === "RIDER_ASSIGNED" ? (
                        <>
                          <form action={respondParcelAction} className="flex gap-3">
                            <input type="hidden" name="parcelId" value={parcel.id} />
                            <input type="hidden" name="response" value="ACCEPTED" />
                            <Button 
                              type="submit"
                              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20 rounded-xl px-6"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Accept Delivery
                            </Button>
                          </form>
                          <form action={respondParcelAction}>
                            <input type="hidden" name="parcelId" value={parcel.id} />
                            <input type="hidden" name="response" value="REJECTED" />
                            <Button 
                              type="submit"
                              variant="outline" 
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 rounded-xl px-6"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Decline
                            </Button>
                          </form>
                        </>
                      ) : (
                        <>
                          <Link href={`/track/${parcel.trackingCode}`}>
                            <Button className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-6">
                              <Eye className="w-4 h-4 mr-2" />
                              Track Delivery
                            </Button>
                          </Link>
                          {parcel.deliveryStatus !== "DELIVERED" && (
                            <Button variant="outline" className="border-white/20 hover:bg-white/10 rounded-xl px-6">
                              <Truck className="w-4 h-4 mr-2" />
                              Update Status
                            </Button>
                          )}
                        </>
                      )}
                      
                      {/* Optional: View sender info */}
                      {parcel.sender && (
                        <Button variant="ghost" className="text-gray-400 hover:text-white rounded-xl">
                          <User className="w-4 h-4 mr-2" />
                          Sender: {parcel.sender.name}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6">
            <div className="text-xs text-gray-500">
              Showing {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, assignedCount)} of {assignedCount} parcels
            </div>
            <div className="flex items-center gap-3">
              <Link href={makeHref(Math.max(1, currentPage - 1))}>
                <Button 
                  disabled={currentPage === 1} 
                  variant="outline"
                  className="border-white/10 hover:bg-white/10 rounded-xl px-4"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = currentPage;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <Link key={pageNum} href={makeHref(pageNum)}>
                      <Button 
                        variant={currentPage === pageNum ? "default" : "outline"}
                        className={`w-10 h-10 rounded-xl ${
                          currentPage === pageNum 
                            ? "bg-emerald-500 hover:bg-emerald-600" 
                            : "border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    </Link>
                  );
                })}
              </div>
              <Link href={makeHref(Math.min(totalPages, currentPage + 1))}>
                <Button 
                  disabled={currentPage === totalPages} 
                  variant="outline"
                  className="border-white/10 hover:bg-white/10 rounded-xl px-4"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}