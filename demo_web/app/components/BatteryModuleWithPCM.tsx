'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

type DemoMode = 'idle' | 'normal' | 'abnormal'

// 电池模组层级厚度定义（单位：米，放大展示层级结构）
export const LAYER_THICKNESS = {
  battery: 0.68,      // 电池核心宽度
  siliconePad: 0.018, // 硅胶垫（高导热）- 放大显示
  pcm1: 0.035,        // 一级PCM（石蜡/膨胀石墨）- 放大显示
  foil: 0.008,        // 铝箔 - 放大显示
  pcm2: 0.028,        // 二级PCM（无机盐/陶瓷基）- 放大显示
  aerogel: 0.022,     // 气凝胶隔热层 - 放大显示
  shell: 0.012,       // 外壳 - 放大显示
  quickRelease: 0.0,// 快拆结构
}

// PCM着色器
const PCM_SHADER = {
  vertex: `
    varying vec3 vPos;
    varying vec3 vN;
    void main() {
      vPos = position;
      vN = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: `
    uniform float uTime;
    uniform float uMelt;
    uniform vec3 uBaseColor;
    uniform vec3 uHotColor;
    varying vec3 vPos;
    varying vec3 vN;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vec2 uv = vPos.xy * 2.5;
      float n1 = noise(uv + vec2(uTime * 0.15, uTime * 0.1));
      float n2 = noise(uv * 2.0 - vec2(uTime * 0.2, uTime * 0.15));
      float n = n1 * 0.6 + n2 * 0.4;

      float wave = sin((uv.x + uv.y) * 6.0 + uTime * 2.5) * 0.05;
      float liquidMask = smoothstep(0.15, 0.85, uMelt + (n - 0.5) * 0.4 + wave);

      vec3 base = mix(uBaseColor, uHotColor, smoothstep(0.3, 1.0, uMelt));
      vec3 col = mix(uBaseColor, base, liquidMask);

      float fresnel = pow(1.0 - max(dot(normalize(vN), vec3(0.0, 0.0, 1.0)), 0.0), 2.5);
      float sheen = smoothstep(0.15, 1.0, fresnel) * (0.1 + 0.2 * liquidMask);
      col += vec3(sheen);

      float alpha = mix(0.65, 0.85, liquidMask);
      gl_FragColor = vec4(col, alpha);
    }
  `
}

export interface BatteryModuleWithPCMProps {
  position?: [number, number, number]
  scale?: number
  isFault?: boolean
  mode: DemoMode
  temperature?: number
  showDetails?: boolean
  onDoubleClick?: () => void
}

/**
 * 完整的电池模组+双级PCM层级组件
 * 包含：电池核心、硅胶垫、一级PCM、铝箔、二级PCM、气凝胶、外壳、快拆结构
 * 可在任何视角下正确显示，PCM层不会消失
 */
export function BatteryModuleWithPCM({
  position = [0, 0, 0],
  scale = 1,
  isFault = false,
  mode,
  temperature = 28,
  showDetails = true,
  onDoubleClick,
}: BatteryModuleWithPCMProps) {
  // 计算相变状态
  const pcm1Melt = useMemo(() => {
    if (mode !== 'abnormal') return 0.12
    return THREE.MathUtils.clamp((temperature - 28) / (55 - 28), 0, 1)
  }, [mode, temperature])

  const pcm2Melt = useMemo(() => {
    if (mode !== 'abnormal' || temperature < 55) return 0
    return THREE.MathUtils.clamp((temperature - 55) / (120 - 55), 0, 1)
  }, [mode, temperature])

  // 状态灯颜色
  const statusColor = useMemo(() => {
    if (!isFault) return { col: '#22c55e', emi: '#22c55e', intensity: 0.65 }
    if (mode !== 'abnormal') return { col: '#22c55e', emi: '#22c55e', intensity: 0.65 }
    const t = THREE.MathUtils.clamp((temperature - 45) / 55, 0, 1)
    const col = new THREE.Color('#22c55e').lerp(new THREE.Color('#f97316'), Math.min(1, t * 1.1)).lerp(new THREE.Color('#ef4444'), Math.max(0, t - 0.25) / 0.75)
    return { col: `#${col.getHexString()}`, emi: `#${col.getHexString()}`, intensity: 0.45 + 0.75 * t }
  }, [isFault, mode, temperature])

  // PCM材质动画
  const pcm1MatRef = useRef<THREE.ShaderMaterial>(null)
  const pcm2MatRef = useRef<THREE.ShaderMaterial>(null)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current

    const pcm1TargetMelt = (() => {
      if (mode === 'normal') {
        const base = 0.18
        const amp = 0.12
        return base + amp * (0.5 + 0.5 * Math.sin(t * 1.6))
      }
      return pcm1Melt
    })()

    if (pcm1MatRef.current) {
      pcm1MatRef.current.uniforms.uTime.value = timeRef.current
      pcm1MatRef.current.uniforms.uMelt.value = THREE.MathUtils.lerp(
        pcm1MatRef.current.uniforms.uMelt.value,
        pcm1TargetMelt,
        1 - Math.pow(0.001, delta)
      )
    }
    if (pcm2MatRef.current) {
      pcm2MatRef.current.uniforms.uTime.value = timeRef.current
      pcm2MatRef.current.uniforms.uMelt.value = THREE.MathUtils.lerp(
        pcm2MatRef.current.uniforms.uMelt.value,
        pcm2Melt,
        1 - Math.pow(0.001, delta)
      )
    }
  })

  const layer = LAYER_THICKNESS

  return (
    <group
      position={position}
      scale={scale}
      onDoubleClick={onDoubleClick}
    >
      {/* ============ 电池核心 ============ */}
      <group>
        {/* 电池主体 */}
        <RoundedBox args={[layer.battery, 0.82, 0.44]} radius={0.03}>
          <meshStandardMaterial
            color="#cbd5e1"
            emissive="#94a3b8"
            emissiveIntensity={0.05}
            transparent
            opacity={0.42}
            depthWrite={false}
            metalness={0.12}
            roughness={0.75}
          />
        </RoundedBox>

        {/* 电池主体轮廓线框（保证可见性，但不抢包裹层） */}
        <RoundedBox args={[layer.battery + 0.02, 0.84, 0.46]} radius={0.032} renderOrder={10}>
          <meshStandardMaterial
            color="#475569"
            emissive="#22d3ee"
            emissiveIntensity={0.06}
            transparent
            opacity={0.16}
            depthWrite={false}
            depthTest={false}
            wireframe
          />
        </RoundedBox>

        {/* 电芯单元（内部结构可视化） */}
        {[-0.24, -0.08, 0.08, 0.24].map((x, idx) => (
          <RoundedBox key={`cell-${idx}`} args={[0.14, 0.72, 0.38]} position={[x, 0, 0]} radius={0.015}>
            <meshStandardMaterial
              color="#334155"
              transparent
              opacity={showDetails ? 0.75 : 0.55}
              depthWrite={false}
              metalness={0.3}
              roughness={0.6}
            />
          </RoundedBox>
        ))}

        {/* 上盖板 */}
        <RoundedBox args={[layer.battery - 0.02, 0.05, 0.42]} position={[0, 0.42, 0]} radius={0.02}>
          <meshStandardMaterial
            color="#334155"
            transparent
            opacity={0.65}
            metalness={0.4}
            roughness={0.45}
          />
        </RoundedBox>

        {/* 绑带（环绕电池一圈） */}
        {showDetails && (
          <group>
            {[0.18, -0.08].map((y, bandIdx) => (
              <group key={`band-${bandIdx}`} position={[0, y, 0]} renderOrder={11}>
                {/* 左侧 */}
                <RoundedBox args={[0.02, 0.04, 0.46]} position={[-(layer.battery / 2 + 0.01), 0, 0]} radius={0.008}>
                  <meshStandardMaterial
                    color="#0ea5e9"
                    emissive="#22d3ee"
                    emissiveIntensity={0.35}
                    transparent
                    opacity={0.85}
                    depthWrite={false}
                    roughness={0.25}
                    metalness={0.15}
                  />
                </RoundedBox>
                {/* 右侧 */}
                <RoundedBox args={[0.02, 0.04, 0.46]} position={[(layer.battery / 2 + 0.01), 0, 0]} radius={0.008}>
                  <meshStandardMaterial
                    color="#0ea5e9"
                    emissive="#22d3ee"
                    emissiveIntensity={0.35}
                    transparent
                    opacity={0.85}
                    depthWrite={false}
                    roughness={0.25}
                    metalness={0.15}
                  />
                </RoundedBox>
                {/* 前侧 */}
                <RoundedBox args={[layer.battery + 0.06, 0.04, 0.02]} position={[0, 0, (0.44 / 2 + 0.01)]} radius={0.008}>
                  <meshStandardMaterial
                    color="#0ea5e9"
                    emissive="#22d3ee"
                    emissiveIntensity={0.35}
                    transparent
                    opacity={0.85}
                    depthWrite={false}
                    roughness={0.25}
                    metalness={0.15}
                  />
                </RoundedBox>
                {/* 后侧 */}
                <RoundedBox args={[layer.battery + 0.06, 0.04, 0.02]} position={[0, 0, -(0.44 / 2 + 0.01)]} radius={0.008}>
                  <meshStandardMaterial
                    color="#0ea5e9"
                    emissive="#22d3ee"
                    emissiveIntensity={0.35}
                    transparent
                    opacity={0.85}
                    depthWrite={false}
                    roughness={0.25}
                    metalness={0.15}
                  />
                </RoundedBox>
              </group>
            ))}
          </group>
        )}

        {/* 把手 */}
        {showDetails && (
          <RoundedBox args={[0.22, 0.06, 0.05]} position={[0, 0.22, -0.22]} radius={0.015}>
            <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.5} />
          </RoundedBox>
        )}

        {/* 状态指示灯条 */}
        <RoundedBox args={[0.38, 0.01, 0.035]} position={[0.16, 0.42, -0.1]} radius={0.005}>
          <meshStandardMaterial
            color={statusColor.col}
            emissive={statusColor.emi}
            emissiveIntensity={statusColor.intensity}
            transparent
            opacity={0.95}
          />
        </RoundedBox>
      </group>

      {/* ============ 硅胶垫层（高导热）- 四周包裹 ============ */}
      {/* 左侧 - 增强可见度 */}
      <RoundedBox
        args={[layer.siliconePad, 0.78, 0.42]}
        position={[-(layer.battery / 2 + layer.siliconePad / 2), 0, 0]}
        radius={0.006}
      >
        <meshStandardMaterial
          color="#c4b5fd"
          emissive="#a78bfa"
          emissiveIntensity={0.65}
          transparent
          opacity={0.93}
          depthWrite={false}
          roughness={0.4}
          metalness={0.15}
        />
      </RoundedBox>
      {/* 右侧 */}
      <RoundedBox
        args={[layer.siliconePad, 0.78, 0.42]}
        position={[(layer.battery / 2 + layer.siliconePad / 2), 0, 0]}
        radius={0.006}
      >
        <meshStandardMaterial
          color="#c4b5fd"
          emissive="#a78bfa"
          emissiveIntensity={0.65}
          transparent
          opacity={0.93}
          depthWrite={false}
          roughness={0.4}
          metalness={0.15}
        />
      </RoundedBox>
      {/* 前侧 */}
      <RoundedBox
        args={[layer.battery + layer.siliconePad * 2, 0.78, layer.siliconePad]}
        position={[0, 0, (0.44 / 2 + layer.siliconePad / 2)]}
        radius={0.005}
      >
        <meshStandardMaterial
          color="#94a3b8"
          emissive="#94a3b8"
          emissiveIntensity={0.22}
          transparent
          opacity={0.88}
          depthWrite={false}
          roughness={0.65}
          metalness={0.1}
        />
      </RoundedBox>
      {/* 后侧 */}
      <RoundedBox
        args={[layer.battery + layer.siliconePad * 2, 0.78, layer.siliconePad]}
        position={[0, 0, -(0.44 / 2 + layer.siliconePad / 2)]}
        radius={0.005}
      >
        <meshStandardMaterial
          color="#94a3b8"
          emissive="#94a3b8"
          emissiveIntensity={0.22}
          transparent
          opacity={0.88}
          depthWrite={false}
          roughness={0.65}
          metalness={0.1}
        />
      </RoundedBox>

      {/* ============ 一级PCM层（石蜡/膨胀石墨，28-32℃）- 四周包裹 ============ */}
      {/* 左侧 - 使用着色器，增强发光效果 */}
      <RoundedBox
        args={[layer.pcm1, 0.76, 0.40]}
        position={[-(layer.battery / 2 + layer.siliconePad + layer.pcm1 / 2), 0, 0]}
        radius={0.012}
      >
        <shaderMaterial
          ref={pcm1MatRef}
          vertexShader={PCM_SHADER.vertex}
          fragmentShader={PCM_SHADER.fragment}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          uniforms={{
            uTime: { value: 0 },
            uMelt: { value: pcm1Melt },
            uBaseColor: { value: new THREE.Color('#06b6d4') },
            uHotColor: { value: new THREE.Color('#f97316') },
          }}
        />
      </RoundedBox>
      {/* 右侧 - 同样使用着色器 */}
      <RoundedBox
        args={[layer.pcm1, 0.76, 0.40]}
        position={[(layer.battery / 2 + layer.siliconePad + layer.pcm1 / 2), 0, 0]}
        radius={0.012}
      >
        <shaderMaterial
          vertexShader={PCM_SHADER.vertex}
          fragmentShader={PCM_SHADER.fragment}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          uniforms={{
            uTime: { value: 0 },
            uMelt: { value: pcm1Melt },
            uBaseColor: { value: new THREE.Color('#06b6d4') },
            uHotColor: { value: new THREE.Color('#f97316') },
          }}
        />
      </RoundedBox>
      {/* 前侧 */}
      <RoundedBox
        args={[layer.battery + (layer.siliconePad + layer.pcm1) * 2, 0.76, layer.pcm1]}
        position={[0, 0, (0.44 / 2 + layer.siliconePad + layer.pcm1 / 2)]}
        radius={0.008}
      >
        <meshStandardMaterial
          color="#14b8a6"
          emissive="#22d3ee"
          emissiveIntensity={mode === 'abnormal' ? 0.55 : 0.3}
          transparent
          opacity={mode === 'abnormal' ? 0.85 : 0.68}
          depthWrite={false}
          roughness={0.25}
          metalness={0.05}
        />
      </RoundedBox>
      {/* 后侧 */}
      <RoundedBox
        args={[layer.battery + (layer.siliconePad + layer.pcm1) * 2, 0.76, layer.pcm1]}
        position={[0, 0, -(0.44 / 2 + layer.siliconePad + layer.pcm1 / 2)]}
        radius={0.008}
      >
        <meshStandardMaterial
          color="#14b8a6"
          emissive="#22d3ee"
          emissiveIntensity={mode === 'abnormal' ? 0.55 : 0.3}
          transparent
          opacity={mode === 'abnormal' ? 0.85 : 0.68}
          depthWrite={false}
          roughness={0.25}
          metalness={0.05}
        />
      </RoundedBox>

      {/* ============ 铝箔层 - 四周包裹 ============ */}
      {/* 左侧 */}
      <RoundedBox
        args={[layer.foil, 0.74, 0.38]}
        position={[-(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2), 0, 0]}
        radius={0.003}
      >
        <meshStandardMaterial
          color="#e2e8f0"
          emissive="#e2e8f0"
          emissiveIntensity={0.12}
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </RoundedBox>
      {/* 右侧 */}
      <RoundedBox
        args={[layer.foil, 0.74, 0.38]}
        position={[(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2), 0, 0]}
        radius={0.003}
      >
        <meshStandardMaterial
          color="#e2e8f0"
          emissive="#e2e8f0"
          emissiveIntensity={0.12}
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </RoundedBox>
      {/* 前侧 */}
      <RoundedBox
        args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil) * 2, 0.74, layer.foil]}
        position={[0, 0, (0.44 / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2)]}
        radius={0.003}
      >
        <meshStandardMaterial
          color="#e2e8f0"
          emissive="#e2e8f0"
          emissiveIntensity={0.12}
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </RoundedBox>
      {/* 后侧 */}
      <RoundedBox
        args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil) * 2, 0.74, layer.foil]}
        position={[0, 0, -(0.44 / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2)]}
        radius={0.003}
      >
        <meshStandardMaterial
          color="#e2e8f0"
          emissive="#e2e8f0"
          emissiveIntensity={0.12}
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </RoundedBox>

      {/* ============ 二级PCM层（无机盐/陶瓷基，55-60℃）- 四周包裹 ============ */}
      {/* 左侧 - 增强发光效果 */}
      <RoundedBox
        args={[layer.pcm2, 0.72, 0.36]}
        position={[-(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2), 0, 0]}
        radius={0.01}
      >
        <shaderMaterial
          ref={pcm2MatRef}
          vertexShader={PCM_SHADER.vertex}
          fragmentShader={PCM_SHADER.fragment}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          uniforms={{
            uTime: { value: 0 },
            uMelt: { value: pcm2Melt },
            uBaseColor: { value: new THREE.Color('#3b82f6') },
            uHotColor: { value: new THREE.Color('#ef4444') },
          }}
        />
      </RoundedBox>
      {/* 右侧 */}
      <RoundedBox
        args={[layer.pcm2, 0.72, 0.36]}
        position={[(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2), 0, 0]}
        radius={0.01}
      >
        <shaderMaterial
          vertexShader={PCM_SHADER.vertex}
          fragmentShader={PCM_SHADER.fragment}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          uniforms={{
            uTime: { value: 0 },
            uMelt: { value: pcm2Melt },
            uBaseColor: { value: new THREE.Color('#3b82f6') },
            uHotColor: { value: new THREE.Color('#ef4444') },
          }}
        />
      </RoundedBox>
      {/* 前侧 */}
      <RoundedBox
        args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2) * 2, 0.72, layer.pcm2]}
        position={[0, 0, (0.44 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2)]}
        radius={0.006}
      >
        <meshStandardMaterial
          color={mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa'}
          emissive={mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa'}
          emissiveIntensity={mode === 'abnormal' && temperature >= 55 ? 0.7 : 0.28}
          transparent
          opacity={mode === 'abnormal' && temperature >= 55 ? 0.88 : 0.62}
          depthWrite={false}
          roughness={0.3}
          metalness={0.05}
        />
      </RoundedBox>
      {/* 后侧 */}
      <RoundedBox
        args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2) * 2, 0.72, layer.pcm2]}
        position={[0, 0, -(0.44 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2)]}
        radius={0.006}
      >
        <meshStandardMaterial
          color={mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa'}
          emissive={mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa'}
          emissiveIntensity={mode === 'abnormal' && temperature >= 55 ? 0.7 : 0.28}
          transparent
          opacity={mode === 'abnormal' && temperature >= 55 ? 0.88 : 0.62}
          depthWrite={false}
          roughness={0.3}
          metalness={0.05}
        />
      </RoundedBox>

      {/* ============ 气凝胶隔热层 - 四周包裹 ============ */}
      {/* 左侧 - 增强可见度 */}
      <RoundedBox
        args={[layer.aerogel, 0.70, 0.34]}
        position={[-(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2), 0, 0]}
        radius={0.008}
      >
        <meshStandardMaterial
          color="#f8fafc"
          emissive="#67e8f9"
          emissiveIntensity={0.38}
          transparent
          opacity={mode === 'abnormal' && temperature >= 100 ? 0.88 : 0.72}
          depthWrite={false}
          roughness={0.9}
          metalness={0}
        />
      </RoundedBox>

      {/* 右侧 */}
      <RoundedBox
        args={[layer.aerogel, 0.70, 0.34]}
        position={[(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2), 0, 0]}
        radius={0.008}
      >
        <meshStandardMaterial
          color="#f8fafc"
          emissive="#67e8f9"
          emissiveIntensity={0.38}
          transparent
          opacity={mode === 'abnormal' && temperature >= 100 ? 0.88 : 0.72}
          depthWrite={false}
          roughness={0.9}
          metalness={0}
        />
      </RoundedBox>

      {/* 前侧 */}
      <RoundedBox
        args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel) * 2, 0.70, layer.aerogel]}
        position={[0, 0, (0.44 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2)]}
        radius={0.005}
      >
        <meshStandardMaterial
          color="#f8fafc"
          emissive="#67e8f9"
          emissiveIntensity={0.32}
          transparent
          opacity={mode === 'abnormal' && temperature >= 100 ? 0.86 : 0.7}
          depthWrite={false}
          roughness={0.9}
          metalness={0}
        />
      </RoundedBox>

      {/* 后侧 */}
      <RoundedBox
        args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel) * 2, 0.70, layer.aerogel]}
        position={[0, 0, -(0.44 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2)]}
        radius={0.005}
      >
        <meshStandardMaterial
          color="#f8fafc"
          emissive="#67e8f9"
          emissiveIntensity={0.32}
          transparent
          opacity={mode === 'abnormal' && temperature >= 100 ? 0.86 : 0.7}
          depthWrite={false}
          roughness={0.9}
          metalness={0}
        />
      </RoundedBox>

      {/* ============ 外壳层 - 四周包裹 ============ */}
      {/* 左侧 */}
      <RoundedBox
        args={[layer.shell, 0.68, 0.32]}
        position={[-(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2), 0, 0]}
        radius={0.004}
      >
        <meshStandardMaterial
          color="#94a3b8"
          emissive="#e2e8f0"
          emissiveIntensity={0.12}
          metalness={0.5}
          roughness={0.5}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </RoundedBox>
      {/* 右侧 */}
      <RoundedBox
        args={[layer.shell, 0.68, 0.32]}
        position={[(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2), 0, 0]}
        radius={0.004}
      >
        <meshStandardMaterial
          color="#94a3b8"
          emissive="#e2e8f0"
          emissiveIntensity={0.12}
          metalness={0.5}
          roughness={0.5}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </RoundedBox>
      {/* 前侧 */}
      <RoundedBox
        args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell) * 2, 0.68, layer.shell]}
        position={[0, 0, (0.44 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2)]}
        radius={0.004}
      >
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.5}
          roughness={0.5}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </RoundedBox>
      {/* 后侧 */}
      <RoundedBox
        args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell) * 2, 0.68, layer.shell]}
        position={[0, 0, -(0.44 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2)]}
        radius={0.004}
      >
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.5}
          roughness={0.5}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </RoundedBox>
    </group>
  )
}

/**
 * 小型电池模组（用于电池架）
 * 尺寸更小，但保持相同的层级结构
 */
export function SmallBatteryModuleWithPCM({
  position = [0, 0, 0],
  mode,
  temperature = 28,
}: {
  position?: [number, number, number]
  mode: DemoMode
  temperature?: number
}) {
  const layer = {
    battery: 0.16,
    siliconePad: 0.004,
    pcm1: 0.006,
    foil: 0.002,
    pcm2: 0.005,
    aerogel: 0.004,
    shell: 0.003,
  }

  return (
    <group position={position}>
      {/* 电池核心 */}
      <RoundedBox args={[layer.battery, 0.12, 0.18]} radius={0.015}>
        <meshStandardMaterial color="#334155" metalness={0.35} roughness={0.5} />
      </RoundedBox>
      
      {/* 状态灯 */}
      <RoundedBox args={[layer.battery - 0.02, 0.008, 0.025]} position={[0, 0.065, 0.08]} radius={0.003}>
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
      </RoundedBox>

      {/* 硅胶垫层（四周） */}
      <RoundedBox args={[layer.siliconePad, 0.10, 0.16]} position={[-(layer.battery / 2 + layer.siliconePad / 2), 0, 0]} radius={0.002}>
        <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={0.06} transparent opacity={0.65} roughness={0.65} />
      </RoundedBox>
      <RoundedBox args={[layer.siliconePad, 0.10, 0.16]} position={[(layer.battery / 2 + layer.siliconePad / 2), 0, 0]} radius={0.002}>
        <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={0.06} transparent opacity={0.65} roughness={0.65} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + layer.siliconePad * 2, 0.10, layer.siliconePad]} position={[0, 0, (0.18 / 2 + layer.siliconePad / 2)]} radius={0.002}>
        <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={0.06} transparent opacity={0.65} roughness={0.65} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + layer.siliconePad * 2, 0.10, layer.siliconePad]} position={[0, 0, -(0.18 / 2 + layer.siliconePad / 2)]} radius={0.002}>
        <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={0.06} transparent opacity={0.65} roughness={0.65} />
      </RoundedBox>

      {/* 一级PCM层（四周） */}
      <RoundedBox args={[layer.pcm1, 0.09, 0.14]} position={[-(layer.battery / 2 + layer.siliconePad + layer.pcm1 / 2), 0, 0]} radius={0.003}>
        <meshStandardMaterial color="#14b8a6" emissive="#22d3ee" emissiveIntensity={mode === 'abnormal' ? 0.35 : 0.2} transparent opacity={mode === 'abnormal' ? 0.7 : 0.5} roughness={0.25} />
      </RoundedBox>
      <RoundedBox args={[layer.pcm1, 0.09, 0.14]} position={[(layer.battery / 2 + layer.siliconePad + layer.pcm1 / 2), 0, 0]} radius={0.003}>
        <meshStandardMaterial color="#14b8a6" emissive="#22d3ee" emissiveIntensity={mode === 'abnormal' ? 0.35 : 0.2} transparent opacity={mode === 'abnormal' ? 0.7 : 0.5} roughness={0.25} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1) * 2, 0.09, layer.pcm1]} position={[0, 0, (0.18 / 2 + layer.siliconePad + layer.pcm1 / 2)]} radius={0.003}>
        <meshStandardMaterial color="#14b8a6" emissive="#22d3ee" emissiveIntensity={mode === 'abnormal' ? 0.32 : 0.18} transparent opacity={mode === 'abnormal' ? 0.65 : 0.45} roughness={0.25} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1) * 2, 0.09, layer.pcm1]} position={[0, 0, -(0.18 / 2 + layer.siliconePad + layer.pcm1 / 2)]} radius={0.003}>
        <meshStandardMaterial color="#14b8a6" emissive="#22d3ee" emissiveIntensity={mode === 'abnormal' ? 0.32 : 0.18} transparent opacity={mode === 'abnormal' ? 0.65 : 0.45} roughness={0.25} />
      </RoundedBox>

      {/* 铝箔层（四周） */}
      <RoundedBox args={[layer.foil, 0.08, 0.12]} position={[-(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2), 0, 0]} radius={0.001}>
        <meshStandardMaterial color="#e2e8f0" emissive="#e2e8f0" emissiveIntensity={0.1} transparent opacity={0.55} roughness={0.2} metalness={0.9} />
      </RoundedBox>
      <RoundedBox args={[layer.foil, 0.08, 0.12]} position={[(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2), 0, 0]} radius={0.001}>
        <meshStandardMaterial color="#e2e8f0" emissive="#e2e8f0" emissiveIntensity={0.1} transparent opacity={0.55} roughness={0.2} metalness={0.9} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil) * 2, 0.08, layer.foil]} position={[0, 0, (0.18 / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2)]} radius={0.001}>
        <meshStandardMaterial color="#e2e8f0" emissive="#e2e8f0" emissiveIntensity={0.1} transparent opacity={0.55} roughness={0.2} metalness={0.9} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil) * 2, 0.08, layer.foil]} position={[0, 0, -(0.18 / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2)]} radius={0.001}>
        <meshStandardMaterial color="#e2e8f0" emissive="#e2e8f0" emissiveIntensity={0.1} transparent opacity={0.55} roughness={0.2} metalness={0.9} />
      </RoundedBox>

      {/* 二级PCM层（四周） */}
      <RoundedBox args={[layer.pcm2, 0.07, 0.10]} position={[-(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2), 0, 0]} radius={0.002}>
        <meshStandardMaterial color={mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa'} emissive={mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa'} emissiveIntensity={mode === 'abnormal' && temperature >= 55 ? 0.4 : 0.15} transparent opacity={mode === 'abnormal' && temperature >= 55 ? 0.7 : 0.4} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[layer.pcm2, 0.07, 0.10]} position={[(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2), 0, 0]} radius={0.002}>
        <meshStandardMaterial color={mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa'} emissive={mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa'} emissiveIntensity={mode === 'abnormal' && temperature >= 55 ? 0.4 : 0.15} transparent opacity={mode === 'abnormal' && temperature >= 55 ? 0.7 : 0.4} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2) * 2, 0.07, layer.pcm2]} position={[0, 0, (0.18 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2)]} radius={0.002}>
        <meshStandardMaterial color={mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa'} emissive={mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa'} emissiveIntensity={mode === 'abnormal' && temperature >= 55 ? 0.35 : 0.12} transparent opacity={mode === 'abnormal' && temperature >= 55 ? 0.65 : 0.35} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2) * 2, 0.07, layer.pcm2]} position={[0, 0, -(0.18 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2)]} radius={0.002}>
        <meshStandardMaterial color={mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa'} emissive={mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa'} emissiveIntensity={mode === 'abnormal' && temperature >= 55 ? 0.35 : 0.12} transparent opacity={mode === 'abnormal' && temperature >= 55 ? 0.65 : 0.35} roughness={0.3} />
      </RoundedBox>

      {/* 气凝胶层（四周） */}
      <RoundedBox args={[layer.aerogel, 0.06, 0.08]} position={[-(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2), 0, 0]} radius={0.002}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.04} transparent opacity={0.22} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[layer.aerogel, 0.06, 0.08]} position={[(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2), 0, 0]} radius={0.002}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.04} transparent opacity={0.22} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel) * 2, 0.06, layer.aerogel]} position={[0, 0, (0.18 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2)]} radius={0.002}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.03} transparent opacity={0.2} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel) * 2, 0.06, layer.aerogel]} position={[0, 0, -(0.18 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2)]} radius={0.002}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.03} transparent opacity={0.2} roughness={0.9} />
      </RoundedBox>

      {/* 外壳层（四周） */}
      <RoundedBox args={[layer.shell, 0.05, 0.06]} position={[-(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2), 0, 0]} radius={0.001}>
        <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.75} />
      </RoundedBox>
      <RoundedBox args={[layer.shell, 0.05, 0.06]} position={[(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2), 0, 0]} radius={0.001}>
        <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.75} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell) * 2, 0.05, layer.shell]} position={[0, 0, (0.18 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2)]} radius={0.001}>
        <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.75} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell) * 2, 0.05, layer.shell]} position={[0, 0, -(0.18 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2)]} radius={0.001}>
        <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.75} />
      </RoundedBox>
    </group>
  )
}

/**
 * 储能电池簇（用于梯次储能柜）
 * 尺寸与BatteryModuleWithPCM不同，但保持相同的层级结构
 */
export function BatteryClusterWithPCM({
  position = [0, 0, 0],
  mode,
  temperature = 28,
}: {
  position?: [number, number, number]
  mode: DemoMode
  temperature?: number
}) {
  const layer = {
    battery: 0.55,      // 电池核心
    siliconePad: 0.008, // 硅胶垫
    pcm1: 0.012,        // 一级PCM
    foil: 0.003,        // 铝箔
    pcm2: 0.010,        // 二级PCM
    aerogel: 0.008,     // 气凝胶
    shell: 0.005,       // 外壳
  }

  return (
    <group position={position}>
      {/* 电池核心 */}
      <RoundedBox args={[layer.battery, 0.78, 0.42]} radius={0.025}>
        <meshStandardMaterial color="#334155" metalness={0.35} roughness={0.5} />
      </RoundedBox>
      
      {/* 内部电芯结构 */}
      {[-0.15, 0, 0.15].map((cx, idx) => (
        <RoundedBox key={`cell-${idx}`} args={[0.12, 0.68, 0.36]} position={[cx, 0, 0]} radius={0.012}>
          <meshStandardMaterial color="#334155" metalness={0.25} roughness={0.6} />
        </RoundedBox>
      ))}

      {/* 状态灯条 */}
      {[0.25, 0, -0.25].map((y, i) => (
        <RoundedBox key={`lamp-${i}`} args={[layer.battery - 0.05, 0.01, 0.025]} position={[0, y, 0.22]} radius={0.004}>
          <meshStandardMaterial 
            color={'#22c55e'} 
            emissive={'#22c55e'} 
            emissiveIntensity={0.45 - i * 0.1} 
          />
        </RoundedBox>
      ))}

      {/* 上盖板 */}
      <RoundedBox args={[layer.battery - 0.02, 0.05, 0.40]} position={[0, 0.40, 0]} radius={0.015}>
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.35} />
      </RoundedBox>

      {/* 硅胶垫层（四周） */}
      <RoundedBox args={[layer.siliconePad, 0.72, 0.38]} position={[-(layer.battery / 2 + layer.siliconePad / 2), 0, 0]} radius={0.003}>
        <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={0.07} transparent opacity={0.68} roughness={0.65} />
      </RoundedBox>
      <RoundedBox args={[layer.siliconePad, 0.72, 0.38]} position={[(layer.battery / 2 + layer.siliconePad / 2), 0, 0]} radius={0.003}>
        <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={0.07} transparent opacity={0.68} roughness={0.65} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + layer.siliconePad * 2, 0.72, layer.siliconePad]} position={[0, 0, (0.42 / 2 + layer.siliconePad / 2)]} radius={0.003}>
        <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={0.07} transparent opacity={0.68} roughness={0.65} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + layer.siliconePad * 2, 0.72, layer.siliconePad]} position={[0, 0, -(0.42 / 2 + layer.siliconePad / 2)]} radius={0.003}>
        <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={0.07} transparent opacity={0.68} roughness={0.65} />
      </RoundedBox>

      {/* 一级PCM层 */}
      <RoundedBox args={[layer.pcm1, 0.68, 0.34]} position={[-(layer.battery / 2 + layer.siliconePad + layer.pcm1 / 2), 0, 0]} radius={0.005}>
        <meshStandardMaterial color="#14b8a6" emissive="#22d3ee" emissiveIntensity={mode === 'abnormal' ? 0.35 : 0.2} transparent opacity={mode === 'abnormal' ? 0.72 : 0.52} roughness={0.25} />
      </RoundedBox>
      <RoundedBox args={[layer.pcm1, 0.68, 0.34]} position={[(layer.battery / 2 + layer.siliconePad + layer.pcm1 / 2), 0, 0]} radius={0.005}>
        <meshStandardMaterial color="#14b8a6" emissive="#22d3ee" emissiveIntensity={mode === 'abnormal' ? 0.35 : 0.2} transparent opacity={mode === 'abnormal' ? 0.72 : 0.52} roughness={0.25} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1) * 2, 0.68, layer.pcm1]} position={[0, 0, (0.42 / 2 + layer.siliconePad + layer.pcm1 / 2)]} radius={0.005}>
        <meshStandardMaterial color="#14b8a6" emissive="#22d3ee" emissiveIntensity={mode === 'abnormal' ? 0.32 : 0.18} transparent opacity={mode === 'abnormal' ? 0.68 : 0.48} roughness={0.25} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1) * 2, 0.68, layer.pcm1]} position={[0, 0, -(0.42 / 2 + layer.siliconePad + layer.pcm1 / 2)]} radius={0.005}>
        <meshStandardMaterial color="#14b8a6" emissive="#22d3ee" emissiveIntensity={mode === 'abnormal' ? 0.32 : 0.18} transparent opacity={mode === 'abnormal' ? 0.68 : 0.48} roughness={0.25} />
      </RoundedBox>

      {/* 铝箔层 */}
      <RoundedBox args={[layer.foil, 0.64, 0.30]} position={[-(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2), 0, 0]} radius={0.002}>
        <meshStandardMaterial color="#e2e8f0" emissive="#e2e8f0" emissiveIntensity={0.11} transparent opacity={0.58} roughness={0.2} metalness={0.9} />
      </RoundedBox>
      <RoundedBox args={[layer.foil, 0.64, 0.30]} position={[(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2), 0, 0]} radius={0.002}>
        <meshStandardMaterial color="#e2e8f0" emissive="#e2e8f0" emissiveIntensity={0.11} transparent opacity={0.58} roughness={0.2} metalness={0.9} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil) * 2, 0.64, layer.foil]} position={[0, 0, (0.42 / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2)]} radius={0.002}>
        <meshStandardMaterial color="#e2e8f0" emissive="#e2e8f0" emissiveIntensity={0.11} transparent opacity={0.58} roughness={0.2} metalness={0.9} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil) * 2, 0.64, layer.foil]} position={[0, 0, -(0.42 / 2 + layer.siliconePad + layer.pcm1 + layer.foil / 2)]} radius={0.002}>
        <meshStandardMaterial color="#e2e8f0" emissive="#e2e8f0" emissiveIntensity={0.11} transparent opacity={0.58} roughness={0.2} metalness={0.9} />
      </RoundedBox>

      {/* 二级PCM层 */}
      <RoundedBox args={[layer.pcm2, 0.60, 0.26]} position={[-(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2), 0, 0]} radius={0.004}>
        <meshStandardMaterial color={mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa'} emissive={mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa'} emissiveIntensity={mode === 'abnormal' && temperature >= 55 ? 0.42 : 0.16} transparent opacity={mode === 'abnormal' && temperature >= 55 ? 0.72 : 0.42} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[layer.pcm2, 0.60, 0.26]} position={[(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2), 0, 0]} radius={0.004}>
        <meshStandardMaterial color={mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa'} emissive={mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa'} emissiveIntensity={mode === 'abnormal' && temperature >= 55 ? 0.42 : 0.16} transparent opacity={mode === 'abnormal' && temperature >= 55 ? 0.72 : 0.42} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2) * 2, 0.60, layer.pcm2]} position={[0, 0, (0.42 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2)]} radius={0.004}>
        <meshStandardMaterial color={mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa'} emissive={mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa'} emissiveIntensity={mode === 'abnormal' && temperature >= 55 ? 0.38 : 0.14} transparent opacity={mode === 'abnormal' && temperature >= 55 ? 0.68 : 0.38} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2) * 2, 0.60, layer.pcm2]} position={[0, 0, -(0.42 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 / 2)]} radius={0.004}>
        <meshStandardMaterial color={mode === 'abnormal' && temperature >= 55 ? '#f97316' : '#60a5fa'} emissive={mode === 'abnormal' && temperature >= 55 ? '#fb7185' : '#60a5fa'} emissiveIntensity={mode === 'abnormal' && temperature >= 55 ? 0.38 : 0.14} transparent opacity={mode === 'abnormal' && temperature >= 55 ? 0.68 : 0.38} roughness={0.3} />
      </RoundedBox>

      {/* 气凝胶层 */}
      <RoundedBox args={[layer.aerogel, 0.56, 0.22]} position={[-(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2), 0, 0]} radius={0.003}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={mode === 'abnormal' && temperature >= 100 ? 0.15 : 0.05} transparent opacity={mode === 'abnormal' && temperature >= 100 ? 0.5 : 0.24} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[layer.aerogel, 0.56, 0.22]} position={[(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2), 0, 0]} radius={0.003}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={mode === 'abnormal' && temperature >= 100 ? 0.15 : 0.05} transparent opacity={mode === 'abnormal' && temperature >= 100 ? 0.5 : 0.24} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel) * 2, 0.56, layer.aerogel]} position={[0, 0, (0.42 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2)]} radius={0.003}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={mode === 'abnormal' && temperature >= 100 ? 0.12 : 0.04} transparent opacity={mode === 'abnormal' && temperature >= 100 ? 0.45 : 0.22} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel) * 2, 0.56, layer.aerogel]} position={[0, 0, -(0.42 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel / 2)]} radius={0.003}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={mode === 'abnormal' && temperature >= 100 ? 0.12 : 0.04} transparent opacity={mode === 'abnormal' && temperature >= 100 ? 0.45 : 0.22} roughness={0.9} />
      </RoundedBox>

      {/* 外壳层 */}
      <RoundedBox args={[layer.shell, 0.52, 0.18]} position={[-(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2), 0, 0]} radius={0.002}>
        <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.8} />
      </RoundedBox>
      <RoundedBox args={[layer.shell, 0.52, 0.18]} position={[(layer.battery / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2), 0, 0]} radius={0.002}>
        <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.8} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell) * 2, 0.52, layer.shell]} position={[0, 0, (0.42 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2)]} radius={0.002}>
        <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.8} />
      </RoundedBox>
      <RoundedBox args={[layer.battery + (layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell) * 2, 0.52, layer.shell]} position={[0, 0, -(0.42 / 2 + layer.siliconePad + layer.pcm1 + layer.foil + layer.pcm2 + layer.aerogel + layer.shell / 2)]} radius={0.002}>
        <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.5} transparent opacity={0.8} />
      </RoundedBox>
    </group>
  )
}

export default BatteryModuleWithPCM
