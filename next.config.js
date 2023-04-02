/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    NEXTAUTH_URL:"http://localhost:3000",
    NEXT_PUBLIC_SECRET:'secretcode',
    NEXT_PUBLIC_BASE_IMG_BOOK:'https://d1yqxmx1xam6ok.cloudfront.net/',
    NEXT_PUBLIC_BASE_IMG_USER:'https://dt9eqvlch6exv.cloudfront.net/',
    NEXT_PUBLIC_BASE_MUSIC:'https://d2kj7fo5bl72bh.cloudfront.net/',
    GOOGLE_CLIENT_ID:'1092772885175-pr1v5209i6c07o52utevpt9q0hp37g3d.apps.googleusercontent.com',
    GOOGLE_SECRET:'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',
    CALLBACK_URL: 'http://localhost:3008/auth/google/redirect',
    NEXT_PUBLIC_GOOGLE_SECRET_DELETE: 'Kg6Opr0HHPtufd8'

  }
}

module.exports = nextConfig