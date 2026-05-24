import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Copy, Check } from 'lucide-react';

const commands = [
  {
    cmd: 'kubectl get pods -n production',
    output: `NAME                              READY   STATUS    RESTARTS   AGE
api-server-7d9c8f6b4-x2k9m        1/1     Running   0          2d
batch-processor-5f8d7c9b3-n4p2q   1/1     Running   0          5h
data-pipeline-3c7b6d9f8-m1w3e     1/1     Running   0          1d`,
  },
  {
    cmd: 'kubectl top nodes',
    output: `NAME              CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
node-karnataka-1   450m         22%    2048Mi          25%
node-mumbai-1      720m         36%    3072Mi          38%
node-delhi-1       380m         19%    1536Mi          19%`,
  },
  {
    cmd: 'cargokube schedule --carbon-aware',
    output: `Analyzing carbon intensity across regions...
Identifying optimal scheduling window...
  ✓ Karnataka: 85% renewable (Recommended)
  ✓ Mumbai: 45% renewable
  ✓ Delhi: 52% renewable

Scheduling recommendation generated:
  → 3 workloads ready for migration
  → Potential savings: 2.4 tons CO₂/month`,
  },
];

export default function Terminal() {
  const [activeCommand, setActiveCommand] = useState(0);
  const [copied, setCopied] = useState(false);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setOutputLines([]);
    setIsTyping(true);

    const lines = commands[activeCommand].output.split('\n');
    let currentLine = 0;

    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        setOutputLines((prev) => [...prev, lines[currentLine]]);
        currentLine++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [activeCommand]);

  const copyCommand = () => {
    navigator.clipboard.writeText(commands[activeCommand].cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card rounded-xl overflow-hidden h-full"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium text-white">CargoKube Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          {commands.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveCommand(i)}
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                activeCommand === i
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 font-mono text-sm bg-black/60 h-64 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-green-400">$</span>
          <span className="text-white">{commands[activeCommand].cmd}</span>
          <button
            onClick={copyCommand}
            className="ml-auto p-1 rounded hover:bg-white/10 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>

        <div className="text-gray-300 space-y-0.5">
          {outputLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              className={line?.startsWith('✓') ? 'text-green-400' : line?.startsWith('→') ? 'text-cyan-400' : ''}
            >
              {line}
            </motion.div>
          ))}
          {isTyping && <span className="animate-pulse text-white">▊</span>}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-black/20">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
          <Play className="w-4 h-4" />
          <span className="text-sm font-medium">Run</span>
        </button>
        <span className="text-xs text-gray-500">Press Enter to execute</span>
      </div>
    </motion.div>
  );
}
