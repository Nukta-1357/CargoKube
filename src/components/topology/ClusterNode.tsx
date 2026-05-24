import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Server, Activity, Cpu, HardDrive, Zap } from 'lucide-react';

interface ClusterNodeData {
  label: string;
  status: 'healthy' | 'warning' | 'critical';
  region: string;
  cpu: number;
  memory: number;
  pods: number;
  carbonIntensity: number;
  renewable: number;
  isHighlighted?: boolean;
}

interface ClusterNodeProps {
  data: ClusterNodeData;
  selected?: boolean;
}

export const ClusterNode = memo(({ data, selected }: ClusterNodeProps) => {
  const statusColors = {
    healthy: { border: 'border-green-500/50', glow: 'shadow-[0_0_30px_rgba(34,197,94,0.4)]', bg: 'from-green-500/20 to-green-500/5' },
    warning: { border: 'border-yellow-500/50', glow: 'shadow-[0_0_30px_rgba(234,179,8,0.4)]', bg: 'from-yellow-500/20 to-yellow-500/5' },
    critical: { border: 'border-red-500/50', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.4)]', bg: 'from-red-500/20 to-red-500/5' },
  };

  const colors = statusColors[data.status] || statusColors.healthy;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className="relative"
    >
      <div
        className={`relative min-w-[220px] rounded-xl bg-gradient-to-br ${colors.bg} backdrop-blur-xl border ${colors.border} p-4 ${
          selected || data.isHighlighted ? colors.glow : ''
        } transition-all duration-300`}
      >
        <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm border border-white/10">
          {data.region}
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <motion.div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                data.status === 'healthy' ? 'bg-green-500/30' :
                data.status === 'warning' ? 'bg-yellow-500/30' : 'bg-red-500/30'
              }`}
              animate={data.status === 'critical' ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Server className="w-5 h-5 text-white" />
            </motion.div>
            {data.status === 'healthy' && (
              <motion.div
                className="absolute inset-0 rounded-lg bg-green-500/20"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{data.label}</p>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                data.status === 'healthy' ? 'bg-green-400' :
                data.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
              }`}>
                {data.status === 'healthy' && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-400"
                    animate={{ scale: [1, 2], opacity: [1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
              <span className="text-xs text-gray-400 capitalize">{data.status}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> CPU
              </span>
              <span className={`font-medium ${
                data.cpu > 80 ? 'text-red-400' : data.cpu > 60 ? 'text-yellow-400' : 'text-cyan-400'
              }`}>{data.cpu}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${data.cpu}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400 flex items-center gap-1">
                <HardDrive className="w-3 h-3" /> Memory
              </span>
              <span className={`font-medium ${
                data.memory > 80 ? 'text-red-400' : data.memory > 60 ? 'text-yellow-400' : 'text-green-400'
              }`}>{data.memory}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-green-400"
                initial={{ width: 0 }}
                animate={{ width: `${data.memory}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-gray-400">
            <Activity className="w-3 h-3" />
            <span>{data.pods} pods</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className={data.carbonIntensity < 200 ? 'text-green-400' : data.carbonIntensity < 350 ? 'text-yellow-400' : 'text-red-400'}>
              {data.carbonIntensity}g
            </span>
          </div>
        </div>

        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-cyan-500/50 !border-2 !border-cyan-400"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-green-500/50 !border-2 !border-green-400"
        />
      </div>
    </motion.div>
  );
});

ClusterNode.displayName = 'ClusterNode';
