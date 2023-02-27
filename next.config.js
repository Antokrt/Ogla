/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    NEXTAUTH_URL:"http://localhost:3000",
    NEXT_PUBLIC_SECRET:'secretcode',
    NEXT_PUBLIC_BASE_IMG_BOOK:'http://localhost:3008/public/book/',
    NEXT_PUBLIC_BASE_IMG_USER:'http://localhost:3008/public/user/',
    GOOGLE_CLIENT_ID:'1092772885175-pr1v5209i6c07o52utevpt9q0hp37g3d.apps.googleusercontent.com',
    GOOGLE_SECRET:'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',
    CALLBACK_URL: 'http://localhost:3008/auth/google/redirect'
  }
}

module.exports = nextConfig
