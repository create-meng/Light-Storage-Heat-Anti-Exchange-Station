'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Cylinder, Box } from '@react-three/drei'
import * as THREE from 'three'

type DemoMode = 'idle' | 'normal' | 'abnormal'

/**
 * 单体电池芯（带层级剖面展示）
 * 使用剖面视图清晰展示层级结构
 */
export function BatteryCellWithLayers({
  position = [0, 0, 0],
  scale = 1,
  mode,
  temperature = 28,
  showCrossSection = false,
  crossSectionAxes = ['x'],
}: {
  position?: [number, number, number]
  scale?: number
  mode: DemoMode
  temperature?: number
  showCrossSection?: boolean
  crossSectionAxes?: Array<'x' | 'z'>
}) {
  const timeRef = useRef(0)
  
  // 计算PCM状态
  const pcm1Active = mode === 'abnormal' && temperature >= 28
  const pcm2Active = mode === 'abnormal' && temperature >= 55
  const aerogelActive = mode === 'abnormal' && temperature >= 100
  
  // 层级尺寸（相对单位，放大展示）
  const layers = {
    cell: { width: 1.0, height: 1.4, depth: 0.35 },      // 电池芯
    silicone: 0.08,    // 硅胶垫厚度
    pcm1: 0.14,        // 一级PCM厚度
    foil: 0.05,        // 铝箔厚度
    pcm2: 0.12,        // 二级PCM厚度
    aerogel: 0.10,     // 气凝胶厚度
    shell: 0.06,       // 外壳厚度
  }
  
  // 颜色定义
  const colors = {
    cell: '#1e293b',
    cellInner: '#334155',
    silicone: '#a855f7',
    pcm1: pcm1Active ? '#0891b2' : '#0e7490',
    pcm1Glow: '#22d3ee',
    foil: '#94a3b8',
    pcm2: pcm2Active ? '#ea580c' : '#3b82f6',
    pcm2Glow: '#fb923c',
    aerogel: '#14b8a6',
    aerogelGlow: '#22d3ee',
    shell: '#1e293b',
  }
  
  useFrame((_, delta) => {
    timeRef.current += delta
  })
  
  const wrapThickness = layers.silicone + layers.pcm1 + layers.foil + layers.pcm2 + layers.aerogel + layers.shell

  // 计算总宽度
  const totalWidth = layers.cell.width + wrapThickness * 2

  const crossSectionOffsetX = totalWidth / 2 + 0.22
  const totalDepth = layers.cell.depth + wrapThickness * 2
  const crossSectionOffsetZ = totalDepth / 2 + 0.22

  const CrossSectionLayers = () => (
    <>
      {/* 从左到右依次排列各层 */}
      {/* 外壳 - 左 */}
      <Box args={[layers.shell, layers.cell.height, layers.cell.depth]} position={[-totalWidth / 2 + layers.shell / 2, 0, 0]}>
        <meshStandardMaterial color={colors.shell} metalness={0.7} roughness={0.4} />
      </Box>

      {/* 气凝胶 - 左 */}
      <Box
        args={[layers.aerogel, layers.cell.height * 0.95, layers.cell.depth * 0.95]}
        position={[-totalWidth / 2 + layers.shell + layers.aerogel / 2, 0, 0]}
        renderOrder={2}
      >
        <meshStandardMaterial
          color={colors.aerogel}
          emissive={colors.aerogelGlow}
          emissiveIntensity={aerogelActive ? 0.95 : 0.55}
          roughness={0.9}
        />
      </Box>

      {/* 二级PCM - 左 */}
      <Box
        args={[layers.pcm2, layers.cell.height * 0.9, layers.cell.depth * 0.9]}
        position={[-totalWidth / 2 + layers.shell + layers.aerogel + layers.pcm2 / 2, 0, 0]}
        renderOrder={3}
      >
        <meshStandardMaterial
          color={colors.pcm2}
          emissive={pcm2Active ? colors.pcm2Glow : '#60a5fa'}
          emissiveIntensity={pcm2Active ? 1.35 : 0.75}
          roughness={0.3}
        />
      </Box>

      {/* 铝箔 - 左 */}
      <Box
        args={[layers.foil, layers.cell.height * 0.85, layers.cell.depth * 0.85]}
        position={[-totalWidth / 2 + layers.shell + layers.aerogel + layers.pcm2 + layers.foil / 2, 0, 0]}
        renderOrder={4}
      >
        <meshStandardMaterial color={colors.foil} emissive="#ffffff" emissiveIntensity={0.2} metalness={0.95} roughness={0.15} />
      </Box>

      {/* 一级PCM - 左 */}
      <Box
        args={[layers.pcm1, layers.cell.height * 0.8, layers.cell.depth * 0.8]}
        position={[-totalWidth / 2 + layers.shell + layers.aerogel + layers.pcm2 + layers.foil + layers.pcm1 / 2, 0, 0]}
        renderOrder={5}
      >
        <meshStandardMaterial
          color={colors.pcm1}
          emissive={colors.pcm1Glow}
          emissiveIntensity={pcm1Active ? 1.35 : 0.85}
          roughness={0.3}
        />
      </Box>

      {/* 硅胶垫 - 左 */}
      <Box
        args={[layers.silicone, layers.cell.height * 0.75, layers.cell.depth * 0.75]}
        position={[-totalWidth / 2 + layers.shell + layers.aerogel + layers.pcm2 + layers.foil + layers.pcm1 + layers.silicone / 2, 0, 0]}
        renderOrder={6}
      >
        <meshStandardMaterial color={colors.silicone} emissive="#a78bfa" emissiveIntensity={0.95} roughness={0.4} />
      </Box>

      {/* 电池核心 */}
      <RoundedBox args={[layers.cell.width, layers.cell.height, layers.cell.depth]} position={[0, 0, 0]} radius={0.03} renderOrder={7}>
        <meshStandardMaterial color={colors.cell} emissive="#94a3b8" emissiveIntensity={0.22} metalness={0.12} roughness={0.65} />
      </RoundedBox>

      {/* 电池核心轮廓线框（保证可见性，但不抢包裹层） */}
      <RoundedBox
        args={[layers.cell.width + 0.02, layers.cell.height + 0.02, layers.cell.depth + 0.02]}
        position={[0, 0, 0]}
        radius={0.032}
        renderOrder={10}
      >
        <meshStandardMaterial
          color="#0f172a"
          emissive="#22d3ee"
          emissiveIntensity={0.08}
          transparent
          opacity={0.18}
          depthWrite={false}
          depthTest={false}
          wireframe
        />
      </RoundedBox>

      {/* 电池内部结构示意 */}
      <group position={[0, 0, 0]}>
        {/* 电芯分隔 */}
        {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
          <Box key={i} args={[0.15, layers.cell.height * 0.85, layers.cell.depth * 0.8]} position={[x, 0, 0]}>
            <meshStandardMaterial
              color={colors.cellInner}
              emissive="#cbd5e1"
              emissiveIntensity={0.12}
              metalness={0.05}
              roughness={0.85}
            />
          </Box>
        ))}
      </group>

      {/* 硅胶垫 - 右 */}
      <Box
        args={[layers.silicone, layers.cell.height * 0.75, layers.cell.depth * 0.75]}
        position={[totalWidth / 2 - layers.shell - layers.aerogel - layers.pcm2 - layers.foil - layers.pcm1 - layers.silicone / 2, 0, 0]}
      >
        <meshStandardMaterial color={colors.silicone} emissive="#a78bfa" emissiveIntensity={0.6} roughness={0.4} />
      </Box>

      {/* 一级PCM - 右 */}
      <Box
        args={[layers.pcm1, layers.cell.height * 0.8, layers.cell.depth * 0.8]}
        position={[totalWidth / 2 - layers.shell - layers.aerogel - layers.pcm2 - layers.foil - layers.pcm1 / 2, 0, 0]}
      >
        <meshStandardMaterial
          color={colors.pcm1}
          emissive={colors.pcm1Glow}
          emissiveIntensity={pcm1Active ? 0.85 : 0.55}
          roughness={0.3}
        />
      </Box>

      {/* 铝箔 - 右 */}
      <Box
        args={[layers.foil, layers.cell.height * 0.85, layers.cell.depth * 0.85]}
        position={[totalWidth / 2 - layers.shell - layers.aerogel - layers.pcm2 - layers.foil / 2, 0, 0]}
      >
        <meshStandardMaterial color={colors.foil} emissive="#ffffff" emissiveIntensity={0.2} metalness={0.95} roughness={0.15} />
      </Box>

      {/* 二级PCM - 右 */}
      <Box
        args={[layers.pcm2, layers.cell.height * 0.9, layers.cell.depth * 0.9]}
        position={[totalWidth / 2 - layers.shell - layers.aerogel - layers.pcm2 / 2, 0, 0]}
      >
        <meshStandardMaterial
          color={colors.pcm2}
          emissive={pcm2Active ? colors.pcm2Glow : '#60a5fa'}
          emissiveIntensity={pcm2Active ? 0.85 : 0.45}
          roughness={0.3}
        />
      </Box>

      {/* 气凝胶 - 右 */}
      <Box args={[layers.aerogel, layers.cell.height * 0.95, layers.cell.depth * 0.95]} position={[totalWidth / 2 - layers.shell - layers.aerogel / 2, 0, 0]}>
        <meshStandardMaterial
          color={colors.aerogel}
          emissive={colors.aerogelGlow}
          emissiveIntensity={aerogelActive ? 0.55 : 0.35}
          roughness={0.9}
        />
      </Box>

      {/* 外壳 - 右 */}
      <Box args={[layers.shell, layers.cell.height, layers.cell.depth]} position={[totalWidth / 2 - layers.shell / 2, 0, 0]}>
        <meshStandardMaterial color={colors.shell} metalness={0.7} roughness={0.4} />
      </Box>
    </>
  )

  return (
    <group position={position} scale={scale}>
      {/* 本体分层包覆结构（按文档：硅胶垫→PCM1→铝箔→PCM2→气凝胶→ABS外壳） */}
      <RoundedBox
        args={[layers.cell.width + (layers.silicone * 2), layers.cell.height + 0.02, layers.cell.depth + (layers.silicone * 2)]}
        radius={0.04}
        position={[0, 0, 0]}
        renderOrder={1}
      >
        <meshStandardMaterial
          color={colors.silicone}
          emissive="#a78bfa"
          emissiveIntensity={0.35}
          roughness={0.45}
          metalness={0.15}
        />
      </RoundedBox>

      <RoundedBox
        args={[layers.cell.width + ((layers.silicone + layers.pcm1) * 2), layers.cell.height + 0.04, layers.cell.depth + ((layers.silicone + layers.pcm1) * 2)]}
        radius={0.04}
        position={[0, 0, 0]}
        renderOrder={2}
      >
        <meshStandardMaterial
          color={colors.pcm1}
          emissive={colors.pcm1Glow}
          emissiveIntensity={pcm1Active ? 0.55 : 0.22}
          roughness={0.3}
          metalness={0.05}
        />
      </RoundedBox>

      <RoundedBox
        args={[layers.cell.width + ((layers.silicone + layers.pcm1 + layers.foil) * 2), layers.cell.height + 0.05, layers.cell.depth + ((layers.silicone + layers.pcm1 + layers.foil) * 2)]}
        radius={0.04}
        position={[0, 0, 0]}
        renderOrder={3}
      >
        <meshStandardMaterial
          color={colors.foil}
          emissive="#ffffff"
          emissiveIntensity={0.02}
          metalness={0.95}
          roughness={0.12}
        />
      </RoundedBox>

      <RoundedBox
        args={[layers.cell.width + ((layers.silicone + layers.pcm1 + layers.foil + layers.pcm2) * 2), layers.cell.height + 0.06, layers.cell.depth + ((layers.silicone + layers.pcm1 + layers.foil + layers.pcm2) * 2)]}
        radius={0.04}
        position={[0, 0, 0]}
        renderOrder={4}
      >
        <meshStandardMaterial
          color={colors.pcm2}
          emissive={pcm2Active ? colors.pcm2Glow : '#60a5fa'}
          emissiveIntensity={pcm2Active ? 0.55 : 0.18}
          roughness={0.3}
          metalness={0.05}
        />
      </RoundedBox>

      <RoundedBox
        args={[layers.cell.width + ((layers.silicone + layers.pcm1 + layers.foil + layers.pcm2 + layers.aerogel) * 2), layers.cell.height + 0.08, layers.cell.depth + ((layers.silicone + layers.pcm1 + layers.foil + layers.pcm2 + layers.aerogel) * 2)]}
        radius={0.045}
        position={[0, 0, 0]}
        renderOrder={5}
      >
        <meshStandardMaterial
          color={colors.aerogel}
          emissive={colors.aerogelGlow}
          emissiveIntensity={aerogelActive ? 0.12 : 0.06}
          roughness={0.92}
          metalness={0.02}
        />
      </RoundedBox>

      {/* ABS外壳 - 半透明但更“成型”，不再遮挡内部层 */}
      <RoundedBox
        args={[totalWidth, layers.cell.height + 0.1, totalDepth]}
        radius={0.05}
        position={[0, 0, 0]}
        renderOrder={6}
      >
        <meshStandardMaterial
          color={colors.shell}
          emissive="#0ea5e9"
          emissiveIntensity={0.06}
          transparent
          opacity={0.78}
          depthWrite={false}
          roughness={0.65}
          metalness={0.35}
        />
      </RoundedBox>
      
      {/* 剖面视图 - 展示层级结构 */}
      {showCrossSection && (
        <>
          {crossSectionAxes.includes('x') && (
            <group position={[crossSectionOffsetX, 0, 0]}>
              <CrossSectionLayers />
            </group>
          )}

          {crossSectionAxes.includes('z') && (
            <>
              <group position={[0, 0, crossSectionOffsetZ]} rotation={[0, -Math.PI / 2, 0]}>
                <CrossSectionLayers />
              </group>
              <group position={[0, 0, -crossSectionOffsetZ]} rotation={[0, Math.PI / 2, 0]}>
                <CrossSectionLayers />
              </group>
            </>
          )}
        </>
      )}
      
      {/* 状态指示灯 */}
      <group position={[0, layers.cell.height/2 + 0.08, 0]}>
        <Cylinder args={[0.03, 0.03, 0.02]} rotation={[Math.PI/2, 0, 0]}>
          <meshStandardMaterial
            color={mode === 'abnormal' && temperature > 60 ? '#ef4444' : '#22c55e'}
            emissive={mode === 'abnormal' && temperature > 60 ? '#ef4444' : '#22c55e'}
            emissiveIntensity={0.8}
          />
        </Cylinder>
      </group>
    </group>
  )
}

/**
 * 电池模组（多个电池芯组合，带层级展示）
 */
export function BatteryModuleWithLayers({
  position = [0, 0, 0],
  scale = 1,
  mode,
  temperature = 28,
  isFault = false,
}: {
  position?: [number, number, number]
  scale?: number
  mode: DemoMode
  temperature?: number
  isFault?: boolean
}) {
  return (
    <group position={position} scale={scale}>
      {/* 单个电池芯展示层级结构 */}
      <BatteryCellWithLayers
        position={[0, 0, 0]}
        mode={mode}
        temperature={temperature}
        showCrossSection={true}
      />
      
      {/* 故障标识 */}
      {isFault && mode === 'abnormal' && (
        <group position={[0, 0.8, 0]}>
          {/* 热源发光效果 */}
          <pointLight color="#ef4444" intensity={2} distance={1.5} />
        </group>
      )}
    </group>
  )
}

/**
 * 电池组（多个模组排列）
 */
export function BatteryPackWithLayers({
  position = [0, 0, 0],
  scale = 1,
  mode,
  temperature = 28,
  faultIndex = -1,
}: {
  position?: [number, number, number]
  scale?: number
  mode: DemoMode
  temperature?: number
  faultIndex?: number
}) {
  const spacing = 1.8 // 模组间距
  
  return (
    <group position={position} scale={scale}>
      {/* 3个模组排列 */}
      {[-1, 0, 1].map((offset, index) => (
        <BatteryModuleWithLayers
          key={index}
          position={[offset * spacing, 0, 0]}
          mode={mode}
          temperature={index === faultIndex ? temperature : 28}
          isFault={index === faultIndex}
        />
      ))}
    </group>
  )
}

export default BatteryCellWithLayers
