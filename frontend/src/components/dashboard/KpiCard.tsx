import React from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

export default function KpiCard({ label, value, icon, color = 'bg-orange-100 text-orange-600' }: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 flex items-center justify-between hover:shadow-md transition">
      <div>
        <p className="text-xs text-stone-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  );
}