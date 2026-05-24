import { motion } from 'framer-motion';
import { MapPin, Zap } from 'lucide-react';

const regions = [
  { name: 'Karnataka', x: 15, y: 55, intensity: 120, renewable: 85, status: 'optimal' },
  { name: 'Mumbai', x: 18, y: 42, intensity: 450, renewable: 35, status: 'high' },
  { name: 'Delhi', x: 35, y: 25, intensity: 380, renewable: 45, status: 'medium' },
  { name: 'Chennai', x: 25, y: 68, intensity: 180, renewable: 72, status: 'good' },
  { name: 'Kolkata', x: 55, y: 45, intensity: 290, renewable: 55, status: 'medium' },
  { name: 'Gujarat', x: 10, y: 35, intensity: 150, renewable: 78, status: 'good' },
];


export default function CarbonMap() {
  const getIntensityColor = (intensity: number) => {
    if (intensity < 200) return 'from-green-500 to-green-400';
    if (intensity < 300) return 'from-yellow-500 to-yellow-400';
    if (intensity < 400) return 'from-orange-500 to-orange-400';
    return 'from-red-500 to-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass-card rounded-xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-cyan-400" />
            Carbon Intensity Map
          </h2>
          <p className="text-sm text-gray-400 mt-1">Real-time regional carbon intensity</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-sm font-medium">
            India
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/10">
            World
          </button>
        </div>
      </div>

      <div className="relative h-80 bg-black/30 rounded-lg border border-white/10 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-green-500/30 to-cyan-500/30" />

        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
        >
          {regions.map((region, i) => (
            <g key={i}>
              <motion.circle
                cx={region.x}
                cy={region.y}
                r="8"
                fill={`url(#gradient-${i})`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              />
              <defs>
                <radialGradient id={`gradient-${i}`}>
                  <stop offset="0%" stopColor={region.intensity < 200 ? '#22c55e' : region.intensity < 300 ? '#eab308' : '#ef4444'} />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
            </g>
          ))}
        </svg>

        {regions.map((region, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{ left: `${region.x}%`, top: `${region.y}%` }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              className={`w-6 h-6 rounded-full bg-gradient-to-br ${getIntensityColor(region.intensity)} flex items-center justify-center shadow-lg`}
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 10px rgba(34, 197, 94, 0.3)',
                  '0 0 20px rgba(34, 197, 94, 0.6)',
                  '0 0 10px rgba(34, 197, 94, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-3 h-3 text-white" />
            </motion.div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
              <p className="text-xs text-white font-medium">{region.name}</p>
              <p className="text-xs text-gray-400 text-center">{region.renewable}% renewable</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-green-400" />
          <div>
            <p className="text-xs text-gray-400">Optimal</p>
            <p className="text-sm text-white">&lt;200 gCO₂</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-400" />
          <div>
            <p className="text-xs text-gray-400">Good</p>
            <p className="text-sm text-white">200-300</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-orange-400" />
          <div>
            <p className="text-xs text-gray-400">Medium</p>
            <p className="text-sm text-white">300-400</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-red-400" />
          <div>
            <p className="text-xs text-gray-400">High</p>
            <p className="text-sm text-white">&gt;400</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
