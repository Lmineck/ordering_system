import { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA({
  dest: "public", // PWA 파일이 저장될 위치
  ...nextConfig, // Next.js 설정 포함
});
