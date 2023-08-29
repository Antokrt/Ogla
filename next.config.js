/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  env: {
    maintenance: false,
    NEXT_PUBLIC_URL:"http://localhost:3000/",
    NEXTAUTH_URL:"http://localhost:3000",
    NEXT_PUBLIC_SECRET:'secretcode',
    NEXT_PUBLIC_BASE_IMG_BOOK:'https://d1yqxmx1xam6ok.cloudfront.net/',
    NEXT_AUTH_SECRET:'05jXZs0Wv81MrzYSZMmIy',
    NEXT_PUBLIC_BASE_IMG_USER:'https://dt9eqvlch6exv.cloudfront.net/',
    NEXT_PUBLIC_BASE_MUSIC:'https://d2kj7fo5bl72bh.cloudfront.net/',
    GOOGLE_CLIENT_ID:'1092772885175-pr1v5209i6c07o52utevpt9q0hp37g3d.apps.googleusercontent.com',
    GOOGLE_SECRET:'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',
    NEXT_PUBLIC_ASSETS:'https://d2vsr9v5fixcbm.cloudfront.net/',
    NEXT_PUBLIC_CAPTCHA_SITEKEY: '6LdQPrQlAAAAAMw_TQ02hrA9145W96nGWFUZTQPL',
    CALLBACK_URL: 'http://localhost:3008/auth/google/redirect',
    NEXT_PUBLIC_DEFAULT_USER_IMG:'/assets/default/user/default.png',
    NEXT_PUBLIC_DEFAULT_BOOK_IMG:'/assets/default/book/default.png',
    NEXT_PUBLIC_GOOGLE_SECRET_DELETE: 'Kg6Opr0HHPtufd8',
    NEXT_PUBLIC_OPEN_WRITER:false,
    NEXT_PUBLIC_SIGHTENGINE_BOOK_API_USER: '380892233',
    NEXT_PUBLIC_SIGHTENGINE_BOOK_API_SECRET: 'ZeyDv4MRrF58dsHEDXha',
    NEXT_PUBLIC_SIGHTENGINE_USER_API_USER:'124421506',
    NEXT_PUBLIC_SIGHTENGINE_USER_API_SECRET: 'BKzuBTz9ZvWS3LMNbUcw',
    CODE_SOCKET: "1190201"
  }
}

module.exports = nextConfig;