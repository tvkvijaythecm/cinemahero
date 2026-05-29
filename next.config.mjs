/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Three.js ESM imports
  transpilePackages: ['three'],
};

export default nextConfig;
