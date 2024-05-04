/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images : {
    remotePatterns : [
      {
        protocol : 'https',
        hostname : process.env.NEXT_PUBLIC_CDN_SERVER_HOST,
      }
    ]
  }
};

export default nextConfig;
