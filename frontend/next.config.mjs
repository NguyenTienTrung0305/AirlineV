/** @type {import('next').NextConfig} */
const nextConfig = {
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