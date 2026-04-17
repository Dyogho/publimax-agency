"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BudgetROIChartProps {
  data: {
    name: string;
    budget: number;
    expectedReturn: number;
  }[];
}

export function BudgetROIChart({ data }: BudgetROIChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#9ca3af' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => `$${Number(value).toLocaleString()}`}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
          <Bar 
            name="Presupuesto Invertido" 
            dataKey="budget" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]} 
            barSize={24}
          />
          <Bar 
            name="Retorno Proyectado" 
            dataKey="expectedReturn" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]} 
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
