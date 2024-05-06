/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['detect-libc','sharp'],
  },
  reactStrictMode: false,
  images : {
    remotePatterns : [
      {
        protocol : 'https',
        hostname : process.env.NEXT_PUBLIC_CDN_SERVER_HOST,
      }
    ],
    formats : ['image/avif'],
  },
};

export default nextConfig;
