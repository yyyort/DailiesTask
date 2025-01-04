import type { NextConfig } from "next";


const nextConfig: NextConfig = {
    env: {
        SERVER_URL: process.env.SERVER_URL,
    }
};

export default nextConfig;
