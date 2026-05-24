import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Save } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function Settings() {
  const { user, signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || 'User',
    email: user?.email || '',
    organization: 'My Organization',
    notifications: {
      email: true,
      push: true,
      carbon: true,
      alerts: true,
    },
    theme: 'dark',
    language: 'en',
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6"
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center neon-glow">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{formData.fullName}</h3>
                    <p className="text-gray-400">{formData.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Organization</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50"
                    />
                  </div>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity">
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>

                {[
                  { id: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { id: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                  { id: 'carbon', label: 'Carbon Alerts', desc: 'Alerts for high carbon intensity' },
                  { id: 'alerts', label: 'System Alerts', desc: 'Critical system notifications' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          notifications: {
                            ...formData.notifications,
                            [item.id]: !formData.notifications[item.id as keyof typeof formData.notifications],
                          },
                        })
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        formData.notifications[item.id as keyof typeof formData.notifications]
                          ? 'bg-green-500'
                          : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                          formData.notifications[item.id as keyof typeof formData.notifications]
                            ? 'translate-x-6'
                            : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white font-medium">Password</p>
                      <p className="text-sm text-gray-400">Last changed 30 days ago</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">Not enabled</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <h4 className="text-red-400 font-medium mb-2">Danger Zone</h4>
                  <button
                    onClick={signOut}
                    className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                  >
                    Sign Out All Devices
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-4">Appearance Settings</h3>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['dark', 'light', 'auto'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setFormData({ ...formData, theme })}
                        className={`p-4 rounded-lg border text-center capitalize ${
                          formData.theme === theme
                            ? 'bg-green-500/20 border-green-500/50 text-green-400'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-500/50"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
