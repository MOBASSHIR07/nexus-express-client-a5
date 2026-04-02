/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyParcelsAction, respondParcelAction, updateParcelStatusAction } from "@/actions/rider.action";
import { 
  Package, ChevronLeft, ChevronRight, Truck, PackageCheck, 
  Clock, CheckCircle2, CheckCircle, AlertCircle, Eye, Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ParcelSearchBar from "@/components/dashboard/ParcelSearchBar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const dynamic = "force-dynamic";

const getStatusConfig = (status: string) => {
  const configs = {
    DELIVERED: { label: "Delivered", bgClass: "bg-emerald-500/10", textClass: "text-emerald-400" },
    IN_TRANSIT: { label: "In Transit", bgClass: "bg-blue-500/10", textClass: "text-blue-400" },
    PICKED_UP: { label: "Picked Up", bgClass: "bg-sky-500/10", textClass: "text-sky-400" },
    RIDER_ASSIGNED: { label: "New Request", bgClass: "bg-purple-500/10", textClass: "text-purple-400" },
    PENDING: { label: "Pending", bgClass: "bg-amber-500/10", textClass: "text-amber-400" }
  };
  return configs[status as keyof typeof configs] || configs.PENDING;
};

export default async function AssignedParcelsPage(props: {
  searchParams: Promise<{ searchTerm?: string; page?: string }>;
}) {
  const params = await props.searchParams;
  const rawSearchTerm = params?.searchTerm || "";
  const searchTerm = rawSearchTerm.trim();
  const currentPage = Number(params?.page) || 1;
  const limit = 10;

  const result = await getMyParcelsAction({ page: currentPage, limit, searchTerm });
  const parcels = Array.isArray(result?.data) ? result.data : [];
  const meta = result?.meta;
  
  const assignedCount = meta?.total ?? parcels.length;
  const totalPages = Math.max(1, Math.ceil(assignedCount / limit));
  
  const pendingResponses = parcels.filter((p: any) => p.deliveryStatus === "RIDER_ASSIGNED").length;
  const inProgress = parcels.filter((p: any) => ["PICKED_UP", "IN_TRANSIT"].includes(p.deliveryStatus)).length;
  const completed = parcels.filter((p: any) => p.deliveryStatus === "DELIVERED").length;

  const makeHref = (page: number) => {
    const p = new URLSearchParams();
    if (searchTerm) p.set("searchTerm", searchTerm);
    p.set("page", String(page));
    return `?${p.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        
        <div className="space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Assigned <span className="text-emerald-500">Parcels</span></h1>
              <p className="text-sm text-gray-400 max-w-2xl">Manage your active delivery assignments here.</p>
            </div>
            <ParcelSearchBar initialSearchTerm={searchTerm} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <span className="text-2xl font-bold">{assignedCount}</span>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Total</p>
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <span className="text-2xl font-bold text-purple-400">{pendingResponses}</span>
              <p className="text-xs text-gray-400 uppercase tracking-wider">New</p>
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <span className="text-2xl font-bold text-blue-400">{inProgress}</span>
              <p className="text-xs text-gray-400 uppercase tracking-wider">In Progress</p>
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <span className="text-2xl font-bold text-emerald-400">{completed}</span>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Delivered</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {parcels.length === 0 ? (
            <div className="rounded-3xl bg-white/5 border border-white/10 p-20 text-center text-gray-500">No parcels found.</div>
          ) : (
            parcels.map((parcel: any) => {
              const status = getStatusConfig(parcel.deliveryStatus);
              const isPendingResponse = parcel.deliveryStatus === "RIDER_ASSIGNED";

              return (
                <div key={parcel.id} className="rounded-3xl bg-white/5 border border-white/10 p-6 md:p-8 hover:border-white/20 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400"><Package className="w-6 h-6" /></div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{parcel.title || "Parcel"}</h3>
                        <div className="flex gap-4 text-xs text-gray-400">
                          <Badge variant="outline" className="font-mono">{parcel.trackingCode}</Badge>
                          <span className="text-emerald-400 font-bold">৳{parcel.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${status.bgClass} ${status.textClass} border-none`}>{status.label}</Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-6 text-sm text-gray-300">
                    <div><p className="text-[10px] text-gray-500 uppercase mb-1">Pickup</p>{parcel.pickupAddress}</div>
                    <div><p className="text-[10px] text-gray-500 uppercase mb-1">Delivery</p>{parcel.deliveryAddress}</div>
                    <div><p className="text-[10px] text-gray-500 uppercase mb-1">Receiver</p>{parcel.receiverName} ({parcel.receiverPhone})</div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                    {isPendingResponse ? (
                      <>
                        <form action={respondParcelAction}>
                          <input type="hidden" name="parcelId" value={parcel.id} />
                          <input type="hidden" name="response" value="ACCEPTED" />
                          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-8">Accept</Button>
                        </form>
                        <form action={respondParcelAction}>
                          <input type="hidden" name="parcelId" value={parcel.id} />
                          <input type="hidden" name="response" value="REJECTED" />
                          <Button type="submit" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl">Decline</Button>
                        </form>
                      </>
                    ) : (
                      <>
                        <Link href={`/track/${parcel.trackingCode}`}>
                          <Button variant="secondary" className="rounded-xl px-6">
                             Track
                          </Button>
                        </Link>
                        
                        {parcel.deliveryStatus !== "DELIVERED" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-xl px-6">
                                Update Status
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-900 border-white/10 text-white rounded-xl p-2 min-w-[180px]">
                              
                              {parcel.deliveryStatus !== "IN_TRANSIT" && (
                                <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer">
                                  <form action={updateParcelStatusAction} className="w-full">
                                    <input type="hidden" name="parcelId" value={parcel.id} />
                                    <input type="hidden" name="status" value="IN_TRANSIT" />
                                    <button type="submit" className="w-full text-left p-2">
                                       Start IN_TRANSIT
                                    </button>
                                  </form>
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer">
                                <form action={updateParcelStatusAction} className="w-full">
                                  <input type="hidden" name="parcelId" value={parcel.id} />
                                  <input type="hidden" name="status" value="DELIVERED" />
                                  <button type="submit" className="w-full text-left p-2 text-emerald-400 font-bold">
                                     Mark as DELIVERED
                                  </button>
                                </form>
                              </DropdownMenuItem>

                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-6 text-gray-500 text-xs border-t border-white/5">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <Link href={makeHref(Math.max(1, currentPage - 1))}>
                <Button disabled={currentPage === 1} variant="outline" size="sm">Prev</Button>
              </Link>
              <Link href={makeHref(Math.min(totalPages, currentPage + 1))}>
                <Button disabled={currentPage === totalPages} variant="outline" size="sm">Next</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}