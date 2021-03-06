import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

const ContentThumbnail = ({ imageName }) => {
  const data = useStaticQuery(graphql`
    query {
      tabsAndSpaces: file(relativePath: { eq: "tabs-and-spaces.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      medium: file(relativePath: { eq: "medium.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      conferenceTalks: file(relativePath: { eq: "conference-talks.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      podcastGuest: file(relativePath: { eq: "podcast-guest.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      youtube: file(relativePath: { eq: "youtube.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      course: file(relativePath: { eq: "course.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      theReactionary: file(relativePath: { eq: "the-reactionary.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `);

  return !data?.[imageName]?.childImageSharp?.fluid ? (
    <div>{`Oops, this was supposed to be a photo of the ${imageName} thumbnail:S`}</div>
  ) : (
    <Img fluid={data[imageName].childImageSharp.fluid} className="md:h-full" />
  );
};
export default ContentThumbnail;
