'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap,
  Battery,
  Activity,
  Shield,
  Flame,
  Gauge,
  Play,
  AlertTriangle,
  RotateCcw,
  Thermometer,
  Sun,
  TrendingUp,
  CircleDot
} from 'lucide-react'
import Model3D from './components/Model3D'
import PCMStructureDiagram from './components/PCMStructureDiagram'

type DemoMode = 'idle' | 'normal' | 'abnormal'
type AlertLevel = 'normal' | 'warning' | 'danger' | 'critical'
type ExtinguishState = 'standby' | 'active' | 'complete'
type FireWallState = 'open' | 'closing' | 'closed'

interface TimelineEvent {
  time: string
  label: string
  active: boolean
}

export default function Home() {
  const [mode, setMode] = useState<DemoMode>('idle')
  const [alertLevel, setAlertLevel] = useState<AlertLevel>('normal')
  const [temperature, setTemperature] = useState(28.5)
  const [dTdt, setDTdt] = useState(0)
  const [fireWallState, setFireWallState] = useState<FireWallState>('open')
  const [extinguishState, setExtinguishState] = useState<ExtinguishState>('standby')
  const [currentTime, setCurrentTime] = useState('')
  const focus: 'overview' = 'overview'
  const [safetyPanelCollapsed, setSafetyPanelCollapsed] = useState(false)

  const [pvPower, setPvPower] = useState(23.4)
  const [loadPower, setLoadPower] = useState(35.6)
  const [gridPower, setGridPower] = useState(12.2)
  const [storageSoc, setStorageSoc] = useState(85)
  const [selfSupplyRate, setSelfSupplyRate] = useState(0)

  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const timeoutsRef = useRef<number[]>([])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const clearTimeouts = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id))
    timeoutsRef.current = []
  }

  useEffect(() => {
    if (mode === 'idle') return

    const calcAlertLevel = (t: number, dTdtPerMin: number): AlertLevel => {
      if (t > 100) return 'critical'
      if (t > 60 && dTdtPerMin > 3) return 'danger'
      if (dTdtPerMin > 2) return 'warning'
      return 'normal'
    }

    const interval = setInterval(() => {
      if (mode === 'normal') {
        setTemperature((prev) => {
          const next = 28 + Math.random() * 4
          const ratePerMin = (next - prev) * 60
          setDTdt(ratePerMin)
          return next
        })
        setAlertLevel('normal')

        const pv = 26 + Math.random() * 8
        const load = 22 + Math.random() * 6
        const grid = Math.max(load - pv, 0)
        setPvPower(pv)
        setLoadPower(load)
        setGridPower(grid)
        setSelfSupplyRate(Math.min(100, (pv / Math.max(load, 1)) * 100))
        setStorageSoc((prev) => {
          const next = Math.min(100, Math.max(30, prev + (pv > load ? 0.3 : -0.2)))
          return Number(next.toFixed(1))
        })
      } else if (mode === 'abnormal') {
        setTemperature((prev) => {
          const next = prev + (Math.random() * 3 + 1)
          const ratePerMin = (next - prev) * 60
          setDTdt(ratePerMin)
          setAlertLevel(calcAlertLevel(next, ratePerMin))
          return Math.min(next, 120)
        })

        const pv = 20 + Math.random() * 6
        const load = 30 + Math.random() * 10
        const grid = Math.max(load - pv, 0)
        setPvPower(pv)
        setLoadPower(load)
        setGridPower(grid)
        setSelfSupplyRate(Math.min(100, (pv / Math.max(load, 1)) * 100))
        setStorageSoc((prev) => {
          const next = Math.min(100, Math.max(10, prev - 0.8))
          return Number(next.toFixed(1))
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [mode])

  useEffect(() => {
    if (mode === 'abnormal' && alertLevel === 'critical') {
      clearTimeouts()

      const events: TimelineEvent[] = [
        { time: 'T+0s', label: '红色预警触发', active: false },
        { time: 'T+0s', label: '防火围栏启动', active: false },
        { time: 'T+3s', label: '围栏关闭到位', active: false },
        { time: 'T+3s', label: '定向灭火启动', active: false },
        { time: 'T+5s', label: '数据上传完成', active: false },
        { time: 'T+10s', label: '进入维持监测', active: false },
      ]

      setFireWallState('closing')
      setExtinguishState('standby')
      
      const delays = [0, 0, 3000, 3000, 5000, 10000]

      events.forEach((event, index) => {
        const delay = delays[index] ?? index * 1500
        const id = window.setTimeout(() => {
          setTimeline(prev => {
            const newTimeline = [...prev]
            newTimeline[index] = { ...event, active: true }
            return newTimeline
          })

          if (index === 0) setFireWallState('closing')
          if (index === 2) setFireWallState('closed')
          if (index === 3) setExtinguishState('active')
        }, delay)
        timeoutsRef.current.push(id)
      })
    }
  }, [mode, alertLevel])

  const startNormalDemo = () => {
    clearTimeouts()
    setMode('normal')
    setTimeline([])
    setTemperature(28.5)
    setDTdt(0)
    setAlertLevel('normal')
    setFireWallState('open')
    setExtinguishState('standby')
  }

  const startAbnormalDemo = () => {
    clearTimeouts()
    setMode('abnormal')
    setTemperature(30)
    setDTdt(0)
    setTimeline([])
    setAlertLevel('normal')
    setFireWallState('open')
    setExtinguishState('standby')
  }

  const resetDemo = () => {
    clearTimeouts()
    setMode('idle')
    setAlertLevel('normal')
    setTemperature(28.5)
    setDTdt(0)
    setTimeline([])
    setFireWallState('open')
    setExtinguishState('standby')
    setPvPower(0)
    setLoadPower(0)
    setGridPower(0)
    setSelfSupplyRate(0)
    setStorageSoc(85)
  }

  const pcmStage = mode !== 'abnormal' ? 0 : temperature < 55 ? 1 : temperature < 120 ? 2 : 3
  const meltL1 = mode !== 'abnormal' ? 0.12 : Math.min(1, Math.max(0, (temperature - 30) / (55 - 30)))
  const meltL2 = mode !== 'abnormal' ? 0.0 : pcmStage >= 2 ? Math.min(1, Math.max(0, (temperature - 55) / (120 - 55))) : 0

  const getAlertBadgeClass = () => {
    switch (alertLevel) {
      case 'normal': return 'badge-normal'
      case 'warning': return 'badge-warning'
      case 'danger': return 'badge-danger'
      case 'critical': return 'badge-critical'
    }
  }

  const getAlertText = () => {
    switch (alertLevel) {
      case 'normal': return '正常'
      case 'warning': return '预警'
      case 'danger': return '危险'
      case 'critical': return '热失控'
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* 深空发光背景层 */}
      <div className="deep-space-glow" />
      
      {/* 全屏 3D 舞台 */}
      <div className="fixed inset-0 z-10">
        <Model3D
          mode={mode}
          temperature={temperature}
          alertLevel={alertLevel}
          fireWallState={fireWallState}
          extinguishState={extinguishState}
          focus={focus}
        />
      </div>

      {/* HUD 装饰边框 */}
      <div className="fixed inset-0 z-30 pointer-events-none">
        {/* 四角装饰 */}
        <div className="absolute top-0 left-0 w-32 h-32">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--hud-corner)] to-transparent" />
          <div className="absolute top-0 left-0 h-full w-1 bg-gradient-b from-[var(--hud-corner)] to-transparent" />
        </div>
        <div className="absolute top-0 right-0 w-32 h-32">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-[var(--hud-corner)] to-transparent" />
          <div className="absolute top-0 right-0 h-full w-1 bg-gradient-b from-[var(--hud-corner)] to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--hud-corner)] to-transparent" />
          <div className="absolute bottom-0 left-0 h-full w-1 bg-gradient-t from-[var(--hud-corner)] to-transparent" />
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32">
          <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-[var(--hud-corner)] to-transparent" />
          <div className="absolute bottom-0 right-0 h-full w-1 bg-gradient-t from-[var(--hud-corner)] to-transparent" />
        </div>
        
        {/* 扫描线装饰 */}
        <div className="absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--hud-line)] to-transparent opacity-50" />
        <div className="absolute bottom-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--hud-line)] to-transparent opacity-50" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="header-container">
          {/* 顶部辅助线 */}
          <div className="header-top-decorator">
            <div className="header-top-line" />
          </div>
          
          {/* 左右发光长线 */}
          <div className="header-line-left" />
          <div className="header-line-right" />
          
          {/* 中央梯形标题区域 */}
          <div className="header-bg-shape">
            <h1 className="hud-title-main">光-储-热-防 换电站节能减排系统</h1>
            {/* 底部短亮线 */}
            <div className="header-line-inner" />
          </div>
        </div>
      </header>

      <style jsx global>{`
        @keyframes pcmFlow {
          0% { transform: translateX(-40%); opacity: 0.25; }
          50% { opacity: 0.45; }
          100% { transform: translateX(40%); opacity: 0.25; }
        }
        @keyframes pcmMelt {
          0% { transform: translateY(20%); opacity: 0.15; }
          50% { transform: translateY(0%); opacity: 0.45; }
          100% { transform: translateY(-20%); opacity: 0.15; }
        }
        @keyframes pcmWobble {
          0% { background-position: 0% 50%; transform: translateX(-6%); }
          50% { background-position: 100% 50%; transform: translateX(6%); }
          100% { background-position: 0% 50%; transform: translateX(-6%); }
        }
      `}</style>

      <div className="fixed top-16 bottom-4 left-4 right-4 z-40 pointer-events-none">
        <div className="h-full grid grid-cols-[280px_1fr_360px] gap-3">
          {/* 左侧安全看板 */}
          <aside className="pointer-events-auto overflow-hidden min-h-0">
            <div className="h-full flex flex-col gap-3 min-h-0">
              {/* DIGITAL TWIN 标题 */}
              <div className="glass-panel glass-panel-glow glass-panel-compact">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
                  <span className="font-tech text-[11px] font-bold tracking-[0.2em] text-glow" style={{ color: 'var(--accent-cyan)' }}>DIGITAL TWIN</span>
                </div>
              </div>

              {/* 温度监控 */}
              <div className={`glass-panel glass-panel-glow glass-panel-compact data-card-glow ${alertLevel === 'critical' ? 'glass-panel-danger' : alertLevel === 'danger' ? 'glass-panel-warning' : ''}`}>
                <div className="panel-header">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4" style={{ color: alertLevel === 'normal' ? 'var(--accent-emerald)' : alertLevel === 'warning' ? 'var(--accent-amber)' : 'var(--status-critical)' }} />
                    <span className="panel-title">温度监控</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="data-value text-glow" style={{ color: alertLevel === 'normal' ? 'var(--accent-emerald)' : alertLevel === 'warning' ? 'var(--accent-amber)' : 'var(--status-critical)' }}>
                    {temperature.toFixed(1)}
                  </span>
                  <span className="data-unit">℃</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>温升速率</span>
                  <span className={`font-mono text-sm ${dTdt > 2 ? 'text-glow' : ''}`} style={{ color: dTdt > 2 ? 'var(--status-danger)' : 'var(--text-muted)' }}>
                    {dTdt.toFixed(1)} ℃/min
                  </span>
                </div>
              </div>

              {/* 预警状态 */}
              <div className="glass-panel glass-panel-glow glass-panel-compact data-card-glow">
                <div className="panel-header">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" style={{ color: 'var(--accent-cyan)' }} />
                    <span className="panel-title">预警状态</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`status-dot-lg status-${alertLevel} ${alertLevel !== 'normal' ? 'animate-pulse-subtle' : ''}`} />
                  <span className="text-xl font-semibold text-white font-tech tracking-wider">{getAlertText()}</span>
                </div>
              </div>

              {/* 消防系统 */}
              <div className="glass-panel glass-panel-glow glass-panel-compact data-card-glow">
                <div className="panel-header">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4" style={{ color: 'var(--accent-rose)' }} />
                    <span className="panel-title">消防系统</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>自动状态</span>
                    <div className="flex items-center gap-2">
                      <div className={`status-dot status-normal`} />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        开启
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>灭火状态</span>
                    <div className="flex items-center gap-2">
                      <div className={`status-dot status-normal`} />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        待命
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 安全提示 */}
              <div className="glass-panel glass-panel-glow glass-panel-compact flex-1 min-h-0">
                <div className="panel-header">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" style={{ color: 'var(--accent-amber)' }} />
                    <span className="panel-title">安全提示</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="p-3 rounded bg-[var(--bg-card)] border border-[var(--glass-border)]">
                    <div className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                      系统正常运行中
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div />

          {/* 右侧能源与PCM结构看板 */}
          <aside className="pointer-events-auto overflow-hidden min-h-0">
            <div className="h-full flex flex-col gap-3 min-h-0">
              {/* 时间显示 */}
              <div className="glass-panel glass-panel-glow glass-panel-compact">
                <div className="flex justify-center">
                  <span className="font-mono text-[20px] font-bold text-glow" style={{ color: 'var(--accent-cyan)' }}>
                    {currentTime}
                  </span>
                </div>
              </div>

              {/* 光伏功率 */}
              <div className="glass-panel glass-panel-glow glass-panel-compact data-card-glow">
                <div className="panel-header">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" style={{ color: 'var(--accent-amber)' }} />
                    <span className="panel-title">光发电</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-amber)' }} />
                    <span className="text-[10px] font-tech" style={{ color: 'var(--accent-amber)' }}>ACTIVE</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="data-value text-glow" style={{ color: 'var(--accent-amber)' }}>{pvPower.toFixed(1)}</span>
                  <span className="data-unit">kW</span>
                </div>
                <div className="progress-bar mt-3">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, pvPower / 40 * 100)}%`, background: 'linear-gradient(90deg, var(--accent-amber), rgba(255,179,71,0.5))', boxShadow: '0 0 10px rgba(255,179,71,0.4)' }} />
                </div>
              </div>

              {/* 站内负荷 */}
              <div className="glass-panel glass-panel-glow glass-panel-compact data-card-glow">
                <div className="panel-header">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" style={{ color: 'var(--accent-rose)' }} />
                    <span className="panel-title">站内负荷</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="data-value text-glow" style={{ color: 'var(--accent-rose)' }}>{loadPower.toFixed(1)}</span>
                  <span className="data-unit">kW</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>站电负荷率</span>
                  <span className={`font-mono text-sm text-glow`} style={{ color: 'var(--accent-rose)' }}>
                    {loadPower.toFixed(1)} kW
                  </span>
                </div>
              </div>

              {/* 储能系统 */}
              <div className="glass-panel glass-panel-glow glass-panel-compact data-card-glow">
                <div className="panel-header">
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4" style={{ color: 'var(--accent-emerald)' }} />
                    <span className="panel-title">储能系统</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="data-value text-glow" style={{ color: 'var(--accent-emerald)' }}>{storageSoc.toFixed(0)}</span>
                  <span className="data-unit">%</span>
                </div>
                <div className="progress-bar mt-3">
                  <div className="progress-bar-fill" style={{ width: `${storageSoc}%`, background: 'linear-gradient(90deg, var(--accent-emerald), rgba(74,255,212,0.5))', boxShadow: '0 0 10px rgba(74,255,212,0.4)' }} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>负荷率</span>
                  <span className="font-mono text-sm text-glow" style={{ color: 'var(--accent-emerald)' }}>0%</span>
                </div>
              </div>

              {/* 双板PCM分层结构示意图 */}
              <div className="glass-panel glass-panel-glow glass-panel-compact flex-1 min-h-0 overflow-hidden">
                <PCMStructureDiagram />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed left-0 right-0 bottom-3 z-50 pointer-events-none px-3">
        <div className="flex justify-center">
          {/* 底部控制栏 - 科技感设计 */}
          <div className="pointer-events-auto w-full max-w-[760px]">
            <div className="glass-panel glass-panel-glow px-5 py-2">
              <div className="flex items-center gap-4">
                {/* 时间线 */}
                <div className="min-w-[180px]">
                  {timeline.length > 0 ? (
                    <div className="flex items-center gap-2">
                      {timeline.slice(0, 4).map((event, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: event.active ? 1 : 0.3, scale: event.active ? 1 : 0.85 }}
                          className="flex items-center gap-1.5"
                        >
                          <div className={`timeline-dot ${event.active ? 'active' : ''}`}>
                            {index + 1}
                          </div>
                          {index < 3 && <div className={`timeline-connector ${event.active ? 'active' : ''}`} />}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" style={{ color: 'var(--accent-cyan)' }} />
                      <span className="text-sm font-tech" style={{ color: 'var(--text-muted)' }}>SYSTEM STANDBY</span>
                    </div>
                  )}
                </div>

                {/* 控制按钮 */}
                <div className="flex items-center gap-3">
                  <button onClick={startNormalDemo} className="btn btn-primary">
                    <Play className="w-4 h-4" />
                    正常演示
                  </button>
                  <button onClick={startAbnormalDemo} className="btn btn-danger">
                    <AlertTriangle className="w-4 h-4" />
                    异常演示
                  </button>
                  <button onClick={resetDemo} className="btn btn-secondary">
                    <RotateCcw className="w-4 h-4" />
                    重置
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
