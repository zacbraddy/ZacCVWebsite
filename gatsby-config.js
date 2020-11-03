module.exports = {
  siteMetadata: {
    title: `Zac Braddy - Mutant code monkey from the future!`,
    description: `This guy codes`,
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
  ],
};
