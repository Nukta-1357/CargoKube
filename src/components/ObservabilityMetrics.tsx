import { motion } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Cpu, HardDrive, Zap, Clock } from 'lucide-react';
import { useState } from 'react';

const metricsData = {
  cpu: Array(20).fill(0).map((_, i) => ({
    time: `${i}m`,
    value: 40 + Math.sin(i * 0.5) * 20 + Math.random() * 10,
  })),
  memory: Array(20).fill(0).map((_, i) => ({
    time: `${i}m`,
    value: 60 + Math.cos(i * 0.3) * 15 + Math.random() * 5,
  })),
  latency: Array(20).fill(0).map((_, i) => ({
    time: `${i}m`,
    value: 50 + Math.random() * 30,
  })),
  carbon: Array(20).fill(0).map((_, i) => ({
    time: `${i}m`,
    value: 200 + Math.sin(i * 0.4) * 80 + Math.random() * 40,
  })),
};

const tabs = [
  { id: 'cpu', label: 'CPU', icon: Cpu, color: '#06b6d4' },
  { id: 'memory', label: 'Memory', icon: HardDrive, color: '#22c55e' },
  { id: 'latency', label: 'Latency', icon: Clock, color: '#eab308' },
  { id: 'carbon', label: 'Carbon', icon: Zap, color: '#a855f7' },
];

export default function ObservabilityMetrics() {
  const [activeTab, setActiveTab] = useState('cpu');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card rounded-xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            Observability Metrics
          </h2>
          <p className="text-sm text-gray-400 mt-1">Real-time cluster performance</p>
        </div>

        <div className="flex items-center gap-1 bg-black/30 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" style={{ color: tab.color }} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metricsData[activeTab as keyof typeof metricsData]}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={tabs.find((t) => t.id === activeTab)?.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={tabs.find((t) => t.id === activeTab)?.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
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
            <Area
              type="monotone"
              dataKey="value"
              stroke={tabs.find((t) => t.id === activeTab)?.color}
              strokeWidth={2}
              fill="url(#colorMetric)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4">
        {tabs.map((tab) => (
          <div key={tab.id} className="text-center">
            <p className="text-xs text-gray-400">{tab.label}</p>
            <p className="text-lg font-bold text-white">
              {tab.id === 'cpu' && '62%'}
              {tab.id === 'memory' && '71%'}
              {tab.id === 'latency' && '45ms'}
              {tab.id === 'carbon' && '245g'}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
