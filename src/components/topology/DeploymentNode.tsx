import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Layers, Activity } from 'lucide-react';

interface DeploymentNodeData {
  label: string;
  replicas: number;
  readyReplicas: number;
  updatedReplicas: number;
  availableReplicas: number;
  strategy: 'RollingUpdate' | 'Recreate';
  isHighlighted?: boolean;
}

interface DeploymentNodeProps {
  data: DeploymentNodeData;
  selected?: boolean;
}

export const DeploymentNode = memo(({ data, selected }: DeploymentNodeProps) => {
  const healthPercentage = (data.readyReplicas / data.replicas) * 100;
  const isHealthy = healthPercentage >= 100;
  const isWarning = healthPercentage >= 50 && healthPercentage < 100;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div
        className={`relative min-w-[200px] rounded-xl bg-gradient-to-br ${
          isHealthy ? 'from-green-500/20 to-green-500/5' :
          isWarning ? 'from-yellow-500/20 to-yellow-500/5' :
          'from-red-500/20 to-red-500/5'
        } backdrop-blur-xl border ${
          isHealthy ? 'border-green-500/50' :
          isWarning ? 'border-yellow-500/50' :
          'border-red-500/50'
        } p-4 ${
          selected || data.isHighlighted ? 'shadow-[0_0_30px_rgba(34,197,94,0.4)]' : ''
        } transition-all duration-300`}
      >
        <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm border border-white/10 text-cyan-400">
          {data.strategy}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <motion.div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isHealthy ? 'bg-green-500/30' :
                isWarning ? 'bg-yellow-500/30' : 'bg-red-500/30'
              }`}
              animate={!isHealthy ? { rotate: [0, 360] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Layers className="w-5 h-5 text-white" />
            </motion.div>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{data.label}</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isHealthy ? 'bg-green-400' :
                isWarning ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
              <span className="text-xs text-gray-400">
                {data.readyReplicas}/{data.replicas} ready
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Progress</span>
            <span className={`${isHealthy ? 'text-green-400' : isWarning ? 'text-yellow-400' : 'text-red-400'} font-medium`}>
              {healthPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${healthPercentage}%` }}
              transition={{ duration: 1 }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <p className="text-cyan-400 font-medium">{data.updatedReplicas}</p>
            <p className="text-gray-400">Updated</p>
          </div>
          <div className="text-center">
            <p className="text-green-400 font-medium">{data.availableReplicas}</p>
            <p className="text-gray-400">Available</p>
          </div>
          <div className="text-center">
            <Activity className={`w-4 h-4 mx-auto mb-1 ${
              isHealthy ? 'text-green-400' : isWarning ? 'text-yellow-400' : 'text-red-400'
            }`} />
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

DeploymentNode.displayName = 'DeploymentNode';
