import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /* async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Set your origin
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, Cookie, Set-Cookie",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer'
          },
          {
            key: 'Sec-Fetch-Site',
            value: 'cross-site'
          }
        ],
      }
    ]
  } */
};

export default nextConfig;
