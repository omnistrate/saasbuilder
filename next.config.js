const withYaml = require("next-plugin-yaml");

const nextConfig = {
  // reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/service-plans",
        permanent: true,
      },
    ];
  },
};

module.exports = withYaml(nextConfig);
