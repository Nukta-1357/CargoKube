import { Bell, User, Activity, Zap, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

export default function TopHeader() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-xl px-6 flex items-center justify-between relative z-20">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-white">Carbon Intelligence Platform</h1>
          <p className="text-xs text-gray-400">Real-time Kubernetes optimization</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400 font-medium">Live</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-400 font-medium">AI Active</span>
        </div>

        <motion.div
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30"
          whileHover={{ scale: 1.05 }}
        >
          <TrendingDown className="w-4 h-4 text-green-400" />
          <span className="text-sm text-white font-semibold">32% CO₂ Reduced</span>
        </motion.div>

        <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-white/10">
          <div className="text-right hidden md:block">
            <p className="text-sm text-white font-medium">{user?.email || 'user@example.com'}</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
