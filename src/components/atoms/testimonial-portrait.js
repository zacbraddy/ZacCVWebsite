import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { container } from './testimonial-portrait.module.css';

export default ({ portraitName }) => {
  const data = useStaticQuery(graphql`
    query {
      JamieTaylor: file(relativePath: { eq: "jamie-taylor.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      GeorgiaShaw: file(relativePath: { eq: "georgia-shaw.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      JoeZack: file(relativePath: { eq: "joe-zack.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      AllenUnderwood: file(relativePath: { eq: "allen-underwood.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      JennyYang: file(relativePath: { eq: "jenny-yang.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      JayMiller: file(relativePath: { eq: "jay-miller.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `);

  if (!data?.[portraitName]?.childImageSharp?.fluid) {
    return (
      <div>{`Oops, this was supposed to be a photo of ${portraitName} :S`}</div>
    );
  }

  return (
    <div className="flex justify-center">
      <div
        className={`${container} z-10 w-24 h-24 rounded-full overflow-hidden border-4 border-inverse shadow-xl`}
      >
        <Img fluid={data[portraitName].childImageSharp.fluid} />
      </div>
    </div>
  );
};
