import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow server-side packages
  serverExternalPackages: ['sharp', 'bcryptjs'],
};

export default nextConfig;
