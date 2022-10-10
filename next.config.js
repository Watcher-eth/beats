/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    newNextLinkBehavior: true,
    images: {
      remotePatterns: [{ protocol: "https", hostname: "**" }],
    },
  },
};

module.exports = nextConfig;
