/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig = {
  // dev 和 build 使用不同目录，避免冲突
  distDir: isProd ? '.next-build' : '.next',
  ...(isProd ? { output: 'export' } : {}),
  ...(isProd && basePath
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
