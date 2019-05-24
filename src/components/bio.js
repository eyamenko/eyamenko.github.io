import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';
import {
  faTwitter,
  faStackOverflow,
  faGithubAlt,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { faRss } from '@fortawesome/free-solid-svg-icons';

import { rhythm } from '../utils/typography';
import SocialLink from './socialLink';

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata;
        return (
          <div
            style={{
              display: `flex`,
              marginBottom: rhythm(2),
            }}
          >
            <Image
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                minWidth: 50,
                borderRadius: `100%`,
              }}
              imgStyle={{
                borderRadius: `50%`,
              }}
            />
            <p>
              Hi, I&#39;m Eugene, a Software Engineer in Sydney, Australia.
              <br />
              <SocialLink
                style={{ paddingRight: '15px' }}
                href={`https://twitter.com/${social.twitter}`}
                icon={faTwitter}
              />
              <SocialLink
                style={{ paddingRight: '15px' }}
                href={`https://github.com/${social.github}`}
                icon={faGithubAlt}
              />
              <SocialLink
                style={{ paddingRight: '15px' }}
                href={`https://stackoverflow.com/users/${social.stackOverflow}`}
                icon={faStackOverflow}
              />
              <SocialLink
                style={{ paddingRight: '15px' }}
                href={`https://www.linkedin.com/in/${social.linkedIn}`}
                icon={faLinkedinIn}
              />
              <SocialLink
                style={{ paddingRight: '15px' }}
                href={`/rss.xml`}
                icon={faRss}
              />
            </p>
          </div>
        );
      }}
    />
  );
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
          stackOverflow
          linkedIn
          github
        }
      }
    }
  }
`;

export default Bio;
