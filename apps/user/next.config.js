/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ielts/ui', '@ielts/shared', '@ielts/auth'],

  // Proxy API requests to backend to avoid cross-subdomain cookie issues
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://ielts-vocabs-backend.vercel.app/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
