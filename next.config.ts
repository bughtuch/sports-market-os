import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/horse-racing",       destination: "/markets", permanent: true },
      { source: "/prediction-markets", destination: "/markets", permanent: true },
    ];
  },
};

export default nextConfig;
