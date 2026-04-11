/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyParcelsAction } from "@/actions/rider.action"; 
import { Package, Truck, MapPin, Navigation, Clock, CheckCircle2, PackageCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ParcelSearchBar from "@/components/dashboard/ParcelSearchBar";

export const dynamic = "force-dynamic";

const activeStatuses = ["PICKED_UP", "IN_TRANSIT", "RIDER_ASSIGNED", "ACCEPTED"]; 

const getStatusConfig = (status: string) => {
  const configs = {
    PICKED_UP: { icon: PackageCheck, label: "Picked Up", bgClass: "bg-sky-500/10", textClass: "text-sky-400" },
    IN_TRANSIT: { icon: Truck, label: "In Transit", bgClass: "bg-blue-500/10", textClass: "text-blue-400" },
    ACCEPTED: { icon: CheckCircle2, label: "Accepted", bgClass: "bg-purple-500/10", textClass: "text-purple-400" },
    RIDER_ASSIGNED: { icon: Clock, label: "Request Sent", bgClass: "bg-amber-500/10", textClass: "text-amber-400" },
    PENDING: { icon: Clock, label: "Pending", bgClass: "bg-amber-500/10", textClass: "text-amber-400" }
  };
  return configs[status as keyof typeof configs] || configs.PENDING;
};

export default async function ActiveDeliveriesPage({
  searchParams,
}: {
  searchParams: Promise<{ searchTerm?: string }>;
}) {
  const params = await searchParams;
  const searchTerm = params?.searchTerm || "";

  const result = await getMyParcelsAction({ page: 1, limit: 100, searchTerm });
  const allParcels = Array.isArray(result?.data) ? result.data : [];

  const activeParcels = allParcels.filter((parcel: any) => 
    activeStatuses.includes(parcel.deliveryStatus)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Active <span className="text-emerald-500">Missions</span></h1>
            <p className="text-gray-400">Overview of your ongoing deliveries.</p>
          </div>
          <ParcelSearchBar initialSearchTerm={searchTerm} />
        </div>

        <div className="grid gap-4">
          {activeParcels.length === 0 ? (
            <div className="bg-white/5 p-20 rounded-3xl border border-white/10 text-center text-gray-500 italic">
              No active missions found.
            </div>
          ) : (
            activeParcels.map((parcel: any) => {
              const status = getStatusConfig(parcel.deliveryStatus);
              const StatusIcon = status.icon;

              return (
                <div key={parcel.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                          <Package size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{parcel.title}</h3>
                          <p className="text-[10px] font-mono text-gray-500">{parcel.trackingCode}</p>
                        </div>
                        <Badge className={`${status.bgClass} ${status.textClass} border-none ml-2`}>
                          <StatusIcon size={12} className="mr-1 inline" /> {status.label}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="text-red-400 mt-1" />
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Pickup Address</p>
                            <p className="text-sm text-gray-300">{parcel.pickupAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Navigation size={16} className="text-emerald-400 mt-1" />
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Delivery Address</p>
                            <p className="text-sm text-gray-300">{parcel.deliveryAddress}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:text-right flex flex-col justify-between items-end">
                       <div className="text-emerald-400 font-black text-xl">${parcel.price}</div>
                       <Badge variant="outline" className="border-white/10 text-gray-500">
                          Due: {parcel.paymentStatus}
                       </Badge>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
