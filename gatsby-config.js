module.exports = {
  siteMetadata: {
    title: `Zac Braddy - CV website`,
    titleTemplate: '%s - Zac Braddy',
    description: `This guy codes. Like really! Also he's friendly, a solid architect and mentor to boot. Why not see what else he can do on his CV website?`,
    url: 'https://zackerthehacker.com',
    image: '/images/zac-portrait.jpg',
    twitterUsername: '@zackerthehacker',
    author: `Zac Braddy`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    'gatsby-plugin-postcss',
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Permanent Marker`, 'Roboto:400'],
      },
    },
    {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: ['G-F98QXJC4S0'],
      },
    },
    {
      resolve: 'gatsby-plugin-purgecss',
      options: {
        tailwind: true,
        purgeOnly: ['src/styles/global.css'],
      },
    },
  ],
};
