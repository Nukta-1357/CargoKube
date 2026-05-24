import { motion } from 'framer-motion';
import { Wind, Sun, TrendingDown, Leaf } from 'lucide-react';
import CarbonMapComponent from '../components/CarbonMap';

const regions = [
  {
    name: 'Karnataka',
    country: 'India',
    carbonIntensity: 120,
    renewablePercentage: 85,
    trend: -15,
    color: 'green',
  },
  {
    name: 'Mumbai',
    country: 'India',
    carbonIntensity: 450,
    renewablePercentage: 35,
    trend: 8,
    color: 'red',
  },
  {
    name: 'Delhi',
    country: 'India',
    carbonIntensity: 380,
    renewablePercentage: 45,
    trend: -3,
    color: 'orange',
  },
  {
    name: 'Chennai',
    country: 'India',
    carbonIntensity: 180,
    renewablePercentage: 72,
    trend: -12,
    color: 'green',
  },
  {
    name: 'Kolkata',
    country: 'India',
    carbonIntensity: 290,
    renewablePercentage: 55,
    trend: 2,
    color: 'yellow',
  },
  {
    name: 'Gujarat',
    country: 'India',
    carbonIntensity: 150,
    renewablePercentage: 78,
    trend: -8,
    color: 'green',
  },
];

export default function CarbonMapPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Carbon Intensity Map</h1>
          <p className="text-gray-400 mt-1">Real-time regional carbon monitoring</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-medium">
            India
          </button>
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 font-medium hover:bg-white/10">
            World
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CarbonMapComponent />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Regional Breakdown</h3>
          <div className="space-y-3">
            {regions.map((region, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{region.name}</span>
                  <span className={`text-xs font-medium ${
                    region.trend < 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {region.trend > 0 ? '+' : ''}{region.trend}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Intensity:</span>
                    <span className="ml-1 text-gray-300">{region.carbonIntensity} gCO₂</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Renewable:</span>
                    <span className="ml-1 text-gray-300">{region.renewablePercentage}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-xl"
        >
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Leaf className="w-5 h-5" />
            <span className="text-sm">Global Average</span>
          </div>
          <p className="text-3xl font-bold text-white">245 gCO₂/kWh</p>
          <p className="text-xs text-gray-500 mt-1">Current grid intensity</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 rounded-xl"
        >
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Wind className="w-5 h-5" />
            <span className="text-sm">Wind Energy</span>
          </div>
          <p className="text-3xl font-bold text-white">38%</p>
          <p className="text-xs text-gray-500 mt-1">Of total grid mix</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 rounded-xl"
        >
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <Sun className="w-5 h-5" />
            <span className="text-sm">Solar Energy</span>
          </div>
          <p className="text-3xl font-bold text-white">29%</p>
          <p className="text-xs text-gray-500 mt-1">Of total grid mix</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 rounded-xl"
        >
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm">Monthly Reduction</span>
          </div>
          <p className="text-3xl font-bold text-white">-12%</p>
          <p className="text-xs text-gray-500 mt-1">Compared to last month</p>
        </motion.div>
      </div>
    </div>
  );
}
