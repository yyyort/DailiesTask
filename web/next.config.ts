import type { NextConfig } from "next";


const nextConfig: NextConfig = {
    env: {
        SERVER_URL: 'http://localhost:4000/api'
    }
};

export default nextConfig;
