import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/prediction-markets", destination: "/markets", permanent: true },
    ];
  },
};

export default nextConfig;
