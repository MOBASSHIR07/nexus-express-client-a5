"use client";

import { useEffect, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ParcelSearchBar({ initialSearchTerm }: { initialSearchTerm: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialSearchTerm);
  const [isPending, startTransition] = useTransition();

  const currentQuery = searchParams?.get("searchTerm")?.trim() || "";
  const currentPage = searchParams?.get("page") || "1";

  useEffect(() => {
    setValue(initialSearchTerm);
  }, [initialSearchTerm]);

  useEffect(() => {
    const trimmed = value.trim();
    const shouldUpdate = trimmed !== currentQuery || currentPage !== "1";
    if (!shouldUpdate) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (trimmed) {
        params.set("searchTerm", trimmed);
      } else {
        params.delete("searchTerm");
      }
      params.set("page", "1");

      const href = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      startTransition(() => router.replace(href));
    }, 300);

    return () => clearTimeout(timer);
  }, [value, currentQuery, currentPage, pathname, router, searchParams]);

  return (
    <div className="relative w-full lg:w-96">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search Parcel ID or Title..."
        className="w-full bg-[#0b0b11] border border-white/5 rounded-2xl pl-14 pr-12 h-16 text-sm text-white outline-none focus:border-[#00F5A0]/30 focus:ring-1 focus:ring-[#00F5A0]/20 transition-all"
        suppressHydrationWarning
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      )}
      {isPending && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">...</div>
      )}
    </div>
  );
}
