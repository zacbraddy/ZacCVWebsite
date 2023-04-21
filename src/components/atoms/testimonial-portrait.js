import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { container } from './testimonial-portrait.module.css';

const TestimonialPortrait = ({ portraitName }) => {
  const data = useStaticQuery(graphql`
    {
      JamieTaylor: file(relativePath: { eq: "jamie-taylor.jpg" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED)
        }
      }
      GeorgiaShaw: file(relativePath: { eq: "georgia-shaw.jpg" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED)
        }
      }
      JoeZack: file(relativePath: { eq: "joe-zack.jpg" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED)
        }
      }
      AllenUnderwood: file(relativePath: { eq: "allen-underwood.jpg" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED)
        }
      }
      TravisScholes: file(relativePath: { eq: "travis-scholes.jpg" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED)
        }
      }
      JayMiller: file(relativePath: { eq: "jay-miller.jpg" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED)
        }
      }
    }
  `);

  if (!data?.[portraitName]?.childImageSharp?.gatsbyImageData) {
    return (
      <div>{`Oops, this was supposed to be a photo of ${portraitName} :S`}</div>
    );
  }

  return (
    <div className="flex justify-center">
      <div
        className={`${container} z-10 w-24 h-24 rounded-full overflow-hidden border-4 border-inverse shadow-xl`}
      >
        <GatsbyImage
          image={data[portraitName].childImageSharp.gatsbyImageData}
        />
      </div>
    </div>
  );
};
export default TestimonialPortrait;
