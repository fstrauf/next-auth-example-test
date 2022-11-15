// next.config.js
module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   experimental: {
//     swcPlugins: [
//       [
//         'next-superjson-plugin',
//         {
//           excluded: [],
//         },
//       ],
//     ],
//   },
// }

// module.exports = nextConfig
