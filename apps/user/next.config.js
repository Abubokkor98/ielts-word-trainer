/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ielts/ui', '@ielts/shared', '@ielts/auth'],
  output: 'standalone', // Required for Vercel deployment
};

module.exports = nextConfig;
