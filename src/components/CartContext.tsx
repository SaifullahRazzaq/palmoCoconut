"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { VARIANTS, type Variant } from "@/lib/products";

type Line = { id: string; qty: number };

type Cart = {
  lines: (Line & { variant: Variant })[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
};

const CartCtx = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);

  const add = useCallback((id: string, qty = 1) => {
    setRaw((ls) => {
      const hit = ls.find((l) => l.id === id);
      return hit ? ls.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l)) : [...ls, { id, qty }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setRaw((ls) => (qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty } : l))));
  }, []);

  const value = useMemo<Cart>(() => {
    const lines = raw.map((l) => ({ ...l, variant: VARIANTS.find((v) => v.id === l.id)! }));
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.qty * l.variant.price, 0),
      open,
      setOpen,
      add,
      setQty,
    };
  }, [raw, open, add, setQty]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart outside CartProvider");
  return ctx;
}
