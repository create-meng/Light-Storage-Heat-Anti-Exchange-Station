# 数字孪生大屏演示系统

## 项目说明

本项目为"光-储-热-防"换电站节能减排系统的数字孪生演示大屏，面向节能减排大赛评委展示。

## 快速开始

### 1. 安装依赖

```bash
cd demo_web
npm install
```

### 2. 添加演示视频

将视频文件放入 `public/videos/` 目录：

- `public/videos/normal.mp4` - 正常工况演示视频
- `public/videos/abnormal.mp4` - 异常工况演示视频

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 构建部署

```bash
npm run export
```

构建产物在 `out` 目录，可部署到 GitHub Pages。

## 功能说明

- **开始演示**：播放正常工况视频，数据看板显示节能数据
- **触发异常**：播放异常工况视频，模拟温度上升和预警时间线
- **重置**：恢复初始状态

## 页面布局

- **左侧看板**：累计节电量、年减排CO₂、光伏自给率、综合能源效率、投资回收期
- **中央区域**：视频播放区 + 3D模型占位区
- **右侧看板**：当前温度、预警状态、储能电量、灭火剂状态、边缘计算延迟
- **底部**：预警时间线 + 控制按钮

## 技术栈

- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion
- Lucide Icons
