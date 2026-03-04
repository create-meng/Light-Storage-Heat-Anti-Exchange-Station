'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html, Text } from '@react-three/drei'
import * as THREE from 'three'

type DemoMode = 'idle' | 'normal' | 'abnormal'

interface PCMLayerExplodedViewProps {
  position?: [number, number, number]
  scale?: number
  mode: DemoMode
  temperature?: number
  pcmStage?: number // 0=待触发, 1=一级相变, 2=二级相变, 3=气凝胶阻断
}

/**
 * 双级PCM层级爆炸展示组件
 * 清晰展示：电池核心 → 硅胶垫 → 一级PCM → 铝箔 → 二级PCM → 气凝胶 → 外壳
 * 每层都有标签和颜色区分，支持动画展开
 */
export function PCMLayerExplodedView({
  position = [0, 0, 0],
  scale = 1,
  mode,
  temperature = 28,
  pcmStage = 0,
}: PCMLayerExplodedViewProps) {
  const [expanded, setExpanded] = useState(true)
  const timeRef = useRef(0)
  
  // 层级定义（按文档设计）
  const layers = useMemo(() => [
    { 
      name: '电池核心', 
      nameEn: 'Battery Cell',
      thickness: 0.5, 
      color: '#1e293b', 
      emissive: '#0f172a',
      emissiveIntensity: 0.1,
      opacity: 0.95,
      metalness: 0.4,
      roughness: 0.5,
      description: '产热源',
    },
    { 
      name: '硅胶垫', 
      nameEn: 'Silicone Pad',
      thickness: 0.04, 
      color: '#94a3b8', 
      emissive: '#94a3b8',
      emissiveIntensity: 0.08,
      opacity: 0.7,
      metalness: 0.1,
      roughness: 0.65,
      description: '高导热 ≥3W/(m·K)',
    },
    { 
      name: '一级PCM', 
      nameEn: 'PCM Level 1',
      thickness: 0.08, 
      color: '#14b8a6', 
      emissive: '#22d3ee',
      emissiveIntensity: pcmStage >= 1 ? 0.45 : 0.2,
      opacity: pcmStage >= 1 ? 0.85 : 0.6,
      metalness: 0.05,
      roughness: 0.25,
      description: '石蜡/膨胀石墨 28-32℃',
      highlight: pcmStage === 1,
    },
    { 
      name: '铝箔', 
      nameEn: 'Aluminum Foil',
      thickness: 0.02, 
      color: '#e2e8f0', 
      emissive: '#e2e8f0',
      emissiveIntensity: 0.15,
      opacity: 0.8,
      metalness: 0.9,
      roughness: 0.2,
      description: '热反射层',
    },
    { 
      name: '二级PCM', 
      nameEn: 'PCM Level 2',
      thickness: 0.06, 
      color: pcmStage >= 2 ? '#f97316' : '#60a5fa', 
      emissive: pcmStage >= 2 ? '#fb7185' : '#60a5fa',
      emissiveIntensity: pcmStage >= 2 ? 0.55 : 0.18,
      opacity: pcmStage >= 2 ? 0.9 : 0.55,
      metalness: 0.05,
      roughness: 0.3,
      description: '无机盐/陶瓷基 55-60℃',
      highlight: pcmStage === 2,
    },
    { 
      name: '气凝胶', 
      nameEn: 'Aerogel',
      thickness: 0.05, 
      color: '#ffffff', 
      emissive: '#ffffff',
      emissiveIntensity: pcmStage >= 3 ? 0.2 : 0.05,
      opacity: pcmStage >= 3 ? 0.6 : 0.3,
      metalness: 0,
      roughness: 0.9,
      description: '隔热 0.015-0.025W/(m·K)',
      highlight: pcmStage >= 3,
    },
    { 
      name: '外壳', 
      nameEn: 'Shell',
      thickness: 0.03, 
      color: '#475569', 
      emissive: '#0b1222',
      emissiveIntensity: 0.08,
      opacity: 0.9,
      metalness: 0.7,
      roughness: 0.4,
      description: 'ABS结构',
    },
  ], [pcmStage])

  // 计算每层的位置（爆炸展开）
  const getLayerPosition = (index: number, totalLayers: number) => {
    if (!expanded) return 0
    const spacing = 0.15 // 层间距
    const offset = (index - (totalLayers - 1) / 2) * spacing
    return offset
  }

  // PCM动画效果
  useFrame((_, delta) => {
    timeRef.current += delta
  })

  return (
    <group position={position} scale={scale}>
      {/* 标题 */}
      <group position={[0, 1.2, 0]}>
        <Html transform distanceFactor={8} center>
          <div className="text-center pointer-events-none">
            <div className="text-xs font-tech tracking-widest" style={{ color: 'var(--accent-cyan)' }}>
              DUAL-STAGE PCM STRUCTURE
            </div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              双级相变储热层级结构
            </div>
          </div>
        </Html>
      </group>

      {/* 层级展示 */}
      {layers.map((layer, index) => {
        const yPos = getLayerPosition(index, layers.length)
        const width = 0.8 - index * 0.03 // 逐层略小
        const height = layer.thickness
        const depth = 0.5 - index * 0.02
        
        return (
          <group key={index} position={[0, yPos, 0]}>
            {/* 层级本体 */}
            <RoundedBox
              args={[width, height, depth]}
              radius={0.01}
            >
              <meshStandardMaterial
                color={layer.color}
                emissive={layer.emissive}
                emissiveIntensity={layer.emissiveIntensity}
                transparent
                opacity={layer.opacity}
                metalness={layer.metalness}
                roughness={layer.roughness}
              />
            </RoundedBox>

            {/* 高亮边框（当前激活层） */}
            {layer.highlight && (
              <RoundedBox
                args={[width + 0.02, height + 0.01, depth + 0.02]}
                radius={0.015}
              >
                <meshBasicMaterial
                  color={layer.color}
                  transparent
                  opacity={0.3}
                  wireframe
                />
              </RoundedBox>
            )}

            {/* 层级标签 */}
            <group position={[width / 2 + 0.15, 0, 0]}>
              <Html transform distanceFactor={6} center>
                <div className="pointer-events-none whitespace-nowrap">
                  <div 
                    className="text-[10px] font-semibold"
                    style={{ color: layer.highlight ? layer.color : 'var(--text-secondary)' }}
                  >
                    {layer.name}
                  </div>
                  <div className="text-[8px]" style={{ color: 'var(--text-muted)' }}>
                    {layer.description}
                  </div>
                </div>
              </Html>
            </group>
          </group>
        )
      })}

      {/* 热流箭头指示（异常模式时显示） */}
      {mode === 'abnormal' && pcmStage >= 1 && (
        <group position={[-0.6, 0, 0]}>
          {/* 热流方向箭头 */}
          <Html transform distanceFactor={5} center>
            <div className="pointer-events-none text-center">
              <div className="text-[10px] font-tech" style={{ color: 'var(--status-danger)' }}>
                HEAT FLOW
              </div>
              <div className="text-[8px]" style={{ color: 'var(--text-muted)' }}>
                热量传导方向
              </div>
            </div>
          </Html>
        </group>
      )}

      {/* 温度指示 */}
      <group position={[0.7, 0, 0]}>
        <Html transform distanceFactor={6} center>
          <div className="pointer-events-none text-center">
            <div 
              className="text-lg font-mono font-bold"
              style={{ 
                color: mode === 'abnormal' 
                  ? (temperature > 60 ? 'var(--status-danger)' : 'var(--status-warning)')
                  : 'var(--accent-emerald)'
              }}
            >
              {temperature.toFixed(0)}℃
            </div>
            <div className="text-[8px]" style={{ color: 'var(--text-muted)' }}>
              当前温度
            </div>
          </div>
        </Html>
      </group>

      {/* 状态指示 */}
      <group position={[0, -0.8, 0]}>
        <Html transform distanceFactor={6} center>
          <div className="pointer-events-none text-center">
            <div 
              className="text-xs font-tech tracking-wider"
              style={{ 
                color: pcmStage === 0 ? 'var(--accent-cyan)' 
                  : pcmStage === 1 ? 'var(--accent-cyan)'
                  : pcmStage === 2 ? 'var(--status-warning)'
                  : 'var(--status-danger)'
              }}
            >
              {pcmStage === 0 && 'STANDBY'}
              {pcmStage === 1 && 'PCM-1 ACTIVE'}
              {pcmStage === 2 && 'PCM-2 ACTIVE'}
              {pcmStage >= 3 && 'AEROGEL BARRIER'}
            </div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              {pcmStage === 0 && '系统待机'}
              {pcmStage === 1 && '一级PCM相变吸热中'}
              {pcmStage === 2 && '二级PCM相变吸热中'}
              {pcmStage >= 3 && '气凝胶隔热阻断'}
            </div>
          </div>
        </Html>
      </group>
    </group>
  )
}

/**
 * 简化版PCM层级剖面（用于侧边栏）
 */
export function PCMLayerCrossSection({
  mode,
  temperature = 28,
  pcmStage = 0,
}: {
  mode: DemoMode
  temperature?: number
  pcmStage?: number
}) {
  // 层级定义
  const layers = [
    { name: '电池', height: 24, color: 'rgba(30,41,59,0.9)', textColor: '#94a3b8' },
    { name: '硅胶垫', height: 16, color: 'rgba(148,163,184,0.6)', textColor: '#64748b' },
    { name: '一级PCM', height: 32, color: pcmStage >= 1 ? 'rgba(20,184,166,0.7)' : 'rgba(20,184,166,0.4)', textColor: pcmStage >= 1 ? '#22d3ee' : '#64748b', glow: pcmStage === 1 },
    { name: '铝箔', height: 12, color: 'rgba(226,232,240,0.7)', textColor: '#94a3b8' },
    { name: '二级PCM', height: 28, color: pcmStage >= 2 ? 'rgba(249,115,22,0.7)' : 'rgba(96,165,250,0.4)', textColor: pcmStage >= 2 ? '#fb7185' : '#64748b', glow: pcmStage === 2 },
    { name: '气凝胶', height: 20, color: 'rgba(255,255,255,0.25)', textColor: '#94a3b8', glow: pcmStage >= 3 },
    { name: '外壳', height: 14, color: 'rgba(71,85,105,0.8)', textColor: '#64748b' },
  ]

  return (
    <div className="w-full">
      {/* 层级剖面图 */}
      <div className="flex flex-col gap-0.5 rounded-lg overflow-hidden border border-[var(--glass-border)] bg-[var(--bg-card)]">
        {layers.map((layer, index) => (
          <div 
            key={index}
            className="flex items-center gap-2 px-2 transition-all duration-300"
            style={{ height: `${layer.height}px`, backgroundColor: layer.color }}
          >
            {/* 色块 */}
            <div 
              className="w-12 h-3/4 rounded-sm transition-all duration-300"
              style={{ 
                backgroundColor: layer.color,
                boxShadow: layer.glow ? `0 0 12px ${layer.textColor}` : 'none',
              }}
            />
            {/* 标签 */}
            <span 
              className="text-[9px] font-medium transition-colors duration-300"
              style={{ color: layer.textColor }}
            >
              {layer.name}
            </span>
          </div>
        ))}
      </div>

      {/* 温度与状态 */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1">
          <div 
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ 
              backgroundColor: pcmStage === 0 ? 'var(--accent-cyan)'
                : pcmStage === 1 ? 'var(--accent-cyan)'
                : pcmStage === 2 ? 'var(--status-warning)'
                : 'var(--status-danger)'
            }}
          />
          <span className="text-[10px] font-tech" style={{ color: 'var(--text-muted)' }}>
            {temperature.toFixed(0)}℃
          </span>
        </div>
        <span 
          className="text-[10px] font-tech"
          style={{ 
            color: pcmStage === 0 ? 'var(--accent-cyan)'
              : pcmStage === 1 ? 'var(--accent-cyan)'
              : pcmStage === 2 ? 'var(--status-warning)'
              : 'var(--status-danger)'
          }}
        >
          {pcmStage === 0 && '待机'}
          {pcmStage === 1 && '一级相变'}
          {pcmStage === 2 && '二级相变'}
          {pcmStage >= 3 && '隔热阻断'}
        </span>
      </div>
    </div>
  )
}

export default PCMLayerExplodedView
