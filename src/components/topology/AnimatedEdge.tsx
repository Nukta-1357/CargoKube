import { memo } from 'react';
import { BaseEdge, getBezierPath } from '@xyflow/react';
import { motion } from 'framer-motion';

interface CustomEdgeData {
  traffic?: 'low' | 'medium' | 'high';
  animated?: boolean;
  label?: string;
}

interface AnimatedEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  style?: React.CSSProperties;
  data?: CustomEdgeData;
}

export const AnimatedEdge = memo(({ id, sourceX, sourceY, targetX, targetY, style, data }: AnimatedEdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const trafficConfig = {
    low: { color: '#3b82f6', width: 1.5, particleCount: 3 },
    medium: { color: '#06b6d4', width: 2, particleCount: 5 },
    high: { color: '#22c55e', width: 2.5, particleCount: 8 },
  };

  const trafficKey = data?.traffic || 'medium';
  const config = trafficConfig[trafficKey];

  return (
    <>
      <defs>
        <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={config.color} stopOpacity="0.2" />
          <stop offset="50%" stopColor={config.color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={config.color} stopOpacity="0.2" />
        </linearGradient>

        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: `url(#gradient-${id})`,
          strokeWidth: config.width,
          filter: `url(#glow-${id})`,
        }}
      />

      {data?.animated !== false && (
        <>
          {Array.from({ length: config.particleCount }).map((_, i) => (
            <motion.circle
              key={`${id}-particle-${i}`}
              r={3}
              fill={config.color}
              filter={`url(#glow-${id})`}
              style={{
                offsetPath: `path("${edgePath}")`,
              }}
              initial={{ offsetDistance: `${(i / config.particleCount) * 100}%` }}
              animate={{ offsetDistance: [`${(i / config.particleCount) * 100}%`, `${((i + 1) / config.particleCount) * 100 + 100}%`] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.2,
              }}
            />
          ))}
        </>
      )}

      {data?.label && (
        <text
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2 - 10}
          className="text-xs fill-gray-400"
          textAnchor="middle"
        >
          {data.label}
        </text>
      )}
    </>
  );
});

AnimatedEdge.displayName = 'AnimatedEdge';
