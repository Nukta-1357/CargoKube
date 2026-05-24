import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { MapPin, Zap, Wind, Leaf } from 'lucide-react';

interface CarbonRegionNodeData {
  label: string;
  region: string;
  carbonIntensity: number;
  renewable: number;
  recommended: boolean;
  isHighlighted?: boolean;
}

interface CarbonRegionNodeProps {
  data: CarbonRegionNodeData;
  selected?: boolean;
}

export const CarbonRegionNode = memo(({ data, selected }: CarbonRegionNodeProps) => {
  const intensityColor =
    data.carbonIntensity < 200 ? 'green' :
    data.carbonIntensity < 350 ? 'yellow' :
    data.carbonIntensity < 450 ? 'orange' : 'red';

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div
        className={`relative min-w-[180px] rounded-xl bg-gradient-to-br ${
          intensityColor === 'green' ? 'from-green-500/20 to-green-500/5' :
          intensityColor === 'yellow' ? 'from-yellow-500/20 to-yellow-500/5' :
          intensityColor === 'orange' ? 'from-orange-500/20 to-orange-500/5' :
          'from-red-500/20 to-red-500/5'
        } backdrop-blur-xl border ${
          intensityColor === 'green' ? 'border-green-500/50' :
          intensityColor === 'yellow' ? 'border-yellow-500/50' :
          intensityColor === 'orange' ? 'border-orange-500/50' :
          'border-red-500/50'
        } p-4 ${
          selected || data.isHighlighted ? 'shadow-[0_0_30px_rgba(34,197,94,0.4)]' : ''
        } transition-all duration-300`}
      >
        {data.recommended && (
          <motion.div
            className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/50"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Recommended
          </motion.div>
        )}

        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              intensityColor === 'green' ? 'bg-green-500/30' :
              intensityColor === 'yellow' ? 'bg-yellow-500/30' :
              intensityColor === 'orange' ? 'bg-orange-500/30' :
              'bg-red-500/30'
            }`}>
              <MapPin className="w-6 h-6 text-white" />
            </div>
            {intensityColor === 'green' && (
              <motion.div
                className="absolute inset-0 rounded-lg bg-green-500/20"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          <div>
            <p className="text-white font-semibold">{data.label}</p>
            <p className="text-xs text-gray-400">{data.region}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-2 rounded-lg bg-black/20 border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Carbon Intensity
              </span>
            </div>
            <p className={`text-2xl font-bold ${
              intensityColor === 'green' ? 'text-green-400' :
              intensityColor === 'yellow' ? 'text-yellow-400' :
              intensityColor === 'orange' ? 'text-orange-400' :
              'text-red-400'
            }`}>
              {data.carbonIntensity} <span className="text-sm font-normal">gCO₂/kWh</span>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Wind className="w-3 h-3" />
              Renewable Energy
            </span>
            <span className={`text-sm font-medium ${
              data.renewable > 70 ? 'text-green-400' :
              data.renewable > 40 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {data.renewable}%
            </span>
          </div>

          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${data.renewable}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {data.recommended && (
          <div className="mt-3 p-2 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">Optimal for carbon scheduling</span>
          </div>
        )}

        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-green-500/50 !border-2 !border-green-400"
        />
      </div>
    </motion.div>
  );
});

CarbonRegionNode.displayName = 'CarbonRegionNode';
