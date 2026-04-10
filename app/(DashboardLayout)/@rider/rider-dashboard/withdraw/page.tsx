"use client";

import { createWithdrawAction } from "@/actions/rider.action";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  ArrowUpRight, 
  Smartphone, 
  Banknote, 
  ShieldCheck, 
  Info,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { useState, useTransition, useEffect } from "react";

const METHODS = [
  { id: "BKASH", label: "bKash", pattern: "^(01[3-9]\\d{8})$", placeholder: "01XXXXXXXXX", example: "017xxxxxxxx" },
  { id: "NAGAD", label: "Nagad", pattern: "^(01[3-9]\\d{8})$", placeholder: "01XXXXXXXXX", example: "017xxxxxxxx" },
  { id: "ROCKET", label: "Rocket (DBBL)", pattern: "^\\d{10,17}$", placeholder: "XXXXXXXXXX", example: "1234567890" },
  { id: "BANK", label: "Bank Transfer", pattern: "^[A-Z0-9]{5,20}$", placeholder: "Account Number", example: "ACCT123456" },
];

const MIN_WITHDRAWAL = 100;
const MAX_WITHDRAWAL = 50000;

// Define response type
interface WithdrawResponse {
  success: boolean;
  message: string;
  errors?: {
    amount?: string;
    method?: string;
    accountNumber?: string;
  };
}

export default function WithdrawPage() {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    amount: "",
    method: "",
    accountNumber: ""
  });
  const [errors, setErrors] = useState({
    amount: "",
    method: "",
    accountNumber: ""
  });
  const [touched, setTouched] = useState({
    amount: false,
    method: false,
    accountNumber: false
  });
  const [success, setSuccess] = useState(false);
  const [balance, setBalance] = useState(0); // This would come from your API

  const validateAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (!amount) return "Amount is required";
    if (isNaN(numAmount)) return "Please enter a valid number";
    if (numAmount < MIN_WITHDRAWAL) return `Minimum withdrawal amount is $ ${MIN_WITHDRAWAL}`;
    if (numAmount > MAX_WITHDRAWAL) return `Maximum withdrawal amount is $ ${MAX_WITHDRAWAL}`;
    if (numAmount > balance && balance > 0) return `Insufficient balance. Available: $ ${balance}`;
    if (numAmount % 1 !== 0) return "Amount must be a whole number";
    return "";
  };

  const validateMethod = (method: string) => {
    if (!method) return "Please select a withdrawal method";
    return "";
  };

  const validateAccountNumber = (accountNumber: string, method: string) => {
    if (!accountNumber) return "Account/Wallet number is required";
    
    const selectedMethod = METHODS.find(m => m.id === method);
    if (selectedMethod && selectedMethod.pattern) {
      const regex = new RegExp(selectedMethod.pattern);
      if (!regex.test(accountNumber)) {
        if (method === "BKASH" || method === "NAGAD") {
          return "Please enter a valid Bangladeshi mobile number (01XXXXXXXXX)";
        }
        if (method === "ROCKET") {
          return "Please enter a valid Rocket account number (10-17 digits)";
        }
        return `Please enter a valid ${selectedMethod.label} account number`;
      }
    }
    
    return "";
  };

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "amount":
        return validateAmount(value);
      case "method":
        return validateMethod(value);
      case "accountNumber":
        return validateAccountNumber(value, formData.method);
      default:
        return "";
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate on change
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    const amountError = validateAmount(formData.amount);
    const methodError = validateMethod(formData.method);
    const accountError = validateAccountNumber(formData.accountNumber, formData.method);
    
    setErrors({
      amount: amountError,
      method: methodError,
      accountNumber: accountError
    });
    
    setTouched({
      amount: true,
      method: true,
      accountNumber: true
    });
    
    return !amountError && !methodError && !accountError;
  };

  const resetForm = () => {
    setFormData({ amount: "", method: "", accountNumber: "" });
    setErrors({ amount: "", method: "", accountNumber: "" });
    setTouched({ amount: false, method: false, accountNumber: false });
    const form = document.getElementById("withdraw-form") as HTMLFormElement;
    if (form) form.reset();
  };

  async function handleSubmit(formDataObj: FormData) {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createWithdrawAction(formDataObj) as WithdrawResponse;
        
        if (res.success) {
          setSuccess(true);
          toast.success(res.message || "Withdrawal request submitted successfully!");
          resetForm();
          
          // Clear success after 5 seconds
          setTimeout(() => setSuccess(false), 5000);
        } else {
          toast.error(res.message || "Failed to submit withdrawal request");
          
          // Handle field-specific errors from server
          if (res.errors) {
            setErrors(prev => ({
              ...prev,
              amount: res.errors?.amount || prev.amount,
              method: res.errors?.method || prev.method,
              accountNumber: res.errors?.accountNumber || prev.accountNumber
            }));
          }
        }
      } catch (error) {
        console.error("Withdrawal error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  }

  const selectedMethod = METHODS.find(m => m.id === formData.method);
  const amountNum = parseFloat(formData.amount);
  const isValidAmount = !errors.amount && amountNum >= MIN_WITHDRAWAL && amountNum <= MAX_WITHDRAWAL && amountNum <= balance;
  const isFormValid = formData.amount && formData.method && formData.accountNumber && 
                      !errors.amount && !errors.method && !errors.accountNumber;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        
        {/* Header Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Wallet className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
              Financial Operations
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Withdraw <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Assets</span>
          </h1>
          <p className="text-sm text-gray-400 max-w-2xl">
            Securely transfer your earnings to your preferred payment method. All withdrawals are processed within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Withdrawal Form */}
          <div className="lg:col-span-2">
            <form 
              id="withdraw-form"
              action={handleSubmit}
              className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-8 shadow-2xl"
            >
              {/* Success Overlay */}
              {success && (
                <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm flex items-center justify-center z-10 animate-in fade-in duration-300">
                  <div className="bg-gray-900 rounded-2xl p-8 text-center border border-emerald-500/20 shadow-2xl max-w-sm mx-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Withdrawal Requested!</h3>
                    <p className="text-sm text-gray-400">
                      Your request has been submitted successfully. You will receive an update within 24 hours.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Decorative Gradient */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
              
              <div className="relative space-y-6">
                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Banknote className="w-4 h-4" />
                    Withdrawal Amount (BDT)
                  </label>
                  <div className="relative">
                    <input
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      onBlur={() => handleBlur("amount")}
                      placeholder={`Min. ${MIN_WITHDRAWAL} | Max. ${MAX_WITHDRAWAL}`}
                      step="1"
                      min={MIN_WITHDRAWAL}
                      max={MAX_WITHDRAWAL}
                      className={`w-full bg-gray-900/50 border rounded-2xl h-14 px-6 text-lg font-semibold text-white outline-none transition-all placeholder:text-gray-600
                        ${touched.amount && errors.amount 
                          ? "border-red-500/50 focus:border-red-500" 
                          : isValidAmount && formData.amount
                            ? "border-emerald-500/50 focus:border-emerald-500" 
                            : "border-white/10 focus:border-emerald-500/30"
                        }`}
                      suppressHydrationWarning
                    />
                    {isValidAmount && formData.amount && (
                      <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  {touched.amount && errors.amount && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.amount}
                    </p>
                  )}
                  {!errors.amount && formData.amount && amountNum > 0 && (
                    <p className="text-xs text-gray-500">
                      You will receive: <span className="text-emerald-400 font-semibold">${amountNum}</span> (no processing fees)
                    </p>
                  )}
                </div>

                {/* Method Select */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Transfer Method
                  </label>
                  <select
                    name="method"
                    value={formData.method}
                    onChange={(e) => handleInputChange("method", e.target.value)}
                    onBlur={() => handleBlur("method")}
                    className={`w-full bg-gray-900/50 border rounded-2xl h-14 px-6 text-sm text-white outline-none transition-all cursor-pointer
                      ${touched.method && errors.method 
                        ? "border-red-500/50 focus:border-red-500" 
                        : "border-white/10 focus:border-emerald-500/30"
                      }`}
                  >
                    <option value="" disabled>Select Payment Gateway</option>
                    {METHODS.map(m => (
                      <option key={m.id} value={m.id} className="bg-gray-900 text-white">
                        {m.label}
                      </option>
                    ))}
                  </select>
                  {touched.method && errors.method && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.method}
                    </p>
                  )}
                </div>

                {/* Account Number Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    {selectedMethod ? `${selectedMethod.label} Account Number` : "Account / Wallet Number"}
                  </label>
                  <div className="relative">
                    <input
                      name="accountNumber"
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                      onBlur={() => handleBlur("accountNumber")}
                      placeholder={selectedMethod?.placeholder || "Enter your account number"}
                      className={`w-full bg-gray-900/50 border rounded-2xl h-14 px-6 text-sm font-mono text-white outline-none transition-all
                        ${touched.accountNumber && errors.accountNumber 
                          ? "border-red-500/50 focus:border-red-500" 
                          : "border-white/10 focus:border-emerald-500/30"
                        }`}
                      suppressHydrationWarning
                    />
                  </div>
                  {touched.accountNumber && errors.accountNumber && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.accountNumber}
                    </p>
                  )}
                  {selectedMethod && formData.accountNumber && !errors.accountNumber && (
                    <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Valid {selectedMethod.label} account format (e.g., {selectedMethod.example})
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  disabled={isPending || success || !isFormValid}
                  className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl font-bold uppercase text-xs tracking-wider transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Processing Request...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="mr-2" />
                      Request Submitted
                    </>
                  ) : (
                    <>
                      Authorize Payout
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                {/* Quick Actions */}
                <div className="pt-4 flex justify-between items-center text-xs border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => handleInputChange("amount", "500")}
                    className="text-gray-500 hover:text-emerald-400 transition-colors px-3 py-1 rounded-lg hover:bg-white/5"
                  >
                    + $500
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange("amount", "1000")}
                    className="text-gray-500 hover:text-emerald-400 transition-colors px-3 py-1 rounded-lg hover:bg-white/5"
                  >
                    + $1,000
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange("amount", "5000")}
                    className="text-gray-500 hover:text-emerald-400 transition-colors px-3 py-1 rounded-lg hover:bg-white/5"
                  >
                    + $5,000
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
              <div className="flex items-center gap-2 mb-3">
               
                 <p className="text-3xl text-gray-400 uppercase tracking-wider">Withdrawal Policy</p> 
              </div>
              {/* <p className="text-3xl font-bold text-white">${balance.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">
                {balance >= MIN_WITHDRAWAL 
                  ? "You can withdraw up to ${Math.min(balance, MAX_WITHDRAWAL)}" 
                  : "Add more earnings to reach minimum withdrawal"}
              </p> */}
            </div>

            {/* Policy Card */}
            <div className="rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-emerald-500/10">
                  <Info className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white uppercase tracking-wider text-sm">
                  Withdrawal Policy
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                    Limits
                  </p>
                  <ul className="space-y-2 text-xs text-gray-400">
                    <li className="flex justify-between">
                      <span>Minimum:</span>
                      <span className="text-white font-semibold">${MIN_WITHDRAWAL}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Maximum:</span>
                      <span className="text-white font-semibold">${MAX_WITHDRAWAL}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Processing Fee:</span>
                      <span className="text-emerald-400">Free</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-3">
                    Processing Time
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>24 hours (Business Days)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                    Important Notes
                  </p>
                  <ul className="space-y-2 text-xs text-gray-400">
                    <li className="flex gap-2">
                      <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>Double-check account details before submitting</span>
                    </li>
                    <li className="flex gap-2">
                      <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>Withdrawals are verified before processing</span>
                    </li>
                    <li className="flex gap-2">
                      <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>Contact support for any issues or delays</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}