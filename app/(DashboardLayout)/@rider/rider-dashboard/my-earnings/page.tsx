/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRiderDashboardAction } from "@/actions/rider.action";
export const dynamic = "force-dynamic";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Package, 
  CheckCircle2,
  Wallet,
  ArrowUpRight,
  BarChart3,
  PiggyBank,
  Award,
  Target,
  History
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  // Calculate additional metrics
  const totalEarned = parseFloat(stats.totalEarned) || 0;
  const withdrawableBalance = parseFloat(stats.withdrawableBalance) || 0;
  const pendingWithdraw = parseFloat(stats.pendingWithdraw) || 0;
  const totalWithdrawn = withdrawHistory
    .filter((w: any) => w.status === "APPROVED")
    .reduce((sum: number, w: any) => sum + parseFloat(w.amount), 0);
  
  const deliveryRate = stats.totalAssigned > 0 
    ? ((stats.totalDelivered / stats.totalAssigned) * 100).toFixed(1)
    : 0;
  
  const averageEarningsPerDelivery = stats.totalDelivered > 0
    ? (totalEarned / stats.totalDelivered).toFixed(2)
    : 0;

  // Group withdrawals by month for trend analysis
  const withdrawalsByMonth = withdrawHistory.reduce((acc: any, w: any) => {
    const date = new Date(w.createdAt);
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[monthYear]) {
      acc[monthYear] = { amount: 0, count: 0 };
    }
    acc[monthYear].amount += parseFloat(w.amount);
    acc[monthYear].count += 1;
    return acc;
  }, {});

  const monthlyTrends = Object.entries(withdrawalsByMonth)
    .map(([month, data]: [string, any]) => ({ month, ...data }))
    .slice(-6)
    .reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
        
        {/* Header Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
              Earnings Overview
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Earnings <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Analytics</span>
          </h1>
          <p className="text-sm text-gray-400 max-w-2xl">
            Track your earnings, delivery performance, and withdrawal history all in one place.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Total Earnings</span>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                ${totalEarned.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Lifetime earnings</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Wallet className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Withdrawable</span>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                ${withdrawableBalance.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Ready for withdrawal</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Pending</span>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                ${pendingWithdraw.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Under processing</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <History className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Total Withdrawn</span>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                ${totalWithdrawn.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Successfully paid out</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Delivery Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Completed Deliveries</span>
                <span className="text-lg font-bold text-white">{stats.totalDelivered}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Total Assigned</span>
                <span className="text-lg font-bold text-white">{stats.totalAssigned}</span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Delivery Rate</span>
                  <span className="text-lg font-bold text-emerald-400">{deliveryRate}%</span>
                </div>
                <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${deliveryRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Earnings Metrics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Avg. per Delivery</span>
                <span className="text-lg font-bold text-white">${averageEarningsPerDelivery}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Pending Payout</span>
                <span className="text-lg font-bold text-amber-400">${pendingWithdraw.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-xs text-gray-400">Net Received</span>
                <span className="text-lg font-bold text-emerald-400">${totalWithdrawn.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Next Milestone</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Next Payout Goal</span>
                <span className="text-lg font-bold text-white">${withdrawableBalance >= 1000 ? "Ready!" : "1,000"}</span>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-400 mb-2">Progress to $1,000</p>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (withdrawableBalance / 1000) * 100)}%` }}
                  />
                </div>
              </div>
              {withdrawableBalance >= 1000 && (
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/20">
                  Ready for withdrawal!
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        {monthlyTrends.length > 0 && (
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Monthly Withdrawal Trends</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {monthlyTrends.map((trend) => (
                <div key={trend.month} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-400 mb-2">{trend.month}</p>
                  <p className="text-xl font-bold text-white mb-1">${trend.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{trend.count} withdrawal{trend.count !== 1 ? 's' : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Withdrawal History Section */}
        {withdrawHistory.length > 0 && (
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Withdrawal History</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Method</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Account</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {withdrawHistory.map((item: any) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        ${parseFloat(item.amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{item.method}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-400">{item.accountNumber}</td>
                      <td className="px-6 py-4">
                        <Badge className={`
                          ${item.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                          ${item.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                          ${item.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                        `}>
                          {item.status || 'PENDING'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {withdrawHistory.length === 0 && (
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
              <PiggyBank className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Withdrawal History Yet</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Your withdrawal transactions will appear here once you make your first withdrawal request.
            </p>
          </div>
        )}

        {/* Quick Action */}
        <div className="flex justify-end">
          <a href="/rider-dashboard/withdraw">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20">
              <Wallet className="w-4 h-4" />
              Request Withdrawal
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
