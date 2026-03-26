const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http', // 🚀 Змінено для локального NestJS
        hostname: 'localhost',
        port: '4004', // Вказуємо порт вашого бекенду
        pathname: '/uploads/**',
      },
      {
        protocol: 'https', // Залишаємо для майбутнього бойового сервера
        hostname: '**',
        pathname: '/uploads/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;