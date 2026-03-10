'use client'

import { useRef, useMemo, useState, useEffect, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, RoundedBox, Cylinder, Line, Html, Box } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { BatteryModuleWithPCM, SmallBatteryModuleWithPCM, BatteryClusterWithPCM, LAYER_THICKNESS } from './BatteryModuleWithPCM'
import { BatteryCellWithLayers, BatteryModuleWithLayers, BatteryPackWithLayers } from './BatteryCellWithLayers'

type DemoMode = 'idle' | 'normal' | 'abnormal'
type ExtinguishState = 'standby' | 'active' | 'complete'

const HIDE_BATTERY_MODULES = false

const DEBUG_HIDE_LEVEL = 0

const DEBUG_HIDE_BAYS_LEVEL = 0

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

const BATTERY_SYSTEM_MODULE_POSITIONS: Array<[number, number, number]> = [
  [1.12, 0.55, 0.9],
  [0.37, 0.55, 0.9],
  [-0.37, 0.55, 0.9],
  [-1.12, 0.55, 0.9],
  [1.12, 0.55, 0.3],
  [0.37, 0.55, 0.3],
  [-0.37, 0.55, 0.3],
  [-1.12, 0.55, 0.3],
  [1.12, 0.55, -0.3],
  [0.37, 0.55, -0.3],
  [-0.37, 0.55, -0.3],
  [-1.12, 0.55, -0.3],
  [1.12, 0.55, -0.9],
  [0.37, 0.55, -0.9],
  [-0.37, 0.55, -0.9],
  [-1.12, 0.55, -0.9],
]

const FAULT_MODULE_INDEX: BatteryModuleIndex = 0

// LAYER_THICKNESS 已移至 BatteryModuleWithPCM.tsx

function ExtinguishSpray({ state, targetPos }: { state: ExtinguishState; targetPos: THREE.Vector3 }) {
  const pointsRef = useRef<THREE.Points>(null)
  const nozzleRef = useRef<THREE.Mesh>(null)
  const count = 400 // 进一步增加粒子数量
  const origin = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  
  // 动画状态控制
  const fadeProgressRef = useRef(0)

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
    g.addColorStop(0.15, 'rgba(224,242,254,0.95)') // 增强核心亮度
    g.addColorStop(0.4, 'rgba(125,211,252,0.5)')  // 增加中间层浓度
    g.addColorStop(1, 'rgba(125,211,252,0)')
    ctx.clearRect(0, 0, 64, 64)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(cx, cy, 32, 0, Math.PI * 2)
    ctx.fill()

    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])

  const { positions, velocities, lifetimes } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const life = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 0.12
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.random() * -0.5 // 垂直分布在起点下方
      pos[i * 3 + 2] = Math.sin(angle) * radius

      vel[i * 3] = (Math.random() - 0.5) * 0.15
      vel[i * 3 + 1] = -2.0 - Math.random() * 1.5
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.15
      
      life[i] = Math.random()
    }
    return { positions: pos, velocities: vel, lifetimes: life }
  }, [])

  useFrame((_, delta) => {
    const isActive = state === 'active'
    
    // 平滑淡入淡出逻辑
    if (isActive) {
      fadeProgressRef.current = Math.min(1, fadeProgressRef.current + delta * 1.2) // 约0.8秒完全淡入
    } else {
      fadeProgressRef.current = Math.max(0, fadeProgressRef.current - delta * 2.0) // 约0.5秒淡出
    }

    if (!pointsRef.current || fadeProgressRef.current <= 0) return

    // 更新材质透明度
    if (pointsRef.current.material) {
      (pointsRef.current.material as THREE.PointsMaterial).opacity = fadeProgressRef.current * 0.8
    }
    if (nozzleRef.current && nozzleRef.current.material) {
      (nozzleRef.current.material as THREE.MeshStandardMaterial).opacity = fadeProgressRef.current
      nozzleRef.current.scale.setScalar(0.5 + 0.5 * fadeProgressRef.current) // 喷头也有个缩放动画
    }

    // 只有在激活时才进行物理更新
    if (isActive || fadeProgressRef.current > 0) {
      origin.copy(targetPos).add(new THREE.Vector3(0, 1.2, 0))
      target.copy(targetPos)

      const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        lifetimes[i] += delta * 1.6
        if (lifetimes[i] > 1.0) {
          lifetimes[i] = 0
          const angle = Math.random() * Math.PI * 2
          const radius = Math.random() * 0.18
          posArr[i * 3] = Math.cos(angle) * radius
          posArr[i * 3 + 1] = 0.05
          posArr[i * 3 + 2] = Math.sin(angle) * radius
          
          velocities[i * 3] = (Math.random() - 0.5) * 0.25
          velocities[i * 3 + 1] = -2.5 - Math.random() * 2.0
          velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.25
        }

        posArr[i * 3] += velocities[i * 3] * delta
        posArr[i * 3 + 1] += velocities[i * 3 + 1] * delta
        posArr[i * 3 + 2] += velocities[i * 3 + 2] * delta
        velocities[i * 3 + 1] -= 3.5 * delta // 加强重力感
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.position.copy(origin)
    }
  })

  // 如果完全不可见则不渲染
  // 注意：为了平滑淡出，这里不能在 state !== 'active' 时立即 return null
  // 而是通过 fadeProgressRef 控制

  return (
    <group renderOrder={998}>
      <points ref={pointsRef} frustumCulled={false} visible={true}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.15} // 增大粒子尺寸，提高可见度
          sizeAttenuation={true}
          transparent
          opacity={0} // 初始透明度为0，由 fadeProgress 控制
          color="#f0f9ff"
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          map={spriteMap ?? undefined}
        />
      </points>
      
      {/* 顶部喷口装饰 - 带淡入效果 */}
      <mesh ref={nozzleRef} position={[targetPos.x, targetPos.y + 1.25, targetPos.z]}>
        <cylinderGeometry args={[0.08, 0.1, 0.1, 16]} />
        <meshStandardMaterial 
          color="#334155" 
          metalness={0.8} 
          roughness={0.2} 
          transparent 
          opacity={0} 
        />
      </mesh>
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
      <RoundedBox args={[7.8, 2.4, 4.2]} position={[0, 1.2, 0]} radius={0.06} renderOrder={1}>
        <meshStandardMaterial
          color="#e2e8f0"
          transparent
          opacity={0.12}
          roughness={0.35}
          metalness={0.05}
          depthWrite={false}
        />
      </RoundedBox>

      <lineSegments position={[0, 1.2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(7.8, 2.4, 4.2)]} />
        <lineBasicMaterial color="#0ea5e9" transparent opacity={0.16} depthWrite={false} />
      </lineSegments>

      <RoundedBox args={[7.6, 0.05, 4.0]} position={[0, 0.025, 0]} radius={0.04}>
        <meshStandardMaterial color="#cbd5e1" metalness={0.2} roughness={0.5} />
      </RoundedBox>

      <RoundedBox args={[7.4, 2.2, 0.04]} position={[0, 1.1, -1.35]} radius={0.02} renderOrder={2}>
        <meshStandardMaterial
          color="#cbd5e1"
          transparent
          opacity={0.18}
          metalness={0.08}
          roughness={0.6}
          depthWrite={false}
        />
      </RoundedBox>
      <RoundedBox args={[7.4, 2.2, 0.04]} position={[0, 1.1, 1.35]} radius={0.02} renderOrder={2}>
        <meshStandardMaterial
          color="#cbd5e1"
          transparent
          opacity={0.18}
          metalness={0.08}
          roughness={0.6}
          depthWrite={false}
        />
      </RoundedBox>
    </group>
  )
}

function SwapBay() {
  return (
    <group position={[0, 0.02, 1.55]}>
      <RoundedBox args={[7.2, 0.05, 1.35]} position={[0, 0.025, 0]} radius={0.04}>
        <meshStandardMaterial color="#e2e8f0" metalness={0.12} roughness={0.8} />
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
        <meshStandardMaterial color="#e2e8f0" metalness={0.12} roughness={0.8} />
      </RoundedBox>
    </group>
  )
}

function StationModel({ mode, temperature, alertLevel, fireWallState, extinguishState, onSelectModule }: Pick<ModelSceneProps, 'mode' | 'temperature' | 'alertLevel' | 'fireWallState' | 'extinguishState'> & {
  onSelectModule: (idx: BatteryModuleIndex) => void
}) {
  const fireWallActive = alertLevel === 'critical'
  const hideStationShell = DEBUG_HIDE_LEVEL >= 1
  const hideRoof = DEBUG_HIDE_LEVEL >= 2
  const debugBays = DEBUG_HIDE_LEVEL >= 3
  const hideEnergyStorage = debugBays && DEBUG_HIDE_BAYS_LEVEL >= 1
  const hideBatteryRacks = debugBays && DEBUG_HIDE_BAYS_LEVEL >= 2
  const hideBatterySystem = debugBays && DEBUG_HIDE_BAYS_LEVEL >= 3
  const hideFireProtection = debugBays && DEBUG_HIDE_BAYS_LEVEL >= 4
  const hideExtinguish = debugBays && DEBUG_HIDE_BAYS_LEVEL >= 5
  const hideBaysFloors = DEBUG_HIDE_LEVEL >= 4
  const faultPos = useMemo(() => {
    const p = BATTERY_SYSTEM_MODULE_POSITIONS[FAULT_MODULE_INDEX]
    return new THREE.Vector3(p[0], p[1], p[2])
  }, [])

  return (
    <group>
      {!hideStationShell && <StationShell />}
      {!hideRoof && <RoofWithSolar />}

      {/* 移除文字标签，通过层级结构本身展示PCM特征 */}

      {/* 梯次储能柜（挂到主体结构里，避免漂在框架外） */}
      {!hideEnergyStorage && (
        <group position={[-1.9, 0.03, -1.7]}>
          <EnergyStorageSystem mode={mode} temperature={temperature} />
        </group>
      )}

      {!hideBaysFloors && <SwapBay />}

      {(!hideBatteryRacks || !hideBatterySystem || (!hideFireProtection && fireWallActive && fireWallState !== 'open') || (!hideExtinguish && extinguishState !== 'standby')) && (
        <group position={[0, 0.03, 0]}>
          {!hideBatteryRacks && <BatteryRacks mode={mode} temperature={temperature} />}
          <group position={[0, 0.0, 0]}>
            {!hideBatterySystem && <BatterySystem temperature={temperature} mode={mode} onSelectModule={onSelectModule} />}
            {!hideFireProtection && fireWallActive && fireWallState !== 'open' && (
              <FireProtectionSystem active={fireWallActive} fireWallState={fireWallState} targetPos={faultPos} />
            )}
            {!hideExtinguish && extinguishState !== 'standby' && <ExtinguishSpray state={extinguishState} targetPos={faultPos} />}
          </group>
        </group>
      )}

      {!hideBaysFloors && <EquipmentBay />}
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
        <group key={`rack-${side}-${col}`} position={[x, 0.45, z]}>
          {/* 架体框架 */}
          <RoundedBox args={[0.6, 2.0, 0.9]} radius={0.04} renderOrder={3}>
            <meshStandardMaterial
              color="#0f172a"
              transparent
              opacity={0.14}
              roughness={0.25}
              metalness={0.25}
              depthWrite={false}
            />
          </RoundedBox>

          <lineSegments renderOrder={4}>
            <edgesGeometry args={[new THREE.BoxGeometry(0.6, 2.0, 0.9)]} />
            <lineBasicMaterial color="#1e293b" transparent opacity={0.18} depthTest={true} depthWrite={false} />
          </lineSegments>

          {/* 层板 - 透明展示 */}
          {[-0.35, -0.05, 0.25, 0.55, 0.85].map((y, i) => (
            <RoundedBox key={i} args={[0.52, 0.04, 0.82]} position={[0, y, 0]} radius={0.02}>
              <meshStandardMaterial
                color="#1e293b"
                metalness={0.35}
                roughness={0.6}
                transparent
                opacity={0.18}
                depthWrite={false}
              />
            </RoundedBox>
          ))}

          {/* 每层展示层级结构的电池模组 */}
          {!HIDE_BATTERY_MODULES &&
            [-0.3, 0.0, 0.3, 0.6, 0.9].flatMap((y, rowIdx) =>
              [-0.18, 0.0, 0.18].map((xOff, colIdx) => (
                <BatteryModuleWithPCM
                  key={`cell-${rowIdx}-${colIdx}`}
                  position={[xOff, y, 0.12]}
                  scale={0.145}
                  mode={mode}
                  temperature={temperature}
                  isFault={false}
                  showDetails={false}
                />
              ))
            )}
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

// ============ 光伏阵列（真实太阳能板样式）============
function SolarArray({
  rows = 2,
  cols = 2,
  spacing = 1.02,
}: {
  rows?: number
  cols?: number
  spacing?: number
}) {
  const panels: JSX.Element[] = []

  // 单块太阳能板组件
  const SolarPanel = ({ position }: { position: [number, number, number] }) => (
    <group position={position} rotation={[0.55, 0, 0]}>
      {/* 铝合金边框 */}
      <RoundedBox args={[0.95, 0.035, 0.6]} radius={0.008}>
        <meshStandardMaterial color="#c0c0c0" metalness={0.85} roughness={0.25} />
      </RoundedBox>

      {/* 光伏电池片（深蓝/深紫） */}
      <RoundedBox args={[0.88, 0.03, 0.53]} position={[0, 0.003, 0]} radius={0.005}>
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#1e3a5f"
          emissiveIntensity={0.15}
          metalness={0.3}
          roughness={0.15}
        />
      </RoundedBox>

      {/* 电池片网格线（银色汇流条） */}
      {/* 主汇流条（竖向） */}
      {[-0.35, -0.12, 0.12, 0.35].map((x, i) => (
        <Box key={`vbus-${i}`} args={[0.008, 0.001, 0.48]} position={[x, 0.018, 0]}>
          <meshStandardMaterial color="#d4d4d4" metalness={0.9} roughness={0.1} />
        </Box>
      ))}
      {/* 横向细栅线 */}
      {[-0.18, 0, 0.18].map((z, i) => (
        <Box key={`hbus-${i}`} args={[0.82, 0.001, 0.003]} position={[0, 0.018, z]}>
          <meshStandardMaterial color="#a3a3a3" metalness={0.7} roughness={0.2} />
        </Box>
      ))}

      {/* 接线盒（背面） */}
      <Box args={[0.12, 0.04, 0.08]} position={[0, -0.035, 0.2]}>
        <meshStandardMaterial color="#262626" metalness={0.5} roughness={0.6} />
      </Box>

      {/* 支架 */}
      <Cylinder args={[0.012, 0.012, 0.28]} position={[0.38, -0.14, 0.22]}>
        <meshStandardMaterial color="#71717a" metalness={0.85} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.012, 0.012, 0.28]} position={[-0.38, -0.14, 0.22]}>
        <meshStandardMaterial color="#71717a" metalness={0.85} roughness={0.3} />
      </Cylinder>
    </group>
  )

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c - (cols - 1) / 2) * spacing
      const z = -0.35 + r * 0.62
      panels.push(<SolarPanel key={`solar-${r}-${c}`} position={[x, 0.12, z]} />)
    }
  }
  return <group>{panels}</group>
}

function RoofWithSolar() {
  const rows = 2
  const cols = 6
  const spacing = 1.02

  return (
    <group position={[0, 2.55, 0]}>
      {/* 简易房体 */}
      <group />
      {/* 双坡屋顶 */}
      <group position={[0, 0.1, 0.15]}>
        <RoundedBox args={[7.55, 0.08, 2.1]} position={[0, 0.35, 0]} rotation={[0.0, 0.0, 0.0]} radius={0.02}>
          <meshStandardMaterial color="#cbd5e1" metalness={0.12} roughness={0.65} emissive="#e0f2fe" emissiveIntensity={0.08} />
        </RoundedBox>
      </group>

      {/* 光伏阵列安装在屋顶上 */}
      <group position={[0, 0.55, -0.6]}>
        <SolarArray rows={rows} cols={cols} spacing={spacing} />
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
      {/* 储能柜外壳 - 透明优化 */}
      <RoundedBox args={[1.4, 1.1, 1.4]} position={[0, 0.5, 0]} radius={0.08} renderOrder={4}>
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.4}
          roughness={0.7}
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </RoundedBox>

      {/* 中央结构隔板已删除 */}
      
      {/* 储能柜内部电池簇已删除 */}
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
        renderOrder={3}
      >
        <meshStandardMaterial
          color="#0f172a"
          transparent
          opacity={0.14}
          roughness={0.25}
          metalness={0.25}
          depthWrite={false}
        />
      </RoundedBox>
      
      {/* 边缘框架 */}
      <lineSegments position={[0, 0.9, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(3.2, 1.8, 2.2)]} />
        <lineBasicMaterial color="#334155" transparent opacity={0.12} depthWrite={false} />
      </lineSegments>

      {/* PCM相变材料层已删除 */}

      {!HIDE_BATTERY_MODULES &&
        BATTERY_SYSTEM_MODULE_POSITIONS.map((pos, i) => (
          <group key={`bm-${i}`} position={pos as [number, number, number]} onDoubleClick={() => onSelectModule(i)}>
            <BatteryModuleWithPCM
              position={[0, 0, 0]}
              scale={0.64}
              mode={mode}
              temperature={temperature}
              isFault={i === FAULT_MODULE_INDEX}
              showDetails={true}
            />
            {i === FAULT_MODULE_INDEX && mode === 'abnormal' && (
              <group position={[0, 0.55, 0]}>
                <pointLight color="#ef4444" intensity={1.6} distance={2.5} />
              </group>
            )}
          </group>
        ))}
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
      <group ref={wallRef} position={[0, 2.6, 0.55]} scale={0.65}>
        <group>
          <RoundedBox args={[1.15, 0.9, 0.04]} position={[0, 0, 0.35]} radius={0.02}>
            <meshStandardMaterial 
              color="#dc2626" 
              emissive={active ? '#ef4444' : '#991b1b'}
              emissiveIntensity={active ? 0.9 : 0.3}
              transparent 
              opacity={active ? 0.85 : 0.6}
            />
          </RoundedBox>
          <RoundedBox args={[1.15, 0.9, 0.04]} position={[0, 0, -0.35]} radius={0.02}>
            <meshStandardMaterial 
              color="#dc2626" 
              emissive={active ? '#ef4444' : '#991b1b'}
              emissiveIntensity={active ? 0.9 : 0.3}
              transparent 
              opacity={active ? 0.85 : 0.6}
            />
          </RoundedBox>
          <RoundedBox args={[0.04, 0.9, 0.62]} position={[0.57, 0, 0]} radius={0.02}>
            <meshStandardMaterial 
              color="#dc2626" 
              emissive={active ? '#ef4444' : '#991b1b'}
              emissiveIntensity={active ? 0.9 : 0.3}
              transparent 
              opacity={active ? 0.85 : 0.6}
            />
          </RoundedBox>
          <RoundedBox args={[0.04, 0.9, 0.62]} position={[-0.57, 0, 0]} radius={0.02}>
            <meshStandardMaterial 
              color="#dc2626" 
              emissive={active ? '#ef4444' : '#991b1b'}
              emissiveIntensity={active ? 0.9 : 0.3}
              transparent 
              opacity={active ? 0.85 : 0.6}
            />
          </RoundedBox>
          <RoundedBox args={[1.22, 0.05, 0.68]} position={[0, 0.48, 0]} radius={0.02}>
            <meshStandardMaterial color="#475569" metalness={0.95} />
          </RoundedBox>

          <lineSegments renderOrder={999}>
            <edgesGeometry args={[new THREE.BoxGeometry(1.24, 0.96, 0.74)]} />
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
  
  return null
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
        <meshStandardMaterial color="#f1f5f9" metalness={0.25} roughness={0.7} />
      </RoundedBox>
      {/* 地板网格 */}
      <gridHelper args={[16, 32, '#cbd5e1', '#e2e8f0']} position={[0, 0.01, 0]} />
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
  const pickDebugEnabled = true
  const hidePlatform = DEBUG_HIDE_LEVEL >= 5
  
  return (
    <group
      onPointerDown={(e) => {
        if (!pickDebugEnabled) return
        if (!(e as any).nativeEvent?.shiftKey) return
        e.stopPropagation()
        const intersections = (e as any).intersections as Array<{ object: THREE.Object3D }> | undefined
        const hitObj = intersections?.[0]?.object ?? ((e as any).object as THREE.Object3D | undefined)
        if (!hitObj) return

        const wp = new THREE.Vector3()
        hitObj.getWorldPosition(wp)

        const mat: any = (hitObj as any).material
        const col = mat?.color?.getHexString ? `#${mat.color.getHexString()}` : undefined
        const emi = mat?.emissive?.getHexString ? `#${mat.emissive.getHexString()}` : undefined

        const chain: string[] = []
        let cur: THREE.Object3D | null = hitObj
        for (let i = 0; i < 6 && cur; i++) {
          chain.push(cur.name || cur.type)
          cur = cur.parent
        }

        // eslint-disable-next-line no-console
        console.log('[pick]', {
          chain,
          worldPos: [Number(wp.x.toFixed(3)), Number(wp.y.toFixed(3)), Number(wp.z.toFixed(3))],
          color: col,
          emissive: emi,
          opacity: mat?.opacity,
          transparent: mat?.transparent,
        })
      }}
    >
      {/* 增强光照系统 - 提升材质质感 */}
      <ambientLight intensity={0.65} />
      <hemisphereLight intensity={0.75} color="#ffffff" groundColor="#f8fafc" />
      <directionalLight
        position={[8, 12, 8]}
        intensity={1.25}
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
      
      {!hidePlatform && <Platform />}
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

      {/* 优化后处理效果 - 降低放大时的闪烁 */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={fireWallActive ? 0.6 : mode === 'normal' ? 0.35 : 0.2}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={0.5}
        />
        <Vignette eskil={false} offset={0.25} darkness={0.18} />
      </EffectComposer>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
    </group>
  )
}

export default function Model3D(props: ModelSceneProps) {
  return (
    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
      <Canvas
        shadows="soft"
        dpr={Math.min(1.5, typeof window !== 'undefined' ? window.devicePixelRatio : 1)}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
        }}
        camera={{ position: [6, 4, 8], fov: 42 }}
      >
        <color attach="background" args={['#f8fafc']} />
        <fog attach="fog" args={['#f8fafc', 15, 35]} />
        <Scene {...props} />
      </Canvas>
    </div>
  )
}
