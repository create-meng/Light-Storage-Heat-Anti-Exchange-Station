/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig = {
  // 生产环境构建时（GitHub Actions）启用静态导出
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  ...(basePath
    ? {
        basePath,
        assetPrefix: `${basePath}/`,
      }
    : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
