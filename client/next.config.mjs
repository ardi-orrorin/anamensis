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
    unoptimized : true,
  },
  optimizeFonts : true,
};

export default nextConfig;
