import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '光-储-热-防 换电站节能减排系统',
  description: '数字孪生大屏演示系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="text-white">{children}</body>
    </html>
  )
}
