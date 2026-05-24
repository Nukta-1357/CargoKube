import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Server,
  MapPin,
  RefreshCw,
  Brain,
  TrendingDown,
  Zap,
  AlertTriangle,
} from 'lucide-react';

import { ClusterNode } from '../components/topology/ClusterNode';
import { PodNode } from '../components/topology/PodNode';
import { ServiceNode } from '../components/topology/ServiceNode';
import { DeploymentNode } from '../components/topology/DeploymentNode';
import { CarbonRegionNode } from '../components/topology/CarbonRegionNode';
import { AnimatedEdge } from '../components/topology/AnimatedEdge';

const nodeTypes = {
  cluster: ClusterNode,
  pod: PodNode,
  service: ServiceNode,
  deployment: DeploymentNode,
  carbonRegion: CarbonRegionNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
};

interface ClusterData {
  label: string;
  status: 'healthy' | 'warning' | 'critical';
  region: string;
  cpu: number;
  memory: number;
  pods: number;
  carbonIntensity: number;
  renewable: number;
}

interface PodData {
  label: string;
  status: 'running' | 'pending' | 'failed';
  namespace: string;
  cpu: number;
  memory: number;
  ready: number;
  total: number;
}

const initialNodes: Node[] = [
  {
    id: 'region-karnataka',
    type: 'carbonRegion',
    position: { x: -400, y: 0 },
    data: {
      label: 'Karnataka Region',
      region: 'South India',
      carbonIntensity: 120,
      renewable: 85,
      recommended: true,
    },
  },
  {
    id: 'region-mumbai',
    type: 'carbonRegion',
    position: { x: -400, y: 300 },
    data: {
      label: 'Mumbai Region',
      region: 'West India',
      carbonIntensity: 450,
      renewable: 35,
      recommended: false,
    },
  },
  {
    id: 'cluster-1',
    type: 'cluster',
    position: { x: 0, y: 0 },
    data: {
      label: 'Production Cluster',
      status: 'healthy',
      region: 'Karnataka',
      cpu: 45,
      memory: 52,
      pods: 72,
      carbonIntensity: 120,
      renewable: 85,
    },
  },
  {
    id: 'cluster-2',
    type: 'cluster',
    position: { x: 0, y: 300 },
    data: {
      label: 'Dev Cluster',
      status: 'warning',
      region: 'Mumbai',
      cpu: 78,
      memory: 68,
      pods: 45,
      carbonIntensity: 450,
      renewable: 35,
    },
  },
  {
    id: 'deploy-api',
    type: 'deployment',
    position: { x: 350, y: -100 },
    data: {
      label: 'api-server',
      replicas: 3,
      readyReplicas: 3,
      updatedReplicas: 3,
      availableReplicas: 3,
      strategy: 'RollingUpdate',
    },
  },
  {
    id: 'deploy-worker',
    type: 'deployment',
    position: { x: 350, y: 100 },
    data: {
      label: 'worker-service',
      replicas: 5,
      readyReplicas: 4,
      updatedReplicas: 4,
      availableReplicas: 4,
      strategy: 'RollingUpdate',
    },
  },
  {
    id: 'deploy-batch',
    type: 'deployment',
    position: { x: 350, y: 400 },
    data: {
      label: 'batch-processor',
      replicas: 2,
      readyReplicas: 2,
      updatedReplicas: 2,
      availableReplicas: 2,
      strategy: 'Recreate',
    },
  },
  {
    id: 'service-api',
    type: 'service',
    position: { x: 650, y: -100 },
    data: {
      label: 'api-service',
      type: 'LoadBalancer',
      port: 443,
      targetPort: 8080,
      endpoints: 3,
      traffic: 'high',
    },
  },
  {
    id: 'service-worker',
    type: 'service',
    position: { x: 650, y: 100 },
    data: {
      label: 'worker-service',
      type: 'ClusterIP',
      port: 8080,
      targetPort: 8080,
      endpoints: 4,
      traffic: 'medium',
    },
  },
  {
    id: 'pod-api-1',
    type: 'pod',
    position: { x: 900, y: -150 },
    data: { label: 'api-server-1', status: 'running', namespace: 'production', cpu: 150, memory: 256, ready: 1, total: 1 },
  },
  {
    id: 'pod-api-2',
    type: 'pod',
    position: { x: 900, y: -50 },
    data: { label: 'api-server-2', status: 'running', namespace: 'production', cpu: 120, memory: 210, ready: 1, total: 1 },
  },
  {
    id: 'pod-api-3',
    type: 'pod',
    position: { x: 900, y: 50 },
    data: { label: 'api-server-3', status: 'running', namespace: 'production', cpu: 180, memory: 290, ready: 1, total: 1 },
  },
  {
    id: 'pod-worker-1',
    type: 'pod',
    position: { x: 900, y: 150 },
    data: { label: 'worker-1', status: 'running', namespace: 'production', cpu: 95, memory: 180, ready: 1, total: 1 },
  },
  {
    id: 'pod-worker-2',
    type: 'pod',
    position: { x: 1050, y: 100 },
    data: { label: 'worker-2', status: 'running', namespace: 'production', cpu: 110, memory: 195, ready: 1, total: 1 },
  },
  {
    id: 'pod-worker-3',
    type: 'pod',
    position: { x: 1050, y: 200 },
    data: { label: 'worker-3', status: 'pending', namespace: 'production', cpu: 0, memory: 0, ready: 0, total: 1 },
  },
  {
    id: 'pod-migrating',
    type: 'pod',
    position: { x: 1050, y: 350 },
    data: { label: 'batch-job-migrating', status: 'running', namespace: 'production', cpu: 85, memory: 150, ready: 1, total: 1 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e-region-c1', source: 'region-karnataka', target: 'cluster-1', type: 'animated', data: { traffic: 'high' } },
  { id: 'e-region-c2', source: 'region-mumbai', target: 'cluster-2', type: 'animated', data: { traffic: 'low' } },
  { id: 'e-c1-deploy1', source: 'cluster-1', target: 'deploy-api', type: 'animated', data: { traffic: 'high' } },
  { id: 'e-c1-deploy2', source: 'cluster-1', target: 'deploy-worker', type: 'animated', data: { traffic: 'medium' } },
  { id: 'e-c2-deploy3', source: 'cluster-2', target: 'deploy-batch', type: 'animated', data: { traffic: 'low' } },
  { id: 'e-deploy1-svc1', source: 'deploy-api', target: 'service-api', type: 'animated', data: { traffic: 'high' } },
  { id: 'e-deploy2-svc2', source: 'deploy-worker', target: 'service-worker', type: 'animated', data: { traffic: 'medium' } },
  { id: 'e-svc1-pod1', source: 'service-api', target: 'pod-api-1', type: 'animated', data: { traffic: 'high' } },
  { id: 'e-svc1-pod2', source: 'service-api', target: 'pod-api-2', type: 'animated', data: { traffic: 'high' } },
  { id: 'e-svc1-pod3', source: 'service-api', target: 'pod-api-3', type: 'animated', data: { traffic: 'high' } },
  { id: 'e-svc2-pod4', source: 'service-worker', target: 'pod-worker-1', type: 'animated', data: { traffic: 'medium' } },
  { id: 'e-svc2-pod5', source: 'service-worker', target: 'pod-worker-2', type: 'animated', data: { traffic: 'medium' } },
  { id: 'e-svc2-pod6', source: 'service-worker', target: 'pod-worker-3', type: 'animated', data: { traffic: 'medium' } },
];

export default function Topology() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [isAutoScaling, setIsAutoScaling] = useState(false);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const simulateAutoScaling = useCallback(() => {
    setIsAutoScaling(true);

    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'pod') {
          const data = node.data as unknown as PodData;
          return {
            ...node,
            data: {
              ...data,
              cpu: Math.min(100, Math.max(50, data.cpu + (Math.random() - 0.5) * 30)),
              memory: Math.min(100, Math.max(40, data.memory + (Math.random() - 0.5) * 20)),
            },
          };
        }
        if (node.type === 'cluster') {
          const data = node.data as unknown as ClusterData;
          return {
            ...node,
            data: {
              ...data,
              cpu: Math.min(95, Math.max(30, data.cpu + (Math.random() - 0.5) * 10)),
              memory: Math.min(90, Math.max(40, data.memory + (Math.random() - 0.5) * 10)),
            },
          };
        }
        return node;
      })
    );

    setTimeout(() => setIsAutoScaling(false), 2000);
  }, [setNodes]);

  const simulatePodMigration = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === 'pod-migrating') {
          return {
            ...node,
            position: {
              x: node.position.x,
              y: node.position.y === 350 ? 300 : 350,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const stats = useMemo(() => {
    const clusters = nodes.filter((n) => n.type === 'cluster');
    const pods = nodes.filter((n) => n.type === 'pod');
    const runningPods = pods.filter((p) => (p.data as unknown as PodData)?.status === 'running');

    return {
      totalClusters: clusters.length,
      totalPods: pods.length,
      runningPods: runningPods.length,
      healthyNodes: clusters.filter((c) => (c.data as unknown as ClusterData)?.status === 'healthy').length,
      averageCpu: clusters.reduce((acc, c) => acc + ((c.data as unknown as ClusterData)?.cpu || 0), 0) / clusters.length || 0,
    };
  }, [nodes]);

  return (
    <div className="h-[calc(100vh-120px)] w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-[#050816]"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={2}
          color="rgba(34, 197, 94, 0.1)"
        />
        <Controls
          className="!bg-white/5 !border-white/10 !rounded-xl !backdrop-blur-xl"
          showZoom={false}
          showFitView={false}
        />

        <Panel position="top-left" className="!m-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-4 border border-white/10"
          >
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Activity className="w-6 h-6 text-cyan-400" />
              Live Cluster Topology
            </h2>
            <p className="text-sm text-gray-400">Real-time Kubernetes infrastructure</p>
          </motion.div>
        </Panel>

        <Panel position="top-right" className="!m-4">
          <div className="flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={simulateAutoScaling}
              className="glass-card rounded-lg px-4 py-2 border border-white/10 text-white hover:border-green-500/50 transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isAutoScaling ? 'animate-spin text-green-400' : ''}`} />
              <span className="text-sm">Auto-Scale</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={simulatePodMigration}
              className="glass-card rounded-lg px-4 py-2 border border-white/10 text-white hover:border-cyan-500/50 transition-all flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">Migrate Pod</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRecommendations(!showRecommendations)}
              className={`glass-card rounded-lg px-4 py-2 border ${
                showRecommendations ? 'border-green-500/50 text-green-400' : 'border-white/10 text-gray-400'
              } transition-all flex items-center gap-2`}
            >
              <Brain className="w-4 h-4" />
              <span className="text-sm">AI Recommendations</span>
            </motion.button>
          </div>
        </Panel>

        <Panel position="bottom-left" className="!m-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-xl p-4 border border-white/10 min-w-[250px]"
          >
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Cluster Summary
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Total Clusters</span>
                <span className="text-sm font-bold text-white">{stats.totalClusters}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Running Pods</span>
                <span className="text-sm font-bold text-green-400">{stats.runningPods}/{stats.totalPods}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Healthy Nodes</span>
                <span className="text-sm font-bold text-green-400">{stats.healthyNodes}/{stats.totalClusters}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Avg CPU Usage</span>
                <span className={`text-sm font-bold ${
                  stats.averageCpu > 70 ? 'text-red-400' : stats.averageCpu > 50 ? 'text-yellow-400' : 'text-green-400'
                }`}>{stats.averageCpu.toFixed(1)}%</span>
              </div>
            </div>
          </motion.div>
        </Panel>

        <Panel position="bottom-right" className="!m-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-xl p-4 border border-white/10"
          >
            <h3 className="text-sm font-semibold text-white mb-3">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-green-500/50 bg-green-500/10" />
                <span className="text-xs text-gray-400">Cluster Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border-2 border-cyan-500/50 bg-cyan-500/10" />
                <span className="text-xs text-gray-400">Pod</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-blue-500/50 bg-blue-500/10" />
                <span className="text-xs text-gray-400">Service</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-purple-500/50 bg-purple-500/10" />
                <span className="text-xs text-gray-400">Deployment</span>
              </div>
            </div>
          </motion.div>
        </Panel>

        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'cluster') return '#22c55e';
            if (node.type === 'pod') return '#06b6d4';
            if (node.type === 'service') return '#3b82f6';
            if (node.type === 'deployment') return '#a855f7';
            return '#94a3b8';
          }}
          maskColor="rgba(5, 8, 22, 0.8)"
          className="!bg-white/5 !border-white/10"
        />
      </ReactFlow>

      <AnimatePresence>
        {showRecommendations && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-80 glass-card rounded-xl p-4 border border-white/10 z-10"
          >
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              AI Recommendations
            </h3>

            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-3 rounded-lg bg-green-500/10 border border-green-500/30"
              >
                <div className="flex items-start gap-2">
                  <TrendingDown className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-white font-medium">Migrate to Karnataka</p>
                    <p className="text-xs text-gray-400 mt-1">85% renewable energy available</p>
                    <p className="text-xs text-green-400 mt-1">Save 2.4 tons CO2/month</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-white font-medium">High CPU in Mumbai</p>
                    <p className="text-xs text-gray-400 mt-1">Dev cluster at 78% CPU</p>
                    <p className="text-xs text-yellow-400 mt-1">Consider scaling up</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30"
              >
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-cyan-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-white font-medium">Scale Down Suggested</p>
                    <p className="text-xs text-gray-400 mt-1">API traffic is low (23:00-05:00)</p>
                    <p className="text-xs text-cyan-400 mt-1">Reduce replicas to 2</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 glass-card rounded-xl p-4 border border-white/10 min-w-[400px] z-20"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white">{String(selectedNode.data?.label || '')}</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-white"
              >
                x
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              {selectedNode.type === 'cluster' && (
                <>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cyan-400">{String(selectedNode.data?.cpu || 0)}%</p>
                    <p className="text-xs text-gray-400">CPU Usage</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{String(selectedNode.data?.memory || 0)}%</p>
                    <p className="text-xs text-gray-400">Memory</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{String(selectedNode.data?.pods || 0)}</p>
                    <p className="text-xs text-gray-400">Pods</p>
                  </div>
                </>
              )}
              {selectedNode.type === 'pod' && (
                <>
                  <div className="text-center">
                    <p className="text-sm font-bold text-cyan-400">{String(selectedNode.data?.cpu || 0)}m</p>
                    <p className="text-xs text-gray-400">CPU</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-green-400">{String(selectedNode.data?.memory || 0)}Mi</p>
                    <p className="text-xs text-gray-400">Memory</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">{String(selectedNode.data?.namespace || '')}</p>
                    <p className="text-xs text-gray-400">Namespace</p>
                  </div>
                </>
              )}
              {selectedNode.type === 'service' && (
                <>
                  <div className="text-center">
                    <p className="text-sm font-bold text-blue-400">:{String(selectedNode.data?.port || 0)}</p>
                    <p className="text-xs text-gray-400">Port</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-cyan-400">{String(selectedNode.data?.endpoints || 0)}</p>
                    <p className="text-xs text-gray-400">Endpoints</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">{String(selectedNode.data?.type || '')}</p>
                    <p className="text-xs text-gray-400">Type</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
