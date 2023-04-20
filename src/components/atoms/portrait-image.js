import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage } from "gatsby-plugin-image";
import { container } from './portrait-image.module.css';

const PortraitImage = () => {
  const data = useStaticQuery(graphql`{
  placeholderImage: file(relativePath: {eq: "zac-portrait.jpg"}) {
    childImageSharp {
      gatsbyImageData(width: 300, layout: CONSTRAINED)
    }
  }
}`);

  if (!data?.placeholderImage?.childImageSharp?.gatsbyImageData) {
    return <div>Oops, this was supposed to be a photo of Zac :S</div>;
  }

  return (
    <div
      className={`${container} w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-inverse shadow-xl`}
    >
      <GatsbyImage image={data.placeholderImage.childImageSharp.gatsbyImageData} />
    </div>
  );
};
export default PortraitImage;
