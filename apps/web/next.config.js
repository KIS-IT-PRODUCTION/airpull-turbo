const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // дозволяє будь-який хост
      },
    ],
  },
  // Додаємо ці два блоки для швидкого деплою на Vercel:
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;