import { motion } from 'framer-motion';
import { Brain, ArrowRight, MapPin, Clock, Leaf, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const recommendations = [
  {
    id: 1,
    type: 'relocation',
    title: 'Move workloads to Karnataka',
    description: 'Karnataka region currently has 85% renewable energy. Shifting batch jobs could reduce emissions by 40%.',
    impact: '2.4 tons CO₂/month',
    priority: 'high',
    icon: MapPin,
  },
  {
    id: 2,
    type: 'scheduling',
    title: 'Scale down during peak carbon window',
    description: 'Carbon intensity spikes at 14:00-17:00. Consider pausing non-critical workloads during this period.',
    impact: '1.8 tons CO₂/Month',
    priority: 'medium',
    icon: Clock,
  },
  {
    id: 3,
    type: 'optimization',
    title: 'Shift batch jobs to renewable region',
    description: 'Data pipeline jobs can run anytime. Schedule them during night hours in wind-heavy regions.',
    impact: '3.2 tons CO₂/Month',
    priority: 'high',
    icon: Leaf,
  },
  {
    id: 4,
    type: 'alert',
    title: 'High carbon intensity detected in Mumbai',
    description: 'Current carbon intensity in Mumbai cluster is 450gCO₂/kWh. Consider load balancing to Karnataka.',
    impact: 'At Risk',
    priority: 'critical',
    icon: AlertTriangle,
  },
];

export default function AIRecommendations() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-green-500/50 bg-green-500/10';
      case 'medium':
        return 'border-cyan-500/50 bg-cyan-500/10';
      case 'critical':
        return 'border-red-500/50 bg-red-500/10';
      default:
        return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-cyan-400" />
            AI Recommendations
          </h2>
          <p className="text-sm text-gray-400 mt-1">Intelligent optimization suggestions</p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 4 }}
            onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${getPriorityStyle(rec.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <rec.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{rec.title}</h3>
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: expandedId === rec.id ? 'auto' : 0,
                      opacity: expandedId === rec.id ? 1 : 0,
                    }}
                    className="text-sm text-gray-400 mt-1 overflow-hidden"
                  >
                    {rec.description}
                  </motion.p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-green-400 px-2 py-1 rounded-full bg-green-500/20">
                  {rec.impact}
                </span>
                <ArrowRight
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    expandedId === rec.id ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
