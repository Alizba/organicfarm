// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow base64 data URLs for product images uploaded by shopkeepers
    dangerouslyAllowSVG: true,
    remotePatterns: [],
  },
  // Increase body size limit so base64 images (up to 2MB) can be sent via API
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};

export default nextConfig;
