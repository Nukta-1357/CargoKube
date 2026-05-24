import { motion } from 'framer-motion';
import { Server, Plus, Activity, MapPin, Zap, Cpu, HardDrive } from 'lucide-react';
import { useState } from 'react';

const clusters = [
  {
    id: '1',
    name: 'Production Cluster - Mumbai',
    region: 'Mumbai',
    status: 'active',
    nodes: 8,
    pods: 45,
    cpu: 72,
    memory: 68,
    carbonIntensity: 450,
    renewable: 35,
  },
  {
    id: '2',
    name: 'Production Cluster - Karnataka',
    region: 'Karnataka',
    status: 'active',
    nodes: 12,
    pods: 72,
    cpu: 45,
    memory: 52,
    carbonIntensity: 120,
    renewable: 85,
  },
  {
    id: '3',
    name: 'Development Cluster - Delhi',
    region: 'Delhi',
    status: 'active',
    nodes: 4,
    pods: 18,
    cpu: 38,
    memory: 41,
    carbonIntensity: 380,
    renewable: 45,
  },
  {
    id: '4',
    name: 'Staging Cluster - Chennai',
    region: 'Chennai',
    status: 'idle',
    nodes: 2,
    pods: 6,
    cpu: 12,
    memory: 18,
    carbonIntensity: 180,
    renewable: 72,
  },
];

export default function Clusters() {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Clusters</h1>
          <p className="text-gray-400 mt-1">Manage your Kubernetes clusters</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5" />
          <span>Add Cluster</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clusters.map((cluster, i) => (
          <motion.div
            key={cluster.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedCluster(selectedCluster === cluster.id ? null : cluster.id)}
            className={`glass-card rounded-xl p-6 cursor-pointer transition-all ${
              selectedCluster === cluster.id
                ? 'border-green-500/50 bg-green-500/10'
                : 'hover:border-white/20'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Server className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">{cluster.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{cluster.region}</span>
                </div>
              </div>

              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                cluster.status === 'active'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
                {cluster.status}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{cluster.nodes}</p>
                <p className="text-xs text-gray-400">Nodes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{cluster.pods}</p>
                <p className="text-xs text-gray-400">Pods</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${
                  cluster.carbonIntensity < 200 ? 'text-green-400' :
                  cluster.carbonIntensity < 300 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {cluster.carbonIntensity}
                </p>
                <p className="text-xs text-gray-400">gCO₂</p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> CPU
                  </span>
                  <span className="text-white">{cluster.cpu}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                    style={{ width: `${cluster.cpu}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400 flex items-center gap-1">
                    <HardDrive className="w-3 h-3" /> Memory
                  </span>
                  <span className="text-white">{cluster.memory}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400"
                    style={{ width: `${cluster.memory}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Renewable
                  </span>
                  <span className="text-white">{cluster.renewable}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
                    style={{ width: `${cluster.renewable}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedCluster && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            {clusters.find((c) => c.id === selectedCluster)?.name} Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
              <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {clusters.find((c) => c.id === selectedCluster)?.nodes}
              </p>
              <p className="text-sm text-gray-400">Active Nodes</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
              <Server className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {clusters.find((c) => c.id === selectedCluster)?.pods}
              </p>
              <p className="text-sm text-gray-400">Running Pods</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {clusters.find((c) => c.id === selectedCluster)?.renewable}%
              </p>
              <p className="text-sm text-gray-400">Renewable Energy</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
