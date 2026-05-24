import { motion } from 'framer-motion';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from 'recharts';
import { TrendingUp, Brain, Clock } from 'lucide-react';

const generateData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      hour: `${i.toString().padStart(2, '0')}:00`,
      predicted: Math.max(100, 300 + Math.sin(i * Math.PI / 6) * 150 - Math.random() * 30),
      actual: i < 12 ? Math.max(100, 280 + Math.sin(i * Math.PI / 6) * 130 + Math.random() * 20) : null,
      recommended: i >= 2 && i <= 6 || i >= 18 && i <= 22,
    });
  }
  return data;
};

export default function AIForecastChart() {
  const data = generateData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-cyan-400" />
            AI Carbon Forecast
          </h2>
          <p className="text-sm text-gray-400 mt-1">Predicted carbon intensity for next 24 hours</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
            <Clock className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Next 24h</span>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a0e1a',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)',
              }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#94a3b8' }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#colorPredicted)"
              name="Predicted Intensity"
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#colorActual)"
              name="Actual Intensity"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-400">Recommended scheduling window</span>
        </div>
        <div className="text-sm text-gray-400">
          <TrendingUp className="w-4 h-4 inline mr-1 text-green-400" />
          AI recommending scheduling between 02:00-06:00 and 18:00-22:00
        </div>
      </div>
    </motion.div>
  );
}
