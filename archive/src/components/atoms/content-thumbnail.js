import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage } from "gatsby-plugin-image";

const ContentThumbnail = ({ imageName }) => {
  const data = useStaticQuery(graphql`{
  tabsAndSpaces: file(relativePath: {eq: "tabs-and-spaces.jpg"}) {
    childImageSharp {
      gatsbyImageData(width: 300, layout: CONSTRAINED)
    }
  }
  medium: file(relativePath: {eq: "medium.jpg"}) {
    childImageSharp {
      gatsbyImageData(width: 300, layout: CONSTRAINED)
    }
  }
  conferenceTalks: file(relativePath: {eq: "conference-talks.jpg"}) {
    childImageSharp {
      gatsbyImageData(width: 300, layout: CONSTRAINED)
    }
  }
  podcastGuest: file(relativePath: {eq: "podcast-guest.jpg"}) {
    childImageSharp {
      gatsbyImageData(width: 300, layout: CONSTRAINED)
    }
  }
  youtube: file(relativePath: {eq: "youtube.jpg"}) {
    childImageSharp {
      gatsbyImageData(width: 300, layout: CONSTRAINED)
    }
  }
  course: file(relativePath: {eq: "course.jpg"}) {
    childImageSharp {
      gatsbyImageData(width: 300, layout: CONSTRAINED)
    }
  }
  theReactionary: file(relativePath: {eq: "the-reactionary.jpg"}) {
    childImageSharp {
      gatsbyImageData(width: 300, layout: CONSTRAINED)
    }
  }
}`);

  return !data?.[imageName]?.childImageSharp?.gatsbyImageData ? (
    <div>{`Oops, this was supposed to be a photo of the ${imageName} thumbnail:S`}</div>
  ) : (
    <GatsbyImage
      image={data[imageName].childImageSharp.gatsbyImageData}
      className="md:h-full" />
  );
};
export default ContentThumbnail;
