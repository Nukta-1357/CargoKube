import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Server, MapPin, Check, ArrowRight, ArrowLeft, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

const steps = [
  {
    id: 1,
    title: 'Welcome to CargoKube',
    subtitle: 'AI-Powered Carbon Intelligence for Kubernetes',
    component: WelcomeStep,
  },
  {
    id: 2,
    title: 'Create Your First Cluster',
    subtitle: 'Set up your Kubernetes cluster connection',
    component: ClusterStep,
  },
  {
    id: 3,
    title: 'Select Your Region',
    subtitle: 'Choose regions with low carbon intensity',
    component: RegionStep,
  },
  {
    id: 4,
    title: 'Ready to Go',
    subtitle: 'Your setup is complete',
    component: FinalStep,
  },
];

function WelcomeStep() {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-8 neon-glow"
      >
        <Zap className="w-16 h-16 text-green-400" />
      </motion.div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <Check className="w-5 h-5 text-green-400 inline mr-2" />
          <span className="text-white">AI-powered carbon scheduling</span>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <Check className="w-5 h-5 text-green-400 inline mr-2" />
          <span className="text-white">Real-time carbon intensity monitoring</span>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <Check className="w-5 h-5 text-green-400 inline mr-2" />
          <span className="text-white">Automatic workload optimization</span>
        </div>
      </div>
    </div>
  );
}

function ClusterStep({ formData, setFormData }: { formData: any; setFormData: any }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-400 mb-2">Cluster Name</label>
        <input
          type="text"
          value={formData.clusterName}
          onChange={(e) => setFormData({ ...formData, clusterName: e.target.value })}
          placeholder="my-production-cluster"
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Cloud Provider</label>
        <div className="grid grid-cols-3 gap-3">
          {['AWS', 'GCP', 'Azure'].map((provider) => (
            <motion.button
              key={provider}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormData({ ...formData, provider })}
              className={`p-4 rounded-lg border text-center ${
                formData.provider === provider
                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Server className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">{provider}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RegionStep({ formData, setFormData }: { formData: any; setFormData: any }) {
  const regions = [
    { name: 'Karnataka', renewable: 85, intensity: 120, recommended: true },
    { name: 'Chennai', renewable: 72, intensity: 180, recommended: true },
    { name: 'Gujarat', renewable: 78, intensity: 150, recommended: true },
    { name: 'Delhi', renewable: 45, intensity: 380, recommended: false },
    { name: 'Mumbai', renewable: 35, intensity: 450, recommended: false },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400 mb-4">
        Regions with high renewable energy are recommended for lower carbon footprint
      </p>

      {regions.map((region) => (
        <motion.button
          key={region.name}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setFormData({ ...formData, region: region.name })}
          className={`w-full p-4 rounded-lg border text-left ${
            formData.region === region.name
              ? 'bg-green-500/20 border-green-500/50'
              : 'bg-white/5 border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-white font-medium">{region.name}</p>
                <p className="text-xs text-gray-400">{region.renewable}% renewable energy</p>
              </div>
            </div>
            {region.recommended && (
              <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                Recommended
              </span>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function FinalStep() {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center mx-auto mb-8 neon-glow"
      >
        <Rocket className="w-16 h-16 text-white" />
      </motion.div>

      <h3 className="text-2xl font-bold text-white mb-4">You're All Set!</h3>
      <p className="text-gray-400">
        CargoKube is now monitoring your cluster and optimizing carbon footprint.
      </p>
    </div>
  );
}

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    clusterName: 'production-cluster',
    provider: 'AWS',
    region: 'Karnataka',
  });
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleComplete = async () => {
    if (user) {
      try {
        const { error } = await supabase.from('users').upsert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || 'User',
          organization: 'My Organization',
          role: 'admin',
        });

        if (error) throw error;
      } catch (err) {
        console.error('Error creating user:', err);
      }
    }

    navigate('/');
  };

  const handleNext = async () => {
    if (currentStep === steps.length - 2) {
      await handleComplete();
    } else {
      setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] p-4 relative overflow-hidden">
      <div className="absolute inset-0 star-bg opacity-30" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute w-96 h-96 rounded-full bg-green-500/10 blur-3xl -top-48 -left-48"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="glass-card rounded-2xl p-8 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            {steps.map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i <= currentStep
                      ? 'bg-gradient-to-br from-green-500 to-cyan-500 text-white'
                      : 'bg-white/10 text-gray-500'
                  }`}
                >
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 ${
                      i < currentStep ? 'bg-green-500' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">{steps[currentStep].title}</h2>
            <p className="text-gray-400 mt-1">{steps[currentStep].subtitle}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mb-8"
            >
              {currentStep === 0 && <WelcomeStep />}
              {currentStep === 1 && (
                <ClusterStep formData={formData} setFormData={setFormData} />
              )}
              {currentStep === 2 && (
                <RegionStep formData={formData} setFormData={setFormData} />
              )}
              {currentStep === 3 && <FinalStep />}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold"
            >
              <span>
                {currentStep === steps.length - 1 ? 'Go to Dashboard' : 'Continue'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
