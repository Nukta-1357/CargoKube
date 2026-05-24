import { motion } from 'framer-motion';
import { Video as LucideIcon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  data?: Array<{ value: number }>;
  color?: 'green' | 'cyan' | 'red' | 'yellow';
}

const colorMap = {
  green: {
    bg: 'from-green-500/20 to-green-500/5',
    border: 'border-green-500/30',
    text: 'text-green-400',
    glow: 'neon-glow',
    chart: '#22c55e',
  },
  cyan: {
    bg: 'from-cyan-500/20 to-cyan-500/5',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    glow: 'cyan-glow',
    chart: '#06b6d4',
  },
  red: {
    bg: 'from-red-500/20 to-red-500/5',
    border: 'border-red-500/30',
    text: 'text-red-400',
    glow: '',
    chart: '#ef4444',
  },
  yellow: {
    bg: 'from-yellow-500/20 to-yellow-500/5',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    glow: '',
    chart: '#eab308',
  },
};

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  data = [],
  color = 'green',
}: KPICardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colors.bg} backdrop-blur-xl border ${colors.border} p-6 ${colors.glow}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`rounded-lg p-2 bg-white/10 ${colors.text}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== undefined && (
          <div className={`text-sm font-medium ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? '+' : ''}
            {trend}%
          </div>
        )}
      </div>

      <div className="mb-2">
        <h3 className="text-sm text-gray-400 font-medium">{title}</h3>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>

      {data.length > 0 && (
        <div className="h-12 mt-4 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={colors.chart}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
        style={{ transform: 'skewX(-20deg) translateX(-150%)' }}
        animate={{ translateX: ['-100%', '200%'] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 8 }}
      />
    </motion.div>
  );
}
