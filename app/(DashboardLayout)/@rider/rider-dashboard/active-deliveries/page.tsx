/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyParcelsAction } from "@/actions/parcel.action";
import { updateParcelStatusAction } from "@/actions/rider.action";
import { 
  Package, Truck, ChevronLeft, ChevronRight, MapPin, Navigation, Clock,
  CheckCircle2, PackageCheck, ArrowRight, RefreshCw, User, Phone, DollarSign,
  Weight, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import ParcelSearchBar from "@/components/dashboard/ParcelSearchBar";

const activeStatuses = ["PENDING", "PICKED_UP", "IN_TRANSIT", "RIDER_ASSIGNED"]; 

const getStatusConfig = (status: string) => {
  const configs = {
    DELIVERED: { icon: CheckCircle2, label: "Delivered", bgClass: "bg-emerald-500/10", textClass: "text-emerald-400", borderClass: "border-emerald-500/20" },
    PICKED_UP: { icon: PackageCheck, label: "Picked Up", bgClass: "bg-sky-500/10", textClass: "text-sky-400", borderClass: "border-sky-500/20" },
    IN_TRANSIT: { icon: Truck, label: "In Transit", bgClass: "bg-blue-500/10", textClass: "text-blue-400", borderClass: "border-blue-500/20" },
    RIDER_ASSIGNED: { icon: Clock, label: "Accepted", bgClass: "bg-purple-500/10", textClass: "text-purple-400", borderClass: "border-purple-500/20" }, // ✅ Added
    PENDING: { icon: Clock, label: "Pending Pickup", bgClass: "bg-amber-500/10", textClass: "text-amber-400", borderClass: "border-amber-500/20" }
  };
  return configs[status as keyof typeof configs] || configs.PENDING;
};

const getNextStatusOptions = (status: string) => {
  switch (status) {
    case "RIDER_ASSIGNED": 
      return [{ value: "PICKED_UP", label: "Mark as Picked Up" }];
    case "PENDING":
      return [{ value: "PICKED_UP", label: "Mark as Picked Up" }];
    case "PICKED_UP":
      return [
        { value: "IN_TRANSIT", label: "Start Transit" },
        { value: "DELIVERED", label: "Mark as Delivered" }
      ];
    case "IN_TRANSIT":
      return [{ value: "DELIVERED", label: "Mark as Delivered" }];
    default:
      return [];
  }
};

export default async function Page({
  searchParams,
}: {

  searchParams: Promise<{ searchTerm?: string; page?: string }>; 
}) {
  
  const params = await searchParams; 
  const rawSearchTerm = params?.searchTerm || "";
  const searchTerm = rawSearchTerm.trim();
  const currentPage = Number(params?.page) || 1;
  const limit = 10;
  const query: Record<string, string | number> = { page: currentPage, limit };
  if (searchTerm) query.searchTerm = searchTerm;

  const result = await getMyParcelsAction(query);
  const parcels = Array.isArray(result?.data) ? result.data : [];
  
 
  const activeParcels = parcels.filter((parcel: any) => activeStatuses.includes(parcel.deliveryStatus));
  const activeCount = activeParcels.length;
  const pickedCount = activeParcels.filter((parcel: any) => parcel.deliveryStatus === "PICKED_UP").length;
  const inTransitCount = activeParcels.filter((parcel: any) => parcel.deliveryStatus === "IN_TRANSIT").length;
  const pendingCount = activeParcels.filter((parcel: any) => parcel.deliveryStatus === "PENDING" || parcel.deliveryStatus === "RIDER_ASSIGNED").length;
  
  const totalEarnings = activeParcels
    .filter((parcel: any) => parcel.paymentStatus === "PAID")
    .reduce((sum: number, parcel: any) => sum + parseFloat(parcel.price), 0);
  
  const totalPages = Math.max(1, Math.ceil(activeCount / limit));
  const pageItems = activeParcels.slice((currentPage - 1) * limit, currentPage * limit);

  const makeHref = (page: number) => {
    const p = new URLSearchParams();
    if (searchTerm) p.set("searchTerm", searchTerm);
    p.set("page", String(page));
    return `?${p.toString()}`;
  };

  const prevHref = currentPage > 1 ? makeHref(currentPage - 1) : undefined;
  const nextHref = currentPage < totalPages ? makeHref(currentPage + 1) : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        
        {/* Header - No Change in Design */}
        <div className="space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Truck className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Live Operations</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Active <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Deliveries</span>
              </h1>
            </div>
            <ParcelSearchBar initialSearchTerm={searchTerm} />
          </div>

          {/* Stats Dashboard - Design Same */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-emerald-500/10"><Package className="w-4 h-4 text-emerald-400" /></div>
                <span className="text-2xl font-bold text-white">{activeCount}</span>
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Active Deliveries</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-amber-500/10"><Clock className="w-4 h-4 text-amber-400" /></div>
                <span className="text-2xl font-bold text-amber-400">{pendingCount}</span>
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Pending Pickup</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-sky-500/10"><PackageCheck className="w-4 h-4 text-sky-400" /></div>
                <span className="text-2xl font-bold text-sky-400">{pickedCount}</span>
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Picked Up</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-blue-500/10"><Truck className="w-4 h-4 text-blue-400" /></div>
                <span className="text-2xl font-bold text-blue-400">{inTransitCount}</span>
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">In Transit</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-emerald-500/10"><DollarSign className="w-4 h-4 text-emerald-400" /></div>
                <span className="text-2xl font-bold text-emerald-400">${totalEarnings}</span>
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Earnings (Paid)</p>
            </div>
          </div>
        </div>

        {/* Deliveries Grid - Design Same */}
        <div className="space-y-4">
          {pageItems.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-20 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">No Active Deliveries</h3>
            </div>
          ) : (
            pageItems.map((parcel: any) => {
              const status = getStatusConfig(parcel.deliveryStatus);
              const StatusIcon = status.icon;
              const nextOptions = getNextStatusOptions(parcel.deliveryStatus);
              
              return (
                <div key={parcel.id} className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="relative p-6 md:p-8">
                    {/* Header - Design Same */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-emerald-500/10"><Package className="w-6 h-6 text-emerald-400" /></div>
                        <div>
                          <div className="flex items-center gap-3 flex-wrap mb-2">
                            <h3 className="text-xl font-bold text-white">{parcel.title || "Untitled Parcel"}</h3>
                            <Badge variant="outline" className="border-white/20 text-gray-400 font-mono text-[10px]">{parcel.trackingCode}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span><Calendar className="w-3 h-3 inline mr-1" />{new Date(parcel.createdAt).toLocaleDateString()}</span>
                            <span><Weight className="w-3 h-3 inline mr-1" />{parcel.weight} kg</span>
                            <span><DollarSign className="w-3 h-3 inline mr-1 text-emerald-400" /><span className="text-emerald-400">${parcel.price}</span></span>
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bgClass} ${status.borderClass} border`}>
                        <StatusIcon className={`w-3 h-3 ${status.textClass}`} />
                        <span className={`text-xs font-medium ${status.textClass}`}>{status.label}</span>
                      </div>
                    </div>

                    {/* Location Details - Design Same */}
                    <div className="grid gap-4 md:grid-cols-2 mb-6">
                      <div className="space-y-2 p-4 rounded-xl bg-white/5">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3 text-red-400" /> Pickup Location</p>
                        <p className="text-sm text-white/80">{parcel.pickupAddress}</p>
                      </div>
                      <div className="space-y-2 p-4 rounded-xl bg-white/5">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1"><Navigation className="w-3 h-3 text-emerald-400" /> Delivery Location</p>
                        <p className="text-sm text-white/80">{parcel.deliveryAddress}</p>
                      </div>
                    </div>

                    {nextOptions.length > 0 && (
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                          <RefreshCw className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Update Delivery Status</span>
                        </div>
                        <form action={updateParcelStatusAction} className="flex flex-wrap gap-3">
                          <input type="hidden" name="parcelId" value={parcel.id} />
                          <div className="flex-1 min-w-[200px]">
                            <select name="status" required className="w-full rounded-xl border border-white/10 bg-gray-900/50 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50">
                              <option value="" disabled selected>Select next status...</option>
                              {nextOptions.map((o) => (<option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>))}
                            </select>
                          </div>
                          <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl px-6">
                            <ArrowRight className="w-4 h-4 mr-2" />Update Status
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* ... (Pagination codes stay exactly as you wrote them) ... */}
      </div>
    </div>
  );
}