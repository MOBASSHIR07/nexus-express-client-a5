/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminService } from "@/service/admin.service";
import { assignRiderAction } from "@/actions/admin.action";
import { 
  Package, 
  MapPin, 
  ArrowUpRight,
  CheckCircle2,
  UserPlus,
  Truck,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AllParcelsPage() {
  const parcelRes = await adminService.getAllParcels({});
  const parcels = Array.isArray(parcelRes?.data) ? parcelRes.data : [];

  const parcelsWithRiders = await Promise.all(
    parcels.map(async (parcel: any) => {
      const district = parcel.pickupDistrict || "";
      const riderRes = await adminService.getAllRiders({ 
        district: district, 
        isApproved: 'true',
        isAvailable: 'true' // Request only riders without active/pending tasks
      });

      return {
        ...parcel,
        availableRiders: Array.isArray(riderRes?.data?.data) ? riderRes.data.data : []
      };
    })
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">
              Nexus Logistics Control
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic text-white uppercase tracking-tighter">
            Fleet <span className="text-blue-500">Parcels.</span>
          </h1>
        </div>
        <div className="px-8 py-4 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
          <p className="text-[10px] uppercase text-white/40 font-black tracking-[0.3em] mb-1">Total Shipments</p>
          <p className="text-3xl font-black text-white">{parcelRes?.meta?.total || 0}</p>
        </div>
      </div>

      <div className="grid gap-6">
        {parcelsWithRiders.length === 0 ? (
          <div className="p-24 text-center bg-[#0b0b11] rounded-[3rem] border border-dashed border-white/10">
            <Package className="mx-auto text-white/5 mb-6" size={64} />
            <h3 className="text-white/20 uppercase font-black tracking-widest italic">Warehouse Empty</h3>
          </div>
        ) : (
          parcelsWithRiders.map((parcel: any) => (
            <div 
              key={parcel.id}
              className="group relative bg-[#0b0b11] border border-white/5 rounded-[2.5rem] p-8 hover:border-blue-500/30 transition-all duration-500"
            >
              <div className="flex flex-col xl:flex-row gap-10 items-start xl:items-center">
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-[10px] border-blue-500/30 text-blue-400 bg-blue-500/5 px-4">
                      {parcel.trackingCode}
                    </Badge>
                    <Badge className={`${
                      parcel.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    } border-none text-[9px] uppercase font-black tracking-widest`}>
                      {parcel.paymentStatus}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tight group-hover:text-blue-500 transition-colors">
                      {parcel.title}
                    </h3>
                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-[0.2em] mt-1">
                      {parcel.category} • {parcel.weight} KG • ${parcel.price}
                    </p>
                  </div>
                </div>

                <div className="flex-[1.5] grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5">
                  <div className="space-y-2">
                    <div className="text-[9px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full" /> Pickup Zone
                    </div>
                    <p className="text-xs text-white/60 font-medium leading-relaxed italic">
                      {parcel.pickupAddress}
                    </p>
                    <p className="text-[10px] font-bold text-white/40 uppercase">Sender: {parcel.sender?.name}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[9px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full" /> Delivery Zone
                    </div>
                    <p className="text-xs text-white/60 font-medium leading-relaxed italic">
                      {parcel.deliveryAddress}
                    </p>
                    <p className="text-[10px] font-bold text-white/40 uppercase">Receiver: {parcel.receiverName}</p>
                  </div>
                </div>

                <div className="w-full xl:w-72 space-y-4">
                  <div className="flex items-center justify-between xl:justify-end gap-3 mb-2">
                    <div className="text-right">
                       <span className="text-[9px] font-black uppercase text-white/20 block tracking-widest">Status</span>
                       <span className="text-[11px] font-black uppercase text-blue-400 italic">
                         {parcel.deliveryStatus}
                       </span>
                    </div>
                  </div>

                  {parcel.rider ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
                      <Truck size={16} className="text-emerald-500" />
                      <div>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Rider Active</p>
                        <p className="text-xs text-white/70 font-bold mt-1">{parcel.rider?.user?.name || "Assigned"}</p>
                      </div>
                    </div>
                  ) : (
                    <form 
                      action={async (formData) => {
                        "use server";
                        const riderId = formData.get("riderId") as string;
                        if (riderId) await assignRiderAction(parcel.id, riderId);
                      }} 
                      className="space-y-2"
                    >
                      <select 
                        name="riderId" 
                        required
                        className="w-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-bold uppercase tracking-wider rounded-xl p-4 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#0b0b11]">Assign Local Operative</option>
                        {parcel.availableRiders.map((rider: any) => (
                          <option key={rider.id} value={rider.id} className="bg-[#0b0b11]">
                            ⭐ {rider.user?.name} ({rider.district})
                          </option>
                        ))}
                      </select>
                      
                      {parcel.availableRiders.length === 0 && (
                        <p className="text-[9px] text-amber-500/70 font-black uppercase text-center tracking-tighter bg-amber-500/5 py-2 rounded-lg border border-amber-500/10 mb-2">
                           All local riders are currently busy
                        </p>
                      )}

                      <Button 
                        type="submit"
                        disabled={parcel.availableRiders.length === 0}
                        className="w-full bg-white text-black hover:bg-blue-500 hover:text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] py-6 shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        <UserPlus size={14} /> Assign Node
                      </Button>
                    </form>
                  )}
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
