
import { createProxyMiddleware} from 'http-proxy-middleware';


/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  reactStrictMode: false,
  images : {
    // remotePatterns : [
    //   {
    //     protocol : 'https',
    //     hostname : process.env.NEXT_PUBLIC_CDN_SERVER_HOST ?? 'cdn_server_host',
    //   },
    // ],
    unoptimized : true,
  },
  optimizeFonts : true,
  compress : true,
  async rewrites() {
    return [
      {
        source: '/ws/:path*',
        destination: 'http://localhost:8080/ws/:path*',
      },
      {
        source: '/files/:path*',
        destination: 'http://localhost:8080/files/:path*',
      }
    ];
  },

  async headers() {
    return [
      {
        source: '/ws/:path*',
        headers: [
          { key: 'Connection', value: 'Upgrade' },
          { key: 'Upgrade', value: 'websocket' },
        ],
      },
    ];
  },

  devServer: {
    onBeforeSetupMiddleware(devServer) {
      devServer.app.use(
        '/ws',
        createProxyMiddleware({
          target: 'http://localhost:8080',
          changeOrigin: true,
          ws: true,
        })
      );
    },
  },

};

export default nextConfig;
