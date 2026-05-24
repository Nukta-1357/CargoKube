import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Globe, ArrowUpDown, Users } from 'lucide-react';

interface ServiceNodeData {
  label: string;
  type: 'LoadBalancer' | 'ClusterIP' | 'NodePort';
  port: number;
  targetPort: number;
  endpoints: number;
  traffic: 'low' | 'medium' | 'high';
  isHighlighted?: boolean;
}

interface ServiceNodeProps {
  data: ServiceNodeData;
  selected?: boolean;
}

export const ServiceNode = memo(({ data, selected }: ServiceNodeProps) => {
  const trafficColors = {
    low: { border: 'border-blue-500/50', bg: 'from-blue-500/20 to-blue-500/5', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]' },
    medium: { border: 'border-cyan-500/50', bg: 'from-cyan-500/20 to-cyan-500/5', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]' },
    high: { border: 'border-yellow-500/50', bg: 'from-yellow-500/20 to-yellow-500/5', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]' },
  };

  const colors = trafficColors[data.traffic] || trafficColors.medium;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div
        className={`relative min-w-[180px] rounded-xl bg-gradient-to-br ${colors.bg} backdrop-blur-xl border ${colors.border} p-4 ${
          selected || data.isHighlighted ? colors.glow : ''
        } transition-all duration-300`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center">
            <Globe className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{data.label}</p>
            <p className="text-xs text-gray-400">{data.type}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3 h-3 text-cyan-400" />
            <div>
              <p className="text-gray-400">Port</p>
              <p className="text-white font-medium">{data.port}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-green-400" />
            <div>
              <p className="text-gray-400">Endpoints</p>
              <p className="text-white font-medium">{data.endpoints}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Traffic Load</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((level) => (
                <motion.div
                  key={level}
                  className={`w-6 h-1.5 rounded ${
                    level <= (data.traffic === 'low' ? 1 : data.traffic === 'medium' ? 2 : 3)
                      ? 'bg-gradient-to-r from-cyan-500 to-green-400'
                      : 'bg-white/10'
                  }`}
                  animate={level <= 2 && data.traffic === 'high' ? {
                    opacity: [1, 0.5, 1],
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              ))}
            </div>
          </div>
        </div>

        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-blue-500/50 !border-2 !border-blue-400"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-cyan-500/50 !border-2 !border-cyan-400"
        />
      </div>
    </motion.div>
  );
});

ServiceNode.displayName = 'ServiceNode';
