import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { container } from './portrait-image.module.css';

const PortraitImage = () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "zac-portrait.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `);

  if (!data?.placeholderImage?.childImageSharp?.fluid) {
    return <div>Oops, this was supposed to be a photo of Zac :S</div>;
  }

  return (
    <div
      className={`${container} w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-inverse shadow-xl`}
    >
      <Img fluid={data.placeholderImage.childImageSharp.fluid} />
    </div>
  );
};
export default PortraitImage;
