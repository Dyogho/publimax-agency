"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ReachGaugeProps {
  percent: number;
  label?: string;
}

export function ReachGauge({ percent, label }: ReachGaugeProps) {
  const data = [
    { value: percent },
    { value: 100 - percent }
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="h-[120px] w-[120px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={55}
              startAngle={90}
              endAngle={450}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill="#3b82f6" />
              <Cell fill="#e5e7eb" className="dark:fill-zinc-800" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-black dark:text-white">
            {Math.round(percent)}%
          </span>
        </div>
      </div>
      {label && (
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">{label}</p>
      )}
    </div>
  );
}
