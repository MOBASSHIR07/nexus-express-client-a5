/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyParcelsAction } from "@/actions/parcel.action";
import { Package, MapPin, ChevronLeft, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import PayNowButton from "@/components/dashboard/PayNowButton";
import ParcelSearchBar from "@/components/dashboard/ParcelSearchBar";

export default async function MyParcelsPage({
  searchParams,
}: {
  searchParams: Promise<{ searchTerm?: string; page?: string }>;
}) {
  const params = await searchParams;
  const rawSearchTerm = params.searchTerm || "";
  const searchTerm = rawSearchTerm.trim();
  const currentPage = Number(params.page) || 1;
  const limit = 5;

  const query: Record<string, string | number> = { page: currentPage, limit };
  if (searchTerm) query.searchTerm = searchTerm;

  const result = await getMyParcelsAction(query);
  const parcels = result?.data || [];
  const meta = result?.meta;
  const totalPages = Math.max(1, Math.ceil((meta?.total || 0) / limit));

  const makeHref = (page: number) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("searchTerm", searchTerm);
    params.set("page", String(page));
    return `?${params.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-10 animate-in fade-in duration-500">
      {/* 🛸 Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
            Asset <span className="text-[#00F5A0]">Registry.</span>
          </h1>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em]">
            Database Query: {meta?.total || 0} Matches found
          </p>
        </div>

        <ParcelSearchBar initialSearchTerm={searchTerm} />
      </div>

      {/* 📊 Responsive Table / Card Grid */}
      <div className="bg-[#0b0b11]/50 border border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-black uppercase text-white/30 tracking-widest">
                <th className="p-8">Identification</th>
                <th className="p-8">Logistics Status</th>
                <th className="p-8">Valuation</th>
                <th className="p-8 text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {parcels.map((parcel: any) => (
                <tr key={parcel.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="p-8">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F5A0] shadow-[0_0_20px_rgba(0,245,160,0.05)]">
                        <Package size={22} />
                      </div>
                      <div>
                        <p className="font-black text-lg text-white uppercase italic leading-tight">{parcel.title}</p>
                        <p className="text-[10px] font-mono text-white/20 uppercase mt-1 tracking-tighter">{parcel.trackingCode}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-8">
                    <div className="flex flex-col gap-2">
                      <Badge className={`w-fit rounded-lg px-3 py-1 text-[9px] font-black uppercase border-none tracking-widest ${
                        parcel.deliveryStatus === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-[#00F5A0]/10 text-[#00F5A0]'
                      }`}>
                        {parcel.deliveryStatus}
                      </Badge>
                      <p className="text-[10px] text-white/30 font-bold uppercase italic">
                        {parcel.rider ? `Rider: ${parcel.rider.user.name}` : "Awaiting Rider Assignment"}
                      </p>
                    </div>
                  </td>

                  <td className="p-8 text-xl font-black italic text-[#00F5A0]">
                    ${parcel.price}
                  </td>

                  <td className="p-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {parcel.paymentStatus === "UNPAID" && (
                        <PayNowButton parcelId={parcel.id} price={parcel.price} />
                      )}
                      <Link href={`/track/${encodeURIComponent(parcel.trackingCode)}`}>
                        <Button variant="outline" className="h-12 border-white/5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl px-6 text-[10px] font-black uppercase">
                          <MapPin size={14} className="mr-2" /> Track
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📟 Ultra-Modern Pagination */}
        <div className="p-8 border-t border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
              Node {currentPage} / {totalPages || 1}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {currentPage > 1 ? (
              <Link href={makeHref(currentPage - 1)}>
                <Button className="h-12 w-12 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-[#00F5A0] hover:text-black transition-all">
                  <ChevronLeft size={20} />
                </Button>
              </Link>
            ) : (
              <Button disabled className="h-12 w-12 rounded-xl bg-white/10 border border-white/10 text-white/50 cursor-not-allowed">
                <ChevronLeft size={20} />
              </Button>
            )}

            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              Page {currentPage} of {totalPages}
            </div>

            {currentPage < totalPages ? (
              <Link href={makeHref(currentPage + 1)}>
                <Button className="h-12 w-12 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-[#00F5A0] hover:text-black transition-all">
                  <ChevronRight size={20} />
                </Button>
              </Link>
            ) : (
              <Button disabled className="h-12 w-12 rounded-xl bg-white/10 border border-white/10 text-white/50 cursor-not-allowed">
                <ChevronRight size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
