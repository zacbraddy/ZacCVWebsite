import React from 'react';

import Heading from '../components/atoms/heading';
import ContentItem from '../components/organisms/content-item';
import Highlight from '../components/atoms/highlight';
import SEO from '../components/seo';

const Content = () => {
  return (
    <>
      <SEO title="Content I've Created - Zac Braddy" />
      <div className="px-4 py-8 grid grid-cols-1 gap-8">
        <Heading className="text-secondary">Content I've created</Heading>
        <div className="flex flex-col p-4">
          <ContentItem
            link="https://tabsandspaces.io/"
            imageName="tabsAndSpaces"
            title={
              <>
                Tabs and Spaces <Highlight>podcast</Highlight>
              </>
            }
          >
            In this podcast, myself and two other co-hosts spend an hour a month
            riffing on topics that are common to all developers and give our
            opinions on them and strategies for dealing with them.
          </ContentItem>
          <ContentItem
            link="https://www.manning.com/livevideo/react-in-motion"
            imageName="course"
            order="right"
            title={
              <>
                <Highlight>Published author</Highlight> of a video course
              </>
            }
          >
            I've also published a course through Manning on React. As tends to
            happen in the JS space it's now deprecated as it was quite some time
            ago but it was very well received when it was on sale.
          </ContentItem>
          <ContentItem
            link="https://youtu.be/43qsKWUNUpc"
            imageName="conferenceTalks"
            title={
              <>
                Conference <Highlight>talks</Highlight>
              </>
            }
          >
            I really quite enjoy sharing my ideas about development at local
            developer conferences. Unfortunately I don't have a lot of my talks
            recorded but here is one talk that I did in 2019.
          </ContentItem>
          <ContentItem
            link="https://medium.com/@zackerthehacker"
            imageName="medium"
            order="right"
            title={
              <>
                <Highlight>Blog</Highlight> posts
              </>
            }
          >
            Although writing long-form blog posts can be time-consuming to both
            write and read; sometimes, they are the best way to convey complex
            ideas. I like to share my thoughts on Medium although I have been
            thinking recently of moving to dev.to
          </ContentItem>
          <ContentItem
            link="https://www.podchaser.com/creators/zac-braddy-107a9GfMmb"
            imageName="podcastGuest"
            title={
              <>
                Podcast <Highlight>guest</Highlight> appearances
              </>
            }
          >
            I've featured as a guest on a number of other people's podcasts as
            well talking about my thoughts and experience in the software
            development field
          </ContentItem>
          <ContentItem
            link="https://www.youtube.com/channel/UC73GI8tvfbxNbl626M6lUiQ"
            imageName="youtube"
            order="right"
            title={
              <>
                <Highlight>Youtube</Highlight> videos
              </>
            }
          >
            I wouldn't call myself a "youtuber" but I've dabbled and had some
            fun making some videos about Vim disguised as a computer generated
            cat!
          </ContentItem>
          <ContentItem
            link="https://www.youtube.com/channel/UCHgDwCRp7T311ItY0XCUhGA"
            imageName="theReactionary"
            title={
              <>
                Former <Highlight>community creator</Highlight>
              </>
            }
          >
            Quite some time ago, I spent time building a community around React
            when it was still new and shiny. "The Reactionary" included a blog,
            youtube channel and other pieces of community building content.
            Unfortunately, all that's left of those days is the youtube channel.
          </ContentItem>
        </div>
      </div>
    </>
  );
};
export default Content;
