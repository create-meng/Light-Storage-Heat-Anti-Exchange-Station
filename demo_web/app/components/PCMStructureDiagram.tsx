'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'

interface LayerInfo {
  id: number
  name: string
  size: string
  tempRange?: string
  color: string
  gradient: string
  material: 'core' | 'pad' | 'pcm' | 'foil' | 'aerogel' | 'shell' | 'connector'
}

const layers: LayerInfo[] = [
  {
    id: 1,
    name: '电芯核心矩阵',
    size: '1200×800mm',
    color: '#93c5fd',
    gradient: 'linear-gradient(145deg, rgba(219,234,254,0.95) 0%, rgba(147,197,253,0.9) 55%, rgba(59,130,246,0.65) 100%)',
    material: 'core',
  },
  {
    id: 2,
    name: '内侧导热硅胶垫',
    size: '2mm',
    color: '#a855f7',
    gradient: 'linear-gradient(145deg, rgba(168,85,247,0.9), rgba(147,51,234,0.75))',
    material: 'pad',
  },
  {
    id: 3,
    name: '内侧相变材料 PCM-1',
    size: '28-32°C',
    tempRange: 'Stage 1',
    color: '#0891b2',
    gradient: 'linear-gradient(145deg, rgba(8,145,178,0.85), rgba(14,116,144,0.7))',
    material: 'pcm',
  },
  {
    id: 4,
    name: '铝箔均热层',
    size: '0.5mm',
    color: '#94a3b8',
    gradient: 'linear-gradient(145deg, rgba(148,163,184,0.95), rgba(100,116,139,0.85))',
    material: 'foil',
  },
  {
    id: 5,
    name: '外侧相变材料 PCM-2',
    size: '55-60°C',
    tempRange: 'Stage 2',
    color: '#ea580c',
    gradient: 'linear-gradient(145deg, rgba(234,88,12,0.85), rgba(194,65,12,0.7))',
    material: 'pcm',
  },
  {
    id: 6,
    name: '纳米孔气凝胶毯',
    size: '10mm',
    color: '#14b8a6',
    gradient: 'linear-gradient(145deg, rgba(20,184,166,0.7), rgba(13,148,136,0.5))',
    material: 'aerogel',
  },
  {
    id: 7,
    name: 'ABS保护外壳',
    size: '5mm',
    color: '#94a3b8',
    gradient: 'linear-gradient(145deg, rgba(148,163,184,0.85), rgba(100,116,139,0.75))',
    material: 'shell',
  },
]

// 电芯单元配置
const CELL_COLS = 6
const CELL_ROWS = 4

export default function PCMStructureDiagram() {
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null)
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      setContainerSize({ w: Math.floor(width), h: Math.floor(height) })
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const layout = useMemo(() => {
    const listW = 150
    const bottomBarH = 0
    const gap = 12
    const padding = 8

    const availW = Math.max(0, containerSize.w - padding * 2)
    const availH = Math.max(0, containerSize.h - padding * 2)

    const sceneW = Math.max(0, availW - listW - gap - 20)
    const sceneH = Math.max(0, availH - bottomBarH)

    const baseSceneW = 180
    const baseSceneH = 120
    const scale = Math.min(1, Math.max(0.4, Math.min(sceneW / baseSceneW, sceneH / baseSceneH)))

    const listAreaH = Math.max(0, availH - bottomBarH)
    const rowH = Math.max(16, Math.min(26, Math.floor(listAreaH / layers.length)))

    const listContentH = layers.length * rowH + (layers.length - 1) * 2
    const legendScale = Math.min(1, Math.max(0.72, listAreaH / Math.max(1, listContentH)))

    return {
      listW,
      bottomBarH,
      scale,
      baseSceneW,
      baseSceneH,
      rowH,
      legendScale,
    }
  }, [containerSize.h, containerSize.w])

  return (
    <div className="h-full flex flex-col">
      {/* 标题 */}
      <div className="panel-header flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
          <span className="panel-title">双极PCM分层结构</span>
        </div>
        <span className="text-[10px] font-tech" style={{ color: 'var(--text-muted)' }}>
          "回"字形全包裹核心结构
        </span>
      </div>

      {/* 3D分层展示区 */}
      <div ref={containerRef} className="flex-1 relative min-h-0 overflow-hidden">
        <div className="absolute inset-0 p-2">
          <div className="h-full grid grid-cols-[135px_1fr] gap-2">
            <div
              className="min-h-0"
              style={{
                transform: `scale(${layout.legendScale})`,
                transformOrigin: 'top left',
              }}
            >
              <div className="h-full flex flex-col" style={{ gap: '2px' }}>
                {layers.map((layer) => (
                  (() => {
                    const isHighlight = layer.material === 'pcm' || layer.material === 'aerogel'
                    const isActive = hoveredLayer === layer.id || selectedLayer === layer.id

                    return (
                  <div
                    key={layer.id}
                    className="flex items-center gap-1 py-0.5 px-1 rounded cursor-pointer transition-all"
                    style={{
                      height: layout.rowH,
                      background: isActive ? `${layer.color}35` : isHighlight ? `${layer.color}1a` : 'transparent',
                      borderLeft: `2px solid ${layer.color}`,
                      boxShadow: isActive ? `0 0 0 1px ${layer.color}80` : undefined,
                    }}
                    onMouseEnter={() => setHoveredLayer(layer.id)}
                    onMouseLeave={() => setHoveredLayer(null)}
                    onClick={() => setSelectedLayer((cur) => (cur === layer.id ? null : layer.id))}
                  >
                    <div
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ background: layer.color, boxShadow: `0 1px 3px ${layer.color}60` }}
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[11px] leading-4 font-medium"
                        style={{
                          whiteSpace: 'nowrap',
                          color: 'var(--text-primary)',
                          opacity: isHighlight ? 1 : 0.85,
                        }}
                      >
                        {layer.name}
                      </div>
                    </div>
                  </div>
                    )
                  })()
                ))}
              </div>
            </div>

            <div className="min-h-0 flex items-center justify-center">
              <div
                className="relative"
                style={{
                  width: layout.baseSceneW,
                  height: layout.baseSceneH,
                  perspective: '900px',
                  transform: `scale(${layout.scale})`,
                  transformOrigin: 'center',
                }}
              >
                {/* 1. 环绕层 - 先渲染外围层 */}
                {layers.slice(1).map((layer, index) => {
                  const isHovered = hoveredLayer === layer.id
                  const isActive = isHovered || selectedLayer === layer.id
                  const size = 46 + (index + 1) * 14
                  const reverseIndex = layers.length - 2 - index
                  const isHighlight = layer.material === 'pcm' || layer.material === 'aerogel'
                  const baseTransform = `rotateX(55deg) rotateZ(-12deg) translateZ(${(reverseIndex + 1) * 5}px)`

                  return (
                    <motion.div
                      key={layer.id}
                      className="absolute left-1/2 top-1/2 pointer-events-auto"
                      style={{
                        width: size,
                        height: size * 0.7,
                        marginLeft: -size / 2,
                        marginTop: -(size * 0.7) / 2,
                        transform: isActive ? `${baseTransform} scale(1.02)` : baseTransform,
                        zIndex: reverseIndex + 1,
                      }}
                      animate={{
                        opacity: isActive ? 1 : (isHighlight ? 0.95 : 0.7),
                      }}
                      transition={{ duration: 0.15 }}
                      onMouseEnter={() => setHoveredLayer(layer.id)}
                      onMouseLeave={() => setHoveredLayer(null)}
                      onClick={() => setSelectedLayer((cur) => (cur === layer.id ? null : layer.id))}
                    >
                      {/* 材质层 */}
                      <div
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: layer.gradient,
                          border: isHighlight
                            ? `2px solid ${layer.color}`
                            : `1.5px solid ${isActive ? layer.color : `${layer.color}60`}`,
                          boxShadow: isHighlight
                            ? `0 2px 8px ${layer.color}40, inset 0 1px 0 rgba(255,255,255,0.1)`
                            : isActive
                              ? `0 2px 6px ${layer.color}30, inset 0 1px 0 rgba(255,255,255,0.08)`
                              : `inset 0 1px 0 rgba(255,255,255,0.05)`,
                        }}
                      />
                      {layer.material === 'pcm' && (
                        <motion.div
                          className="absolute inset-0 rounded-lg"
                          animate={{
                            opacity: [0.2, 0.4, 0.2],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          style={{
                            background: `radial-gradient(ellipse at center, ${layer.color}25 0%, transparent 70%)`,
                          }}
                        />
                      )}
                      {/* 金属光泽效果 */}
                      {layer.material === 'foil' && (
                        <div
                          className="absolute inset-0 rounded-lg"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)',
                          }}
                        />
                      )}
                      {layer.material === 'aerogel' && (
                        <>
                          <div
                            className="absolute inset-0 rounded-lg"
                            style={{
                              background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 70%)',
                            }}
                          />
                          <motion.div
                            className="absolute inset-0 rounded-lg"
                            animate={{
                              opacity: [0.15, 0.35, 0.15],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                            style={{
                              background: 'radial-gradient(ellipse at center, rgba(20,184,166,0.2) 0%, transparent 60%)',
                            boxShadow: 'inset 0 0 12px rgba(20,184,166,0.15)',
                            }}
                          />
                        </>
                      )}
                    </motion.div>
                  )
                })}

                {/* 2. 电芯核心矩阵 - 放在最后渲染以确保在 DOM 最顶层 */}
                {(() => {
                  const isActive = hoveredLayer === 1 || selectedLayer === 1;
                  const baseTransform = `rotateX(55deg) rotateZ(-12deg) translateZ(45px)`;
                  
                  return (
                    <motion.div
                      className="absolute left-1/2 top-1/2 pointer-events-auto"
                      style={{
                        width: 56,
                        height: 40,
                        marginLeft: -28,
                        marginTop: -20,
                        transform: isActive ? `${baseTransform} scale(1.05)` : baseTransform,
                        zIndex: 50,
                      }}
                      onMouseEnter={() => setHoveredLayer(1)}
                      onMouseLeave={() => setHoveredLayer(null)}
                      onClick={() => setSelectedLayer((cur) => (cur === 1 ? null : 1))}
                    >
                      {/* 蓝色方块矩阵背景 */}
                      <div
                        className="absolute inset-0 rounded-md shadow-lg"
                        style={{
                          background: 'linear-gradient(145deg, rgba(219,234,254,0.95), rgba(147,197,253,0.85))',
                          border: isActive ? '2px solid rgba(59,130,246,0.55)' : '1px solid rgba(59,130,246,0.25)',
                          boxShadow: isActive ? '0 0 15px rgba(59,130,246,0.25)' : 'none',
                        }}
                      />
                      
                      {/* 电芯单体网格 */}
                      <div className="absolute inset-1 grid gap-0.5" style={{ gridTemplateColumns: `repeat(${CELL_COLS}, 1fr)`, gridTemplateRows: `repeat(${CELL_ROWS}, 1fr)` }}>
                        {Array.from({ length: CELL_COLS * CELL_ROWS }).map((_, i) => (
                          <div
                            key={i}
                            className="rounded-sm bg-blue-500/70 border-[0.5px] border-white/40"
                          />
                        ))}
                      </div>
                    </motion.div>
                  );
                })()}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
