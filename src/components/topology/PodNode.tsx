import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Box, Activity } from 'lucide-react';

interface PodNodeData {
  label: string;
  status: 'running' | 'pending' | 'failed';
  namespace: string;
  cpu: number;
  memory: number;
  ready: number;
  total: number;
  isHighlighted?: boolean;
}

interface PodNodeProps {
  data: PodNodeData;
  selected?: boolean;
}

export const PodNode = memo(({ data, selected }: PodNodeProps) => {
  const statusColors = {
    running: { border: 'border-green-500/50', bg: 'from-green-500/20 to-green-500/5', pulse: 'bg-green-400' },
    pending: { border: 'border-yellow-500/50', bg: 'from-yellow-500/20 to-yellow-500/5', pulse: 'bg-yellow-400' },
    failed: { border: 'border-red-500/50', bg: 'from-red-500/20 to-red-500/5', pulse: 'bg-red-400' },
  };

  const colors = statusColors[data.status] || statusColors.running;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div
        className={`relative min-w-[160px] rounded-lg bg-gradient-to-br ${colors.bg} backdrop-blur-xl border ${colors.border} p-3 ${
          selected || data.isHighlighted ? 'shadow-[0_0_20px_rgba(34,197,94,0.3)]' : ''
        } transition-all duration-300`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="relative">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
              data.status === 'running' ? 'bg-green-500/30' :
              data.status === 'pending' ? 'bg-yellow-500/30' : 'bg-red-500/30'
            }`}>
              <Box className="w-4 h-4 text-white" />
            </div>
            {data.status === 'running' && (
              <motion.div
                className={`absolute inset-0 rounded-md ${colors.pulse}/20`}
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          <div>
            <p className="text-white font-medium text-xs">{data.label}</p>
            <p className="text-gray-400 text-xs">{data.namespace}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-400">
            <Activity className="w-3 h-3" />
            <span>{data.ready}/{data.total}</span>
          </div>
          <div className={`px-1.5 py-0.5 rounded text-xs ${
            data.status === 'running' ? 'bg-green-500/20 text-green-400' :
            data.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {data.status}
          </div>
        </div>

        <Handle
          type="target"
          position={Position.Top}
          className="!w-2 !h-2 !bg-cyan-500/50 !border-2 !border-cyan-400"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-2 !h-2 !bg-green-500/50 !border-2 !border-green-400"
        />
      </div>
    </motion.div>
  );
});

PodNode.displayName = 'PodNode';
