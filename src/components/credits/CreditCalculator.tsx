"use client";

import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
};

interface CreditCalculatorProps {
  theme?: 'light' | 'dark';
}

export function CreditCalculator({ theme = 'light' }: CreditCalculatorProps) {
  const [amount, setAmount] = useState(50000000);
  const [term, setTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(1.5); // Monthly interest rate (e.g., 1.5%)

  const monthlyPayment = useMemo(() => {
    if (amount <= 0 || term <= 0) return 0;
    const monthlyRate = interestRate / 100;
    const numerator = amount * monthlyRate * Math.pow(1 + monthlyRate, term);
    const denominator = Math.pow(1 + monthlyRate, term) - 1;
    if (denominator === 0) return 0;
    return numerator / denominator;
  }, [amount, term, interestRate]);

  const isDark = theme === 'dark';

  return (
    <Card className={clsx(
      "w-full max-w-2xl mx-auto transition-colors duration-300",
      {
        'bg-gray-800 border-gray-700 text-white': isDark,
        'bg-white': !isDark
      }
    )}>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Calculadora de Crédito Vehicular</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Amount Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium">Monto del Préstamo</label>
              <span className="font-bold text-lg">{formatCurrency(amount)}</span>
            </div>
            <Slider
              value={[amount]}
              onValueChange={(value) => setAmount(value[0])}
              min={5000000}
              max={150000000}
              step={1000000}
            />
          </div>

          {/* Term Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium">Plazo</label>
              <span className="font-bold text-lg">{term} meses</span>
            </div>
            <Slider
              value={[term]}
              onValueChange={(value) => setTerm(value[0])}
              min={12}
              max={84}
              step={1}
            />
          </div>

          {/* Interest Rate Input */}
          <div>
            <label className="font-medium">Tasa de Interés Mensual (%)</label>
            <Input 
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              className={clsx("mt-2", {
                'bg-gray-700 border-gray-600 text-white': isDark
              })}
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-500">
          <div className="text-center">
            <p className={clsx("text-lg", { 'text-gray-300': isDark, 'text-gray-600': !isDark })}>Tu cuota mensual estimada es:</p>
            <p className={clsx("text-4xl font-extrabold my-2", { 'text-blue-400': isDark, 'text-blue-600': !isDark })}>{formatCurrency(monthlyPayment)}</p>
            <p className={clsx("text-xs", { 'text-gray-400': isDark, 'text-gray-500': !isDark })}>*Cálculo aproximado, no incluye seguros ni otros cargos.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}