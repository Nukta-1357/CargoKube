import { motion } from 'framer-motion';
import { Calculator as CalcIcon, Leaf, TrendingDown, Zap, Server } from 'lucide-react';
import { useState } from 'react';

export default function Calculator() {
  const [inputs, setInputs] = useState({
    vms: 10,
    hoursPerDay: 24,
    daysPerMonth: 30,
    region: 'mumbai',
  });

  const calculateCarbon = () => {
    const intensities: Record<string, number> = {
      karnataka: 120,
      chennai: 180,
      gujarat: 150,
      delhi: 380,
      mumbai: 450,
    };

    const intensity = intensities[inputs.region] || 300;
    const energyPerVM = 0.5;
    const totalEnergy = inputs.vms * inputs.hoursPerDay * inputs.daysPerMonth * energyPerVM;
    const carbonEmissions = totalEnergy * intensity;
    const renewables: Record<string, number> = {
      karnataka: 85,
      chennai: 72,
      gujarat: 78,
      delhi: 45,
      mumbai: 35,
    };

    return {
      totalEnergy: totalEnergy.toFixed(0),
      carbonEmissions: carbonEmissions.toFixed(0),
      renewable: renewables[inputs.region] || 50,
    };
  };

  const result = calculateCarbon();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Carbon Calculator</h1>
        <p className="text-gray-400 mt-1">Estimate your cloud carbon footprint</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <CalcIcon className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">Input Parameters</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Number of VMs/Instances</label>
              <input
                type="number"
                value={inputs.vms}
                onChange={(e) => setInputs({ ...inputs, vms: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Hours per Day</label>
              <input
                type="number"
                value={inputs.hoursPerDay}
                onChange={(e) => setInputs({ ...inputs, hoursPerDay: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Days per Month</label>
              <input
                type="number"
                value={inputs.daysPerMonth}
                onChange={(e) => setInputs({ ...inputs, daysPerMonth: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Region</label>
              <select
                value={inputs.region}
                onChange={(e) => setInputs({ ...inputs, region: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50"
              >
                <option value="karnataka">Karnataka (85% renewable)</option>
                <option value="chennai">Chennai (72% renewable)</option>
                <option value="gujarat">Gujarat (78% renewable)</option>
                <option value="delhi">Delhi (45% renewable)</option>
                <option value="mumbai">Mumbai (35% renewable)</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Carbon Footprint Results</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-gray-400">Total Energy Consumption</span>
              </div>
              <p className="text-3xl font-bold text-white">{result.totalEnergy} kWh</p>
              <p className="text-xs text-gray-500 mt-1">Per month</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/30">
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400">Carbon Emissions</span>
              </div>
              <p className="text-3xl font-bold text-white">{result.carbonEmissions} kg CO₂</p>
              <p className="text-xs text-gray-500 mt-1">Per month</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-400">Renewable Energy Mix</span>
              </div>
              <p className="text-3xl font-bold text-white">{result.renewable}%</p>
              <p className="text-xs text-gray-500 mt-1">Regional average</p>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Server className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-400">Potential Savings</span>
              </div>
              <p className="text-xl font-bold text-green-400">
                Moving to Karnataka could save ~{((parseInt(result.carbonEmissions) * 0.7)).toFixed(0)} kg CO₂
              </p>
              <p className="text-xs text-gray-500 mt-1">By choosing low-carbon regions</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
