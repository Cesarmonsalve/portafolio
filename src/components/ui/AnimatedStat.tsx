'use client';

interface AnimatedStatProps {
  value: string;
  label: string;
  index?: number;
  fontFamily?: string;
}

export default function AnimatedStat({ value, label, fontFamily }: AnimatedStatProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center border-r border-white/10 last:border-0">
      <div
        className="text-3xl font-black text-white"
        style={fontFamily ? { fontFamily: `${fontFamily}, sans-serif` } : undefined}
      >
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[.16em] text-gray-500 mt-1">{label}</div>
    </div>
  );
}
