/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  reactStrictMode: false,
  images : {
    remotePatterns : [
      {
        protocol : 'https',
        hostname : process.env.NEXT_PUBLIC_CDN_SERVER_HOST ?? 'cdn_server_host',
      },
    ],
    formats : ['image/avif'],
    unoptimized : true,
  },
};

export default nextConfig;
