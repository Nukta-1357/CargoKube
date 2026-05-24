import { motion } from 'framer-motion';
import { Server, Circle, Activity, Cpu, HardDrive, Wifi } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NodeData {
  id: number;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  cpu: number;
  memory: number;
  pods: number;
  region: string;
  x: number;
  y: number;
}

const nodes: NodeData[] = [
  { id: 1, name: 'node-karnataka-1', status: 'healthy', cpu: 45, memory: 62, pods: 12, region: 'Karnataka', x: 20, y: 30 },
  { id: 2, name: 'node-karnataka-2', status: 'healthy', cpu: 38, memory: 55, pods: 8, region: 'Karnataka', x: 35, y: 45 },
  { id: 3, name: 'node-mumbai-1', status: 'healthy', cpu: 72, memory: 68, pods: 15, region: 'Mumbai', x: 55, y: 25 },
  { id: 4, name: 'node-mumbai-2', status: 'warning', cpu: 85, memory: 78, pods: 18, region: 'Mumbai', x: 70, y: 40 },
  { id: 5, name: 'node-delhi-1', status: 'healthy', cpu: 52, memory: 48, pods: 10, region: 'Delhi', x: 40, y: 60 },
  { id: 6, name: 'node-chennai-1', status: 'healthy', cpu: 31, memory: 41, pods: 6, region: 'Chennai', x: 65, y: 65 },
];

export default function ClusterTopology() {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [pulses, setPulses] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomNode = Math.floor(Math.random() * nodes.length);
      setPulses((prev) => [...prev.slice(-10), randomNode]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-cyan-400" />
            Live Cluster Topology
          </h2>
          <p className="text-sm text-gray-400 mt-1">Real-time node visualization</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Circle className="w-3 h-3 text-green-400 fill-green-400" />
            <span className="text-xs text-gray-400">Healthy</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-400">Warning</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="w-3 h-3 text-red-400 fill-red-400" />
            <span className="text-xs text-gray-400">Critical</span>
          </div>
        </div>
      </div>

      <div className="relative h-80 bg-black/20 rounded-lg border border-white/10 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          {nodes.map((node, i) =>
            nodes.slice(i + 1).map((target) => (
              <motion.line
                key={`${node.id}-${target.id}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="rgba(34, 197, 94, 0.2)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            ))
          )}
        </svg>

        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setSelectedNode(node)}
          >
            <div className={`relative ${getStatusColor(node.status)} rounded-lg p-3 shadow-lg`}>
              {pulses.includes(node.id) && (
                <motion.div
                  className={`absolute inset-0 ${getStatusColor(node.status)} rounded-lg`}
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1 }}
                />
              )}
              <Server className="w-6 h-6 text-white" />
            </div>
            <div className="mt-2 text-center">
              <p className="text-xs text-white font-medium whitespace-nowrap">{node.name}</p>
              <p className="text-xs text-gray-400">{node.region}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-lg bg-black/30 border border-white/10"
        >
          <h3 className="text-white font-semibold mb-2">{selectedNode.name}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-400">CPU: {selectedNode.cpu}%</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Memory: {selectedNode.memory}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Pods: {selectedNode.pods}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Region: {selectedNode.region}</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
