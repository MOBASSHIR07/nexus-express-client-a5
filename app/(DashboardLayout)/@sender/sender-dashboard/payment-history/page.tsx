import { getPaymentHistoryAction } from "@/actions/parcel.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IPaymentHistoryItem } from "@/types/parcel";

export default async function Page() {
  const result = await getPaymentHistoryAction();
  const history = Array.isArray(result?.data) ? result.data : [];
  const success = result?.success ?? false;
  const message = result?.message || "Failed to load payment history.";

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-10 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">Payment History</p>
          <h1 className="text-4xl font-black uppercase tracking-tight text-white">Payment Ledger</h1>
          <p className="mt-2 text-sm text-white/50">Review your completed and pending transactions.</p>
        </div>
        <Link href="/sender-dashboard/my-parcels">
          <Button variant="outline">Back to parcels</Button>
        </Link>
      </div>

      {!success ? (
        <div className="rounded-[2rem] border border-red-500/20 bg-red-500/5 p-8 text-white">
          <p className="text-sm text-red-200">{message}</p>
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center text-white/60">
          No payment records were found for your account.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b11]/50 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead className="bg-white/[0.03] text-[10px] uppercase tracking-[0.3em] text-white/40">
                <tr>
                  <th className="px-6 py-4">Transaction</th>
                  <th className="px-6 py-4">Parcel</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((item: IPaymentHistoryItem) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5 text-sm text-white">{item.transactionId ?? item.id}</td>
                    <td className="px-6 py-5 text-sm text-white/70">
                      {item.parcel?.title ?? "Parcel"}
                      {item.parcel?.trackingCode ? ` — ${item.parcel.trackingCode}` : ""}
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-[#00F5A0]">{item.amount} {item.currency ?? "$"}</td>
                    <td className="px-6 py-5">
                      <Badge className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.3em] font-black text-white/90 bg-white/10">
                        {item.status ?? "Paid"}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-sm text-white/50">{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
