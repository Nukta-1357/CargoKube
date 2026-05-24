import { motion } from 'framer-motion';
import { Zap, Activity, Server, Leaf, TrendingUp, Wind } from 'lucide-react';
import KPICard from '../components/KPICard';
import AIForecastChart from '../components/AIForecastChart';
import ClusterTopology from '../components/ClusterTopology';
import AIRecommendations from '../components/AIRecommendations';
import Terminal from '../components/Terminal';
import ObservabilityMetrics from '../components/ObservabilityMetrics';
import CarbonMap from '../components/CarbonMap';

const kpiData = [
  { value: 45 }, { value: 52 }, { value: 48 }, { value: 55 }, { value: 50 },
];
const podsData = [
  { value: 120 }, { value: 128 }, { value: 125 }, { value: 132 }, { value: 130 },
];
const carbonData = [
  { value: 12.4 }, { value: 15.2 }, { value: 14.8 }, { value: 16.5 }, { value: 18.2 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          AI-Powered Carbon-Aware Kubernetes
        </h1>
        <p className="text-xl text-gray-400">
          Reduce cloud emissions with intelligent workload scheduling.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Current Carbon Intensity"
          value="245"
          subtitle="gCO₂/kWh"
          icon={Activity}
          trend={-12}
          data={kpiData}
          color="green"
        />
        <KPICard
          title="Active Pods"
          value="130"
          subtitle="Running"
          icon={Server}
          trend={5}
          data={podsData}
          color="cyan"
        />
        <KPICard
          title="AI Scaling Decision"
          value="Optimal"
          subtitle="Green window active"
          icon={Zap}
          data={[]}
          color="green"
        />
        <KPICard
          title="Estimated CO₂ Saved"
          value="18.2"
          subtitle="tons/month"
          icon={Leaf}
          trend={32}
          data={carbonData}
          color="green"
        />
        <KPICard
          title="Cluster Health"
          value="98%"
          subtitle="All systems normal"
          icon={TrendingUp}
          data={[]}
          color="cyan"
        />
        <KPICard
          title="Renewable Energy"
          value="67%"
          subtitle="Grid average"
          icon={Wind}
          trend={8}
          data={[]}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIForecastChart />
        <ClusterTopology />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ObservabilityMetrics />
        </div>
        <CarbonMap />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIRecommendations />
        <Terminal />
      </div>
    </div>
  );
}
