/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ielts/ui', '@ielts/shared', '@ielts/auth'],
  output: 'standalone',
};

module.exports = nextConfig;
