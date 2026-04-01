/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRiderDashboardAction } from "@/actions/rider.action";
import Link from "next/link";
import { 
  ArrowRight, 
  Clock, 
  Package, 
  CheckCircle, 
  DollarSign, 
  Wallet, 
  History,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const response = await getRiderDashboardAction();
  const data = response?.data ?? null;
  const stats = data?.statistics ?? {
    totalAssigned: 0,
    totalDelivered: 0,
    totalEarned: 0,
    withdrawableBalance: 0,
    pendingWithdraw: 0,
  };
  const withdrawHistory = Array.isArray(data?.withdrawHistory) ? data.withdrawHistory : [];

  // Format currency helper
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  // Calculate delivery rate
  const deliveryRate = stats.totalAssigned > 0 
    ? Math.round((stats.totalDelivered / stats.totalAssigned) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto space-y-8 p-6 md:p-10">
        {/* Header Section */}
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  {deliveryRate}% Delivery Rate
                </p>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                Performance Dashboard
              </h1>
              <p className="text-sm text-gray-400 max-w-2xl">
                Track your deliveries, earnings, and withdrawal activity all in one place.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link href="/rider-dashboard/assigned-parcels">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20">
                  <Package className="w-4 h-4 mr-2" />
                  Assigned Parcels
                </Button>
              </Link>
              <Link href="/rider-dashboard/withdraw">
                <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-300">
                  <Wallet className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 hover:border-gray-700 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Package className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-2xl font-bold text-emerald-400">{deliveryRate}%</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stats.totalAssigned}</p>
              <p className="text-sm text-gray-400">Total Assigned Parcels</p>
              <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${deliveryRate}%` }}
                />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 hover:border-gray-700 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-blue-400">{stats.totalDelivered}</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stats.totalDelivered}</p>
              <p className="text-sm text-gray-400">Successfully Delivered</p>
              <p className="text-xs text-gray-500 mt-2">of {stats.totalAssigned} total parcels</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 hover:border-gray-700 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-2xl font-bold text-amber-400">Total</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{formatCurrency(stats.totalEarned)}</p>
              <p className="text-sm text-gray-400">Total Lifetime Earnings</p>
            </div>
          </div>
        </div>

        {/* Balance Overview & Quick Links */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Balance Overview</h2>
                <p className="text-sm text-gray-400">Your current withdrawable and pending balances</p>
              </div>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-5">
                <p className="text-xs uppercase tracking-wider text-emerald-400 mb-2">Withdrawable Balance</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(stats.withdrawableBalance)}</p>
                <p className="text-xs text-gray-400 mt-2">Ready for withdrawal</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 p-5">
                <p className="text-xs uppercase tracking-wider text-amber-400 mb-2">Pending Withdrawal</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(stats.pendingWithdraw)}</p>
                <p className="text-xs text-gray-400 mt-2">Under processing</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/rider-dashboard/assigned-parcels" className="block">
                <Button variant="outline" className="w-full justify-between border-gray-700 hover:bg-gray-800 text-gray-300">
                  View Assigned Parcels
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/rider-dashboard/active-deliveries" className="block">
                <Button variant="outline" className="w-full justify-between border-gray-700 hover:bg-gray-800 text-gray-300">
                  Active Deliveries
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <History className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-white">Withdrawal History</h2>
              </div>
              <p className="text-sm text-gray-400">Recent payout requests from your rider account</p>
            </div>
            <Link href="/rider-dashboard/withdraw">
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800 text-gray-300">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {withdrawHistory.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-700 bg-gray-800/30 p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                <History className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-400">No withdrawal history yet</p>
              <p className="text-sm text-gray-500 mt-1">Your withdrawal transactions will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left pb-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left pb-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left pb-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="text-left pb-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="text-left pb-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {withdrawHistory.map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 text-sm text-gray-300">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 text-sm font-semibold text-white">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-4 text-sm text-gray-400">{item.method}</td>
                      <td className="py-4 text-sm text-gray-400 font-mono">{item.accountNumber}</td>
                      <td className="py-4">
                        <span className={`
                          inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                          ${item.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                          ${item.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                          ${item.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                        `}>
                          {item.status || 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}