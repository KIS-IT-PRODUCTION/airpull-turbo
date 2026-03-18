const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // дозволяє будь-який хост
      },
    ],
  },
};

export default nextConfig;