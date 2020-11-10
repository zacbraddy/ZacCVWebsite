module.exports = {
  siteMetadata: {
    title: `Zac Braddy - CV website`,
    description: `This guy codes. Like really! Also he's a great guy to work with, a solid architecture and mentor to boot. Why not check out what else he can do on his CV website?`,
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
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Permanent Marker`,
          },
          {
            family: 'Roboto',
            variants: ['400'],
          },
        ],
      },
    },
  ],
};
