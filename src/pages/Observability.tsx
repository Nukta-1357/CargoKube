import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Check, Cpu, Clock } from 'lucide-react';
import { useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const metricsData = {
  cpu: Array(50).fill(0).map((_, i) => ({
    time: `${i}m`,
    value: 40 + Math.sin(i * 0.3) * 20 + Math.random() * 15,
  })),
  memory: Array(50).fill(0).map((_, i) => ({
    time: `${i}m`,
    value: 60 + Math.cos(i * 0.2) * 15 + Math.random() * 10,
  })),
  network: Array(50).fill(0).map((_, i) => ({
    time: `${i}m`,
    value: 100 + Math.random() * 50,
  })),
  pods: Array(50).fill(0).map((_, i) => ({
    time: `${i}m`,
    value: 120 + Math.sin(i * 0.4) * 10 + Math.random() * 5,
  })),
};

const healthChecks = [
  { name: 'API Server', status: 'healthy', latency: '23ms' },
  { name: 'Scheduler', status: 'healthy', latency: '12ms' },
  { name: 'Controller Manager', status: 'healthy', latency: '18ms' },
  { name: 'etcd', status: 'healthy', latency: '5ms' },
  { name: 'DNS Service', status: 'healthy', latency: '8ms' },
];

export default function Observability() {
  const [activeMetric, setActiveMetric] = useState<'cpu' | 'memory' | 'network' | 'pods'>('cpu');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');

  const colors = {
    cpu: '#06b6d4',
    memory: '#22c55e',
    network: '#eab308',
    pods: '#a855f7',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Observability</h1>
          <p className="text-gray-400 mt-1">Real-time cluster monitoring and metrics</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400">All Systems Operational</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthChecks.map((check, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{check.name}</span>
              {check.status === 'healthy' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
              )}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{check.latency}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {(['cpu', 'memory', 'network', 'pods'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setActiveMetric(metric)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeMetric === metric
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {metric}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {(['1h', '6h', '24h', '7d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeRange === range
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metricsData[activeMetric]}>
              <defs>
                <linearGradient id={`color-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[activeMetric]} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={colors[activeMetric]} stopOpacity={0} />
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
                stroke={colors[activeMetric]}
                strokeWidth={2}
                fill={`url(#color-${activeMetric})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Resource Utilization</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">CPU</span>
                <span className="text-white">62%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 w-[62%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Memory</span>
                <span className="text-white">71%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-400 w-[71%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Network I/O</span>
                <span className="text-white">45%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 w-[45%]" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Pod Health</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-3xl font-bold text-green-400">127</p>
              <p className="text-xs text-gray-400 mt-1">Running</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <p className="text-3xl font-bold text-cyan-400">3</p>
              <p className="text-xs text-gray-400 mt-1">Pending</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-xs text-gray-400 mt-1">Failed</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-3xl font-bold text-white">45ms</p>
              <p className="text-xs text-gray-400 mt-1">Avg Latency</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Recent Events</h3>
          </div>
          <div className="space-y-3">
            {[
              { time: '2m ago', event: 'Pod scheduled to karnataka-1', type: 'success' },
              { time: '5m ago', event: 'Carbon intensity spike detected in Mumbai', type: 'warning' },
              { time: '12m ago', event: 'Workload migration completed', type: 'success' },
              { time: '18m ago', event: 'New node added to cluster', type: 'info' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  item.type === 'success' ? 'bg-green-400' :
                  item.type === 'warning' ? 'bg-yellow-400' :
                  'bg-cyan-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-white">{item.event}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
