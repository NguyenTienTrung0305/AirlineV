/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'standalone': Next gom server.js + đúng node_modules tối thiểu vào .next/standalone
  // => Docker image production nhỏ hơn nhiều (không phải copy toàn bộ node_modules).
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.vietqr',
        pathname: '/image/**', 
      },
    ],
  },
};

export default nextConfig;