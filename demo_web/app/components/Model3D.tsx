'use client'

import { useRef, useMemo, useState, useEffect, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, RoundedBox, Cylinder, Line, Html } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { BatteryModuleWithPCM, SmallBatteryModuleWithPCM, BatteryClusterWithPCM, LAYER_THICKNESS } from './BatteryModuleWithPCM'
import { BatteryCellWithLayers, BatteryModuleWithLayers, BatteryPackWithLayers } from './BatteryCellWithLayers'

type DemoMode = 'idle' | 'normal' | 'abnormal'
type ExtinguishState = 'standby' | 'active' | 'complete'

interface ModelSceneProps {
  mode: DemoMode
  temperature: number
  alertLevel: 'normal' | 'warning' | 'danger' | 'critical'
  fireWallState: 'open' | 'closing' | 'closed'
  extinguishState: ExtinguishState
  focus: 'overview' | 'light' | 'storage' | 'thermal' | 'fire'
  onModuleSelect?: (idx: BatteryModuleIndex | null) => void
}

type BatteryModuleIndex = number

const BATTERY_MODULE_POSITIONS: Array<[number, number, number]> = [
  [0.9, 0.55, 0.55],
  [0, 0.55, 0.55],
  [-0.9, 0.55, 0.55],
  [0.9, 0.55, -0.55],
  [0, 0.55, -0.55],
  [-0.9, 0.55, -0.55],
]

const FAULT_MODULE_INDEX: BatteryModuleIndex = 0

// LAYER_THICKNESS 已移至 BatteryModuleWithPCM.tsx

function ExtinguishSpray({ state, targetPos }: { state: ExtinguishState; targetPos: THREE.Vector3 }) {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 220
  const dirRef = useRef(new THREE.Vector3(0, 0, 1))
  const origin = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])

  // 将喷雾束宽锁定在防火围栏模块中心轴线上，避免覆盖到相邻模组
  const sprayHalfWidth = 0.05
  const sprayHalfHeight = 0.04

  const spriteMap = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const cx = 32
    const cy = 32
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.25, 'rgba(224,242,254,0.9)')
    g.addColorStop(0.6, 'rgba(125,211,252,0.35)')
    g.addColorStop(1, 'rgba(125,211,252,0)')
    ctx.clearRect(0, 0, 64, 64)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(cx, cy, 32, 0, Math.PI * 2)
    ctx.fill()

    const tex = new THREE.CanvasTexture(canvas)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.wrapS = THREE.ClampToEdgeWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.needsUpdate = true
    return tex
  }, [])

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // 初始喷口截面收窄，避免喷到相邻模组
      pos[i * 3] = (Math.random() - 0.5) * 0.08
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.06
      // 让粒子在喷流轴线上错开分布，避免出现“断流/忽多忽少”的密度波动
      pos[i * 3 + 2] = -Math.random() * 1.8

      vel[i * 3] = 0
      vel[i * 3 + 1] = 0
      vel[i * 3 + 2] = 0
    }
    return { positions: pos, velocities: vel }
  }, [])

  useEffect(() => {
    if (state !== 'active') return
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.08
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.06
      positions[i * 3 + 2] = -Math.random() * 1.8
      velocities[i * 3] = 0
      velocities[i * 3 + 1] = 0
      velocities[i * 3 + 2] = 0
    }
    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  }, [state, count, positions, velocities])

  useFrame((_, delta) => {
    if (!pointsRef.current || state !== 'active') return

    // 对齐到围栏外轴（喷头所在轴线），并把瞄准点下移，避免喷洒偏高
    origin.copy(targetPos).add(new THREE.Vector3(0.0, 1.86, 1.05))
    // 瞄准点收敛到目标模组中心偏后，避免覆盖到前方相邻模组
    target.copy(targetPos).add(new THREE.Vector3(0.0, 0.15, -0.18))
    dirRef.current.copy(target).sub(origin).normalize()

    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      const speed = 2.3 + (i % 7) * 0.15
      arr[i * 3] += (dirRef.current.x * speed + (Math.random() - 0.5) * 0.018) * delta
      arr[i * 3 + 1] += (dirRef.current.y * speed + (Math.random() - 0.5) * 0.018 - 0.22) * delta
      arr[i * 3 + 2] += (dirRef.current.z * speed + (Math.random() - 0.5) * 0.018) * delta

      // 硬限制喷雾束宽：始终保持在围栏中心的窄柱内
      if (arr[i * 3] > sprayHalfWidth) arr[i * 3] = sprayHalfWidth
      if (arr[i * 3] < -sprayHalfWidth) arr[i * 3] = -sprayHalfWidth
      if (arr[i * 3 + 1] > sprayHalfHeight) arr[i * 3 + 1] = sprayHalfHeight
      if (arr[i * 3 + 1] < -sprayHalfHeight) arr[i * 3 + 1] = -sprayHalfHeight

      if (arr[i * 3 + 2] > 5 || arr[i * 3 + 1] < -1) {
        arr[i * 3] = (Math.random() - 0.5) * 0.08
        arr[i * 3 + 1] = (Math.random() - 0.5) * 0.06
        arr[i * 3 + 2] = -Math.random() * 1.8
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  if (state !== 'active') return null

  // 首帧同样使用喷头外轴，避免激活瞬间位置跳变
  origin.copy(targetPos).add(new THREE.Vector3(0.0, 1.86, 1.05))
  target.copy(targetPos).add(new THREE.Vector3(0.0, 0.15, -0.18))
  dirRef.current.copy(target).sub(origin).normalize()

  return (
    <group position={[origin.x, origin.y, origin.z]} rotation={[0.05, 0, 0]} renderOrder={998}>
      <points ref={pointsRef} frustumCulled={false} renderOrder={999}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.11}
          sizeAttenuation={false}
          transparent
          opacity={1}
          color="#e0f2fe"
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          map={spriteMap ?? undefined}
          alphaMap={spriteMap ?? undefined}
        />
      </points>
    </group>
  )
}

function Callout({
  anchor,
  labelPos,
  title,
  subtitle,
}: {
  anchor: [number, number, number]
  labelPos: [number, number, number]
  title: string
  subtitle?: string
}) {
  return (
    <group>
      <Line points={[anchor, labelPos]} color="#67e8f9" lineWidth={1} dashed dashSize={0.18} gapSize={0.12} transparent opacity={0.75} />
      <group position={labelPos}>
        <Html transform distanceFactor={10} occlude={false}>
          <div
            style={{
              pointerEvents: 'none',
              padding: '6px 10px',
              borderRadius: 12,
              border: '1px solid rgba(56,189,248,0.45)',
              background: 'rgba(2,6,23,0.65)',
              boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
              backdropFilter: 'blur(8px)',
              minWidth: 120,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, color: '#67e8f9', letterSpacing: 0.4 }}>{title}</div>
            {subtitle ? <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 2 }}>{subtitle}</div> : null}
          </div>
        </Html>
      </group>
    </group>
  )
}

function StationShell() {
  return (
    <group position={[0, 0, 0]}>
      <RoundedBox args={[7.8, 2.4, 4.2]} position={[0, 1.2, 0]} radius={0.06}>
        <meshStandardMaterial color="#0b1222" transparent opacity={0.12} roughness={0.4} metalness={0.2} />
      </RoundedBox>

      <lineSegments position={[0, 1.2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(7.8, 2.4, 4.2)]} />
        <lineBasicMaterial color="#1d4ed8" transparent opacity={0.25} />
      </lineSegments>

      <RoundedBox args={[7.6, 0.05, 4.0]} position={[0, 0.025, 0]} radius={0.04}>
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.35} />
      </RoundedBox>

      <RoundedBox args={[0.04, 2.2, 3.9]} position={[-1.3, 1.1, 0]} radius={0.02}>
        <meshStandardMaterial color="#1e293b" transparent opacity={0.22} metalness={0.2} roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.04, 2.2, 3.9]} position={[1.3, 1.1, 0]} radius={0.02}>
        <meshStandardMaterial color="#1e293b" transparent opacity={0.22} metalness={0.2} roughness={0.8} />
      </RoundedBox>

      <RoundedBox args={[7.4, 2.2, 0.04]} position={[0, 1.1, -1.35]} radius={0.02}>
        <meshStandardMaterial color="#1e293b" transparent opacity={0.18} metalness={0.2} roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[7.4, 2.2, 0.04]} position={[0, 1.1, 1.35]} radius={0.02}>
        <meshStandardMaterial color="#1e293b" transparent opacity={0.18} metalness={0.2} roughness={0.8} />
      </RoundedBox>

      <RoundedBox args={[7.4, 1.8, 0.04]} position={[0, 1.0, 0.55]} radius={0.02}>
        <meshStandardMaterial color="#334155" transparent opacity={0.12} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[7.4, 1.8, 0.04]} position={[0, 1.0, -0.65]} radius={0.02}>
        <meshStandardMaterial color="#334155" transparent opacity={0.12} roughness={0.9} />
      </RoundedBox>

      {/* 三舱分区隔墙（南/中/北） */}
      <RoundedBox args={[7.4, 2.0, 0.04]} position={[0, 1.05, 0.95]} radius={0.02}>
        <meshStandardMaterial color="#1e293b" transparent opacity={0.22} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[7.4, 2.0, 0.04]} position={[0, 1.05, -0.95]} radius={0.02}>
        <meshStandardMaterial color="#1e293b" transparent opacity={0.22} roughness={0.9} />
      </RoundedBox>
    </group>
  )
}

function SwapBay() {
  return (
    <group position={[0, 0.02, 1.55]}>
      <RoundedBox args={[7.2, 0.05, 1.35]} position={[0, 0.025, 0]} radius={0.04}>
        <meshStandardMaterial color="#0b1222" metalness={0.35} roughness={0.85} />
      </RoundedBox>
      <Line points={[[-3.4, 0.06, 0.55], [3.4, 0.06, 0.55]]} color="#38bdf8" lineWidth={1} transparent opacity={0.35} />
      <Line points={[[-3.4, 0.06, -0.55], [3.4, 0.06, -0.55]]} color="#38bdf8" lineWidth={1} transparent opacity={0.35} />
      <Line points={[[-3.4, 0.06, -0.55], [-3.4, 0.06, 0.55]]} color="#38bdf8" lineWidth={1} transparent opacity={0.35} />
      <Line points={[[3.4, 0.06, -0.55], [3.4, 0.06, 0.55]]} color="#38bdf8" lineWidth={1} transparent opacity={0.35} />
    </group>
  )
}

function EquipmentBay() {
  return (
    <group position={[0, 0.02, -1.55]}>
      <RoundedBox args={[7.2, 0.05, 1.35]} position={[0, 0.025, 0]} radius={0.04}>
        <meshStandardMaterial color="#0b1222" metalness={0.35} roughness={0.85} />
      </RoundedBox>
    </group>
  )
}

function StationModel({ mode, temperature, alertLevel, fireWallState, extinguishState, onSelectModule }: Pick<ModelSceneProps, 'mode' | 'temperature' | 'alertLevel' | 'fireWallState' | 'extinguishState'> & {
  onSelectModule: (idx: BatteryModuleIndex) => void
}) {
  const fireWallActive = alertLevel === 'critical'
  const faultPos = useMemo(() => {
    const p = BATTERY_MODULE_POSITIONS[FAULT_MODULE_INDEX]
    return new THREE.Vector3(p[0], p[1], p[2])
  }, [])

  return (
    <group>
      <StationShell />
      <RoofWithSolar />

      {/* 移除文字标签，通过层级结构本身展示PCM特征 */}

      {/* 梯次储能柜（挂到主体结构里，避免漂在框架外） */}
      <group position={[-1.9, 0.03, -1.7]}>
        <EnergyStorageSystem mode={mode} temperature={temperature} />
      </group>

      <SwapBay />

      <group position={[0, 0.03, 0]}>
        <BatteryRacks mode={mode} temperature={temperature} />
        <group position={[0, 0.0, 0]}>
          <BatterySystem temperature={temperature} mode={mode} onSelectModule={onSelectModule} />
          <FireProtectionSystem active={fireWallActive} fireWallState={fireWallState} targetPos={faultPos} />
          <ExtinguishSpray state={extinguishState} targetPos={faultPos} />
        </group>
      </group>

      <EquipmentBay />
    </group>
  )
}

// RackBatteryModule 已替换为 SmallBatteryModuleWithPCM（从 BatteryModuleWithPCM.tsx 导入）

function BatteryRacks({ mode, temperature }: { mode: DemoMode; temperature: number }) {
  const racks: JSX.Element[] = []

  // 电池架 - 展示清晰的层级结构
  for (let side = -1; side <= 1; side += 2) {
    for (let col = 1; col <= 2; col++) {
      const x = side * 2.75
      const z = -0.9 + col * 0.6

      racks.push(
        <group key={`rack-${side}-${col}`} position={[x, 0.2, z]}>
          {/* 架体框架 */}
          <RoundedBox args={[0.6, 2.0, 0.9]} radius={0.04}>
            <meshStandardMaterial color="#111827" metalness={0.45} roughness={0.7} transparent opacity={0.4} />
          </RoundedBox>

          {/* 层板 - 透明展示 */}
          {[0.5, 0.9, 1.3, 1.7].map((y, i) => (
            <RoundedBox key={i} args={[0.52, 0.04, 0.82]} position={[0, y, 0]} radius={0.02}>
              <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.8} transparent opacity={0.6} />
            </RoundedBox>
          ))}

          {/* 每层展示层级结构的电池模组 */}
          {[0.55, 0.95, 1.35, 1.75].map((y, i) => (
            <BatteryCellWithLayers
              key={`cell-${i}`}
              position={[0, y, 0.1]}
              scale={0.35}
              mode={mode}
              temperature={temperature}
              showCrossSection={true}
            />
          ))}
        </group>
      )
    }
  }

  return <group>{racks}</group>
}

// BatteryModule 已替换为 BatteryModuleWithPCM（从 BatteryModuleWithPCM.tsx 导入）

function PCMSectionInset() {
  return null
}

// ============ 能量流动粒子（增强版）============
function EnergyFlowParticles({ mode }: { mode: DemoMode }) {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 120
  const tRef = useRef(0)
  const solarToStorageCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0.0, 2.85, 0.0),
          new THREE.Vector3(0.4, 2.35, -0.6),
          new THREE.Vector3(1.4, 1.25, -1.15),
          new THREE.Vector3(2.55, 0.95, -1.15),
        ],
        false
      ),
    []
  )
  const storageToBatteryCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(2.55, 0.95, -1.15),
          new THREE.Vector3(1.7, 0.95, -0.7),
          new THREE.Vector3(0.8, 0.9, -0.15),
          new THREE.Vector3(0.0, 0.95, 0.0),
        ],
        false
      ),
    []
  )
  
  const { positions, colors, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const siz = new Float32Array(count)
    const ph = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      // 分布在不同的能量流路径上（仅保留能量流，不要无用环境绿点）
      const pathType = i % 2
      if (pathType === 0) {
        // 光伏到储能路径（沿曲线连续流动）
        pos[i * 3] = 0
        pos[i * 3 + 1] = 2.5
        pos[i * 3 + 2] = -2
      } else if (pathType === 1) {
        // 储能到电池路径（沿曲线连续流动）
        pos[i * 3] = -2
        pos[i * 3 + 1] = 0.6
        pos[i * 3 + 2] = -1.2
      }

      ph[i] = Math.random()
      
      // 绿色能量粒子
      col[i * 3] = 0.13 + Math.random() * 0.2
      col[i * 3 + 1] = 0.77 + Math.random() * 0.2
      col[i * 3 + 2] = 0.37 + Math.random() * 0.2
      
      siz[i] = 0.03 + Math.random() * 0.05
    }
    return { positions: pos, colors: col, sizes: siz, phases: ph }
  }, [])

  useFrame((_, delta) => {
    if (!particlesRef.current || mode === 'idle') return
    tRef.current += delta
    const arr = particlesRef.current.geometry.attributes.position.array as Float32Array
    const colArr = particlesRef.current.geometry.attributes.color.array as Float32Array
    
    for (let i = 0; i < count; i++) {
      const pathType = i % 2
      
      if (pathType === 0) {
        // 光伏到储能：沿曲线连续流动
        const speed = mode === 'abnormal' ? 0.35 : 0.22
        const t = (phases[i] + tRef.current * speed) % 1
        const p = solarToStorageCurve.getPointAt(t)
        arr[i * 3] = p.x
        arr[i * 3 + 1] = p.y
        arr[i * 3 + 2] = p.z
      } else if (pathType === 1) {
        // 储能到电池：沿曲线连续流动
        const speed = mode === 'abnormal' ? 0.38 : 0.25
        const t = (phases[i] + tRef.current * speed) % 1
        const p = storageToBatteryCurve.getPointAt(t)
        arr[i * 3] = p.x
        arr[i * 3 + 1] = p.y
        arr[i * 3 + 2] = p.z
      } else {
        // 环境粒子：缓慢上升
        arr[i * 3 + 1] += delta * 0.3
        if (arr[i * 3 + 1] > 2.5) arr[i * 3 + 1] = 0.3
      }
      
      // 能源粒子保持绿色（异常演示时也不变色）
      colArr[i * 3] = THREE.MathUtils.clamp(colArr[i * 3], 0.13, 0.35)
      colArr[i * 3 + 1] = THREE.MathUtils.clamp(colArr[i * 3 + 1], 0.77, 0.97)
      colArr[i * 3 + 2] = THREE.MathUtils.clamp(colArr[i * 3 + 2], 0.37, 0.57)
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
    particlesRef.current.geometry.attributes.color.needsUpdate = true
  })

  if (mode === 'idle') return null

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        vertexColors 
        transparent 
        opacity={0.8} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ============ 光伏阵列（多块并联）============
function SolarArray() {
  const panels: JSX.Element[] = []
  const rows = 2
  const cols = 4
  const spacing = 1.1
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c - (cols - 1) / 2) * spacing
      const z = -0.35 + r * 0.62
      panels.push(
        <group key={`solar-${r}-${c}`} position={[x, 0.12, z]} rotation={[0.55, 0, 0]}>
          <RoundedBox args={[0.9, 0.025, 0.55]} radius={0.01}>
            <meshStandardMaterial color="#2563eb" emissive="#0ea5e9" emissiveIntensity={0.22} metalness={0.55} roughness={0.35} />
          </RoundedBox>
          {[0, 0.28].map((zx, i) => (
            <Line key={i} points={[[-0.4, 0.015, -zx], [-0.4, 0.015, zx], [0.4, 0.015, zx], [0.4, 0.015, -zx], [-0.4, 0.015, -zx]]} color="#3b82f6" lineWidth={0.3} transparent opacity={0.4} />
          ))}
          <Cylinder args={[0.015, 0.015, 0.25]} position={[0.35, -0.12, 0.2]}>
            <meshStandardMaterial color="#475569" metalness={0.9} />
          </Cylinder>
          <Cylinder args={[0.015, 0.015, 0.25]} position={[-0.35, -0.12, 0.2]}>
            <meshStandardMaterial color="#475569" metalness={0.9} />
          </Cylinder>
        </group>
      )
    }
  }
  return <group>{panels}</group>
}

function RoofWithSolar() {
  return (
    <group position={[0, 2.55, 0]}>
      {/* 简易房体 */}
      <group />
      {/* 双坡屋顶 */}
      <group position={[0, 0.1, 0.15]}>
        <RoundedBox args={[7.55, 0.08, 2.1]} position={[0, 0.35, 0]} rotation={[0.0, 0.0, 0.0]} radius={0.02}>
          <meshStandardMaterial color="#334155" metalness={0.15} roughness={0.7} emissive="#0b1222" emissiveIntensity={0.15} />
        </RoundedBox>
      </group>

      {/* 光伏阵列安装在屋顶上 */}
      <group position={[-2.15, 0.55, -0.6]}>
        <SolarArray />
      </group>
      <group position={[0.25, 0.55, -0.6]}>
        <SolarArray />
      </group>
      <group position={[2.65, 0.55, -0.6]}>
        <SolarArray />
      </group>
    </group>
  )
}

// BatteryCluster 已替换为 BatteryClusterWithPCM（从 BatteryModuleWithPCM.tsx 导入）

function EnergyStorageSystem({ mode, temperature }: { mode: DemoMode; temperature: number }) {
  // 储能柜 - 展示清晰的层级结构
  const positions: Array<[number, number]> = [
    [-0.45, -0.45],
    [0.45, -0.45],
    [-0.45, 0.45],
    [0.45, 0.45],
  ]
  
  return (
    <group>
      {/* 储能柜外壳 - 透明 */}
      <RoundedBox args={[1.4, 1.1, 1.4]} position={[0, 0.5, 0]} radius={0.08}>
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.6} transparent opacity={0.3} />
      </RoundedBox>
      
      {/* 四个电池模组，展示层级结构 */}
      {positions.map((pos, i) => (
        <BatteryCellWithLayers
          key={i}
          position={[pos[0], 0.5, pos[1]]}
          scale={0.4}
          mode={mode}
          temperature={temperature}
          showCrossSection={true}
        />
      ))}
    </group>
  )
}

// ============ 电池仓+PCM+热管理（体现内部结构）============
function BatterySystem({
  temperature,
  mode,
  onSelectModule,
}: {
  temperature: number
  mode: DemoMode
  onSelectModule: (idx: BatteryModuleIndex) => void
}) {
  const pcmMatRef = useRef<THREE.ShaderMaterial>(null)
  const fanRef = useRef<THREE.Group>(null)

  const abnormalLamp = useMemo(() => {
    if (mode !== 'abnormal') return { col: '#22c55e', emi: '#22c55e', intensity: 0.7 }
    const t = THREE.MathUtils.clamp((temperature - 45) / 55, 0, 1)
    const col = new THREE.Color('#22c55e').lerp(new THREE.Color('#f97316'), Math.min(1, t * 1.1)).lerp(new THREE.Color('#ef4444'), Math.max(0, t - 0.25) / 0.75)
    const hex = `#${col.getHexString()}`
    return { col: hex, emi: hex, intensity: 0.45 + 0.75 * t }
  }, [mode, temperature])

  const pcmColor = useMemo(() => {
    if (mode === 'abnormal' && temperature > 60) {
      return new THREE.Color('#f97316').lerp(new THREE.Color('#dc2626'), Math.min(1, (temperature - 60) / 50))
    }
    return new THREE.Color('#14b8a6')
  }, [mode, temperature])

  const melt = useMemo(() => {
    if (mode === 'abnormal') return THREE.MathUtils.clamp((temperature - 32) / 70, 0, 1)
    return THREE.MathUtils.clamp((temperature - 28) / 8, 0, 0.35)
  }, [mode, temperature])

  const pcmShader = useMemo(() => {
    const vertexShader = `
      varying vec3 vPos;
      varying vec3 vN;
      void main(){
        vPos = position;
        vN = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform float uMelt;
      uniform vec3 uBase;
      uniform vec3 uHot;
      varying vec3 vPos;
      varying vec3 vN;

      float hash(vec2 p){
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main(){
        vec2 uv = vPos.xz * 1.25;
        float n1 = noise(uv + vec2(uTime * 0.12, uTime * 0.08));
        float n2 = noise(uv * 2.2 - vec2(uTime * 0.18, uTime * 0.14));
        float n = (n1 * 0.65 + n2 * 0.35);

        float ripples = sin((uv.x + uv.y) * 7.5 + uTime * 2.0) * 0.04;
        float liquidMask = smoothstep(0.18, 0.88, uMelt + (n - 0.5) * 0.35 + ripples);

        vec3 base = mix(uBase, uHot, smoothstep(0.35, 1.0, uMelt));
        vec3 col = mix(uBase, base, liquidMask);

        float fresnel = pow(1.0 - max(dot(normalize(vN), vec3(0.0, 1.0, 0.0)), 0.0), 2.2);
        float sheen = smoothstep(0.2, 1.0, fresnel) * (0.12 + 0.22 * liquidMask);
        col += vec3(sheen);

        float alpha = mix(0.72, 0.88, liquidMask);
        gl_FragColor = vec4(col, alpha);
      }
    `;

    return { vertexShader, fragmentShader }
  }, [])

  useFrame((_, delta) => {
    if (pcmMatRef.current) {
      pcmMatRef.current.uniforms.uTime.value += delta
      pcmMatRef.current.uniforms.uMelt.value = THREE.MathUtils.lerp(
        pcmMatRef.current.uniforms.uMelt.value,
        melt,
        1 - Math.pow(0.001, delta)
      )
      pcmMatRef.current.uniforms.uBase.value.copy(pcmColor)
    }
    if (fanRef.current) {
      const target = mode === 'idle' ? 0 : mode === 'abnormal' ? 5.5 : 2.8
      fanRef.current.rotation.z += delta * target
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* 仓体外壳 - 半透明可见内部 */}
      <RoundedBox
        args={[3.2, 1.8, 2.2]}
        position={[0, 0.9, 0]}
        radius={0.06}
        raycast={() => null}
      >
        <meshStandardMaterial color="#0f172a" transparent opacity={0.22} roughness={0.15} metalness={0.3} />
      </RoundedBox>
      
      {/* 边缘框架 */}
      <lineSegments position={[0, 0.9, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(3.2, 1.8, 2.2)]} />
        <lineBasicMaterial color="#475569" transparent opacity={0.5} />
      </lineSegments>

      {/* PCM相变材料层（底部） */}
      <RoundedBox args={[3, 0.25, 2]} position={[0, 0.13, 0]} radius={0.03} raycast={() => null}>
        <shaderMaterial
          ref={pcmMatRef}
          vertexShader={pcmShader.vertexShader}
          fragmentShader={pcmShader.fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
            uMelt: { value: melt },
            uBase: { value: pcmColor.clone() },
            uHot: { value: new THREE.Color('#ef4444') },
          }}
        />
      </RoundedBox>

      
      {/* 电池模组（3x2阵列，每个模组都有完整的层级包裹） */}
      {BATTERY_MODULE_POSITIONS.map((pos, i) => (
        <BatteryModuleWithPCM
          key={`bm-${i}`}
          position={pos as [number, number, number]}
          isFault={i === FAULT_MODULE_INDEX}
          mode={mode}
          temperature={temperature}
          onDoubleClick={() => onSelectModule(i)}
        />
      ))}

      {/* 双级PCM隔层：每两个电池模组之间都有两层（一级 + 二级） */}
      {[-0.45, 0.45].map((x, i) => (
        <group key={`pcm-sep-x-${i}`} position={[x, 0.55, 0]}>
          <RoundedBox args={[0.012, 0.95, 1.1]} position={[-0.055, 0, 0]} radius={0.01}>
            <meshStandardMaterial color="#475569" emissive="#0b1222" emissiveIntensity={0.06} transparent opacity={0.18} roughness={0.55} metalness={0.25} depthWrite={false} />
          </RoundedBox>
          <RoundedBox args={[0.01, 0.95, 1.1]} position={[-0.046, 0, 0]} radius={0.01}>
            <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.12} transparent opacity={0.14} roughness={0.35} metalness={0.1} depthWrite={false} />
          </RoundedBox>
          <RoundedBox args={[0.014, 0.95, 1.1]} position={[-0.035, 0, 0]} radius={0.01}>
            <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={0.05} transparent opacity={0.2} roughness={0.65} metalness={0.05} depthWrite={false} />
          </RoundedBox>
          <RoundedBox args={[0.014, 0.95, 1.1]} position={[-0.017, 0, 0]} radius={0.01}>
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={mode === 'abnormal' ? 0.28 : 0.16} transparent opacity={0.22} roughness={0.25} metalness={0.05} depthWrite={false} />
          </RoundedBox>
          <RoundedBox args={[0.01, 0.95, 1.1]} position={[0.002, 0, 0]} radius={0.008}>
            <meshStandardMaterial color="#e2e8f0" emissive="#e2e8f0" emissiveIntensity={0.08} transparent opacity={0.22} roughness={0.25} metalness={0.8} depthWrite={false} />
          </RoundedBox>
          <RoundedBox args={[0.014, 0.95, 1.1]} position={[0.02, 0, 0]} radius={0.01}>
            <meshStandardMaterial
              color={mode === 'abnormal' ? '#f97316' : '#60a5fa'}
              emissive={mode === 'abnormal' ? '#fb7185' : '#60a5fa'}
              emissiveIntensity={mode === 'abnormal' ? 0.32 : 0.14}
              transparent
              opacity={mode === 'abnormal' && temperature >= 55 ? 0.3 : 0.16}
              roughness={0.25}
              metalness={0.05}
              depthWrite={false}
            />
          </RoundedBox>
          <RoundedBox args={[0.014, 0.95, 1.1]} position={[0.038, 0, 0]} radius={0.01}>
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.04} transparent opacity={0.12} roughness={0.85} metalness={0.0} depthWrite={false} />
          </RoundedBox>
        </group>
      ))}

      {[0].map((z, i) => (
        <group key={`pcm-sep-z-${i}`} position={[0, 0.55, z]}>
          <RoundedBox args={[2.65, 0.95, 0.012]} position={[0, 0, -0.055]} radius={0.01}>
            <meshStandardMaterial color="#475569" emissive="#0b1222" emissiveIntensity={0.06} transparent opacity={0.18} roughness={0.55} metalness={0.25} depthWrite={false} />
          </RoundedBox>
          <RoundedBox args={[2.65, 0.95, 0.01]} position={[0, 0, -0.046]} radius={0.01}>
            <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.12} transparent opacity={0.14} roughness={0.35} metalness={0.1} depthWrite={false} />
          </RoundedBox>
          <RoundedBox args={[2.65, 0.95, 0.014]} position={[0, 0, -0.035]} radius={0.01}>
            <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={0.05} transparent opacity={0.2} roughness={0.65} metalness={0.05} depthWrite={false} />
          </RoundedBox>
          <RoundedBox args={[2.65, 0.95, 0.014]} position={[0, 0, -0.017]} radius={0.01}>
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={mode === 'abnormal' ? 0.26 : 0.14} transparent opacity={0.22} roughness={0.25} metalness={0.05} depthWrite={false} />
          </RoundedBox>
          <RoundedBox args={[2.65, 0.95, 0.01]} position={[0, 0, 0.002]} radius={0.008}>
            <meshStandardMaterial color="#e2e8f0" emissive="#e2e8f0" emissiveIntensity={0.08} transparent opacity={0.22} roughness={0.25} metalness={0.8} depthWrite={false} />
          </RoundedBox>
          <RoundedBox args={[2.65, 0.95, 0.014]} position={[0, 0, 0.02]} radius={0.01}>
            <meshStandardMaterial
              color={mode === 'abnormal' ? '#f97316' : '#60a5fa'}
              emissive={mode === 'abnormal' ? '#fb7185' : '#60a5fa'}
              emissiveIntensity={mode === 'abnormal' ? 0.32 : 0.14}
              transparent
              opacity={mode === 'abnormal' && temperature >= 55 ? 0.28 : 0.14}
              roughness={0.25}
              metalness={0.05}
              depthWrite={false}
            />
          </RoundedBox>
          <RoundedBox args={[2.65, 0.95, 0.014]} position={[0, 0, 0.038]} radius={0.01}>
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.04} transparent opacity={0.12} roughness={0.85} metalness={0.0} depthWrite={false} />
          </RoundedBox>
        </group>
      ))}

      {/* 散热风扇 */}
      <group position={[1.65, 0.9, 0]}>
        <Cylinder args={[0.15, 0.15, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </Cylinder>
        <group ref={fanRef} position={[0, 0, 0.04]}>
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <RoundedBox key={i} args={[0.25, 0.015, 0.03]} position={[0, 0, 0]} rotation={[0, 0, (angle * Math.PI) / 180]}>
              <meshStandardMaterial color="#475569" />
            </RoundedBox>
          ))}
        </group>
      </group>
    </group>
  )
}

// ============ 消防系统 ============
function FireProtectionSystem({
  active,
  fireWallState,
  targetPos,
}: {
  active: boolean
  fireWallState: 'open' | 'closing' | 'closed'
  targetPos: THREE.Vector3
}) {
  const wallRef = useRef<THREE.Group>(null)
  const wallProgressRef = useRef(0)

  useFrame((_, delta) => {
    const speed = 1 / 3
    if (fireWallState === 'open') wallProgressRef.current = Math.max(0, wallProgressRef.current - delta * 1.8)
    if (fireWallState === 'closing') wallProgressRef.current = Math.min(1, wallProgressRef.current + delta * speed)
    if (fireWallState === 'closed') wallProgressRef.current = Math.min(1, wallProgressRef.current + delta * 1.8)

    if (wallRef.current) {
      const p = wallProgressRef.current
      const startY = 2.25
      const endY = 0.55
      wallRef.current.position.x = targetPos.x
      wallRef.current.position.y = startY - p * (startY - endY)
      wallRef.current.position.z = targetPos.z
      wallRef.current.rotation.set(0, 0, 0)
    }
  })

  return (
    <group>
      {/* 防火隔离墙（滑入式） */}
      <group ref={wallRef} position={[0, 2.6, 0.55]}>
        <group>
          <RoundedBox args={[1.15, 0.9, 0.04]} position={[0, 0, 0.6]} radius={0.02}>
            <meshStandardMaterial 
              color="#dc2626" 
              emissive={active ? '#ef4444' : '#991b1b'}
              emissiveIntensity={active ? 0.9 : 0.3}
              transparent 
              opacity={active ? 0.85 : 0.6}
            />
          </RoundedBox>
          <RoundedBox args={[1.15, 0.9, 0.04]} position={[0, 0, -0.6]} radius={0.02}>
            <meshStandardMaterial 
              color="#dc2626" 
              emissive={active ? '#ef4444' : '#991b1b'}
              emissiveIntensity={active ? 0.9 : 0.3}
              transparent 
              opacity={active ? 0.85 : 0.6}
            />
          </RoundedBox>
          <RoundedBox args={[0.04, 0.9, 1.12]} position={[0.57, 0, 0]} radius={0.02}>
            <meshStandardMaterial 
              color="#dc2626" 
              emissive={active ? '#ef4444' : '#991b1b'}
              emissiveIntensity={active ? 0.9 : 0.3}
              transparent 
              opacity={active ? 0.85 : 0.6}
            />
          </RoundedBox>
          <RoundedBox args={[0.04, 0.9, 1.12]} position={[-0.57, 0, 0]} radius={0.02}>
            <meshStandardMaterial 
              color="#dc2626" 
              emissive={active ? '#ef4444' : '#991b1b'}
              emissiveIntensity={active ? 0.9 : 0.3}
              transparent 
              opacity={active ? 0.85 : 0.6}
            />
          </RoundedBox>
          <RoundedBox args={[1.22, 0.05, 1.18]} position={[0, 0.48, 0]} radius={0.02}>
            <meshStandardMaterial color="#475569" metalness={0.95} />
          </RoundedBox>

          <lineSegments renderOrder={999}>
            <edgesGeometry args={[new THREE.BoxGeometry(1.24, 0.96, 1.24)]} />
            <lineBasicMaterial color="#fb7185" transparent opacity={active ? 1 : 0.7} depthTest={false} depthWrite={false} />
          </lineSegments>
        </group>
      </group>

      {/* 喷头 */}
      {[[-0.8, 1.85, 1], [0, 1.85, 1], [0.8, 1.85, 1]].map((pos, i) => (
        <Cylinder key={i} args={[0.025, 0.025, 0.08]} position={pos as [number, number, number]}>
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </Cylinder>
      ))}
    </group>
  )
}

// ============ 传感器系统 ============
function SensorSystem({ mode, temperature }: { mode: DemoMode; temperature: number }) {
  const sensorColor = mode === 'abnormal' && temperature > 60 ? '#ef4444' : '#22c55e'
  
  return (
    <group>
      {/* 红外温度传感器 */}
      <group position={[1.8, 2.3, 0]}>
        <RoundedBox args={[0.15, 0.15, 0.08]} radius={0.02}>
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </RoundedBox>
        <pointLight color={sensorColor} intensity={0.5} distance={1} />
      </group>
      
      {/* 热电偶阵列 */}
      {[[-0.5, 1.7, 1], [0.5, 1.7, 1], [0, 1.7, 1]].map((pos, i) => (
        <Cylinder key={i} args={[0.008, 0.008, 0.25]} position={pos as [number, number, number]} rotation={[0.2, 0, 0]}>
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
        </Cylinder>
      ))}
      
      {/* CO传感器 */}
      <RoundedBox args={[0.1, 0.1, 0.06]} position={[1.2, 2, 1]} radius={0.015}>
        <meshStandardMaterial color="#1e293b" metalness={0.9} />
      </RoundedBox>
    </group>
  )
}

// ============ 数据流连接线 ============
function DataConnectionLines({ mode }: { mode: DemoMode }) {
  const lineColor = mode === 'abnormal' ? '#f87171' : mode === 'normal' ? '#22c55e' : '#8b5cf6'
  
  return (
    <group>
      {/* 光伏到储能 */}
      <Line points={[[-2, 2.8, -2.2], [-2.5, 0.5, -1.5]]} color={lineColor} lineWidth={1} transparent opacity={0.4} />
      <Line points={[[1, 2.8, -2.2], [-2.5, 0.5, -1.5]]} color={lineColor} lineWidth={1} transparent opacity={0.4} />
      {/* 储能到电池 */}
      <Line points={[[-2.5, 0, -1], [0, 0.5, 0]]} color={lineColor} lineWidth={1} transparent opacity={0.4} />
      <Line points={[[-1.6, 0, -1], [0, 0.5, 0]]} color={lineColor} lineWidth={1} transparent opacity={0.4} />
    </group>
  )
}

function CameraRig({
  focus,
  controlsRef,
}: {
  focus: ModelSceneProps['focus']
  controlsRef: RefObject<any>
}) {
  const { camera } = useThree()

  const targetPosRef = useRef(new THREE.Vector3(6, 4, 8))
  const targetLookRef = useRef(new THREE.Vector3(0, 0.9, 0))
  const tmpV = useMemo(() => new THREE.Vector3(), [])
  const isAutoMoveRef = useRef(true)
  const lastFocusRef = useRef<ModelSceneProps['focus']>('overview')

  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (controls && controls.__isUserInteracting) {
      isAutoMoveRef.current = false
      return
    }

    if (focus !== lastFocusRef.current) {
      lastFocusRef.current = focus
      isAutoMoveRef.current = true
    }

    if (!isAutoMoveRef.current) return

    const presets: Record<ModelSceneProps['focus'], { pos: [number, number, number]; look: [number, number, number] }> = {
      overview: { pos: [9.5, 6.2, 9.8], look: [0, 1.0, 0] },
      light: { pos: [0.0, 4.15, -2.65], look: [0.0, 2.75, -0.75] },
      storage: { pos: [-5.2, 2.2, -2.4], look: [-2.1, 0.55, -1.1] },
      thermal: { pos: [4.9, 2.9, 4.8], look: [0, 0.95, 0.2] },
      fire: { pos: [0.1, 2.2, 5.4], look: [0, 1.0, 1.1] },
    }

    const preset = presets[focus]
    targetPosRef.current.set(preset.pos[0], preset.pos[1], preset.pos[2])
    targetLookRef.current.set(preset.look[0], preset.look[1], preset.look[2])

    const t = 1 - Math.pow(0.0006, delta)
    camera.position.lerp(targetPosRef.current, t)

    if (controls && controls.target) {
      tmpV.copy(controls.target)
      tmpV.lerp(targetLookRef.current, t)
      controls.target.copy(tmpV)
      controls.update()
    } else {
      camera.lookAt(targetLookRef.current)
    }

    const posDone = camera.position.distanceTo(targetPosRef.current) < 0.02
    const lookDone = controls && controls.target ? controls.target.distanceTo(targetLookRef.current) < 0.02 : true
    if (posDone && lookDone) {
      isAutoMoveRef.current = false
    }
  })

  return null
}

// ============ 主体底座 ============
function Platform() {
  return (
    <group>
      <RoundedBox args={[8, 0.1, 5]} position={[0, -0.05, 0]} radius={0.03}>
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </RoundedBox>
      {/* 地板网格 */}
      <gridHelper args={[16, 32, '#1e3a5f', '#0f172a']} position={[0, 0.01, 0]} />
    </group>
  )
}

// ============ 主场景 ============
function Scene({
  mode,
  temperature,
  alertLevel,
  fireWallState,
  extinguishState,
  focus,
}: ModelSceneProps) {
  const fireWallActive = alertLevel === 'critical'
  const controlsRef = useRef<any>(null)
  
  return (
    <>
      {/* 增强光照系统 - 提升材质质感 */}
      <ambientLight intensity={0.35} />
      <hemisphereLight intensity={0.5} color="#e0f2fe" groundColor="#0f172a" />
      <directionalLight
        position={[8, 12, 8]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-bias={-0.00008}
        shadow-normalBias={0.015}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      {/* PCM层级高光点光源 */}
      <pointLight position={[-6, 3, -4]} intensity={0.8} color="#06b6d4" distance={12} />
      <pointLight position={[0, 2, 6]} intensity={0.5} color="#22c55e" distance={10} />
      <pointLight position={[4, 2, 0]} intensity={0.6} color="#3b82f6" distance={8} />
      {/* 环境补光 */}
      <rectAreaLight position={[0, 4, -3]} intensity={0.4} color="#f0fdfa" width={8} height={4} />
      
      <Platform />
      <StationModel
        mode={mode}
        temperature={temperature}
        alertLevel={alertLevel}
        fireWallState={fireWallState}
        extinguishState={extinguishState}
        onSelectModule={() => null}
      />

      <PCMSectionInset />
      <SensorSystem mode={mode} temperature={temperature} />
      
      <EnergyFlowParticles mode={mode} />
      {null}

      <CameraRig focus={focus} controlsRef={controlsRef} />
      
      <OrbitControls 
        ref={controlsRef}
        enablePan={true}
        enableRotate
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={24}
        minPolarAngle={0}
        maxPolarAngle={Math.PI * 0.92}
        onStart={() => {
          if (controlsRef.current) controlsRef.current.__isUserInteracting = true
        }}
        onEnd={() => {
          if (controlsRef.current) controlsRef.current.__isUserInteracting = false
        }}
      />

      {/* 增强后处理效果 */}
      <EffectComposer multisampling={4}>
        <Bloom
          intensity={fireWallActive ? 1.5 : mode === 'normal' ? 0.8 : 0.4}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.85}
          mipmapBlur
          radius={0.8}
        />
        <Vignette eskil={false} offset={0.15} darkness={0.65} />
      </EffectComposer>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
    </>
  )
}

export default function Model3D(props: ModelSceneProps) {
  return (
    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #0a0f1a 0%, #0f172a 100%)' }}>
      <Canvas
        shadows="soft"
        dpr={Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 1)}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
        }}
        camera={{ position: [6, 4, 8], fov: 42 }}
      >
        <color attach="background" args={['#0a0f1a']} />
        <fog attach="fog" args={['#0a0f1a', 10, 28]} />
        <Scene {...props} />
      </Canvas>
    </div>
  )
}
