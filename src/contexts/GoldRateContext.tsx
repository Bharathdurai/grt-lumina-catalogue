import { createContext, useContext, useState, ReactNode } from "react";

interface GoldRateContextType {
  goldRate: number;
  setGoldRate: (rate: number) => void;
  discountPerGram: number;
  setDiscountPerGram: (d: number) => void;
  makingChargePercent: number;
  setMakingChargePercent: (p: number) => void;
  calculateGoldPrice: (weightGrams: number) => {
    basePrice: number;
    makingCharge: number;
    discount: number;
    finalPrice: number;
  };
}

const GoldRateContext = createContext<GoldRateContextType | undefined>(undefined);

export const GoldRateProvider = ({ children }: { children: ReactNode }) => {
  const [goldRate, setGoldRate] = useState(6500); // ₹ per gram
  const [discountPerGram, setDiscountPerGram] = useState(150);
  const [makingChargePercent, setMakingChargePercent] = useState(8);

  const calculateGoldPrice = (weightGrams: number) => {
    const basePrice = goldRate * weightGrams;
    const makingCharge = (basePrice * makingChargePercent) / 100;
    const discount = discountPerGram * weightGrams;
    const finalPrice = basePrice + makingCharge - discount;
    return { basePrice, makingCharge, discount, finalPrice };
  };

  return (
    <GoldRateContext.Provider
      value={{ goldRate, setGoldRate, discountPerGram, setDiscountPerGram, makingChargePercent, setMakingChargePercent, calculateGoldPrice }}
    >
      {children}
    </GoldRateContext.Provider>
  );
};

export const useGoldRate = () => {
  const ctx = useContext(GoldRateContext);
  if (!ctx) throw new Error("useGoldRate must be used within GoldRateProvider");
  return ctx;
};
