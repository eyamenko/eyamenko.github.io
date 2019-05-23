/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';
import {
  faTwitter,
  faStackOverflow,
  faGithubAlt,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';

import { rhythm } from '../utils/typography';
import ExternalLinkIcon from './externalLinkIcon';

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
              Written by <strong>{author}</strong>. I&#39;m living the
              full-stack life.
              <br />
              <ExternalLinkIcon
                url={`https://twitter.com/${social.twitter}`}
                icon={faTwitter}
              />
              {` `}
              <ExternalLinkIcon
                url={`https://github.com/${social.github}`}
                icon={faGithubAlt}
              />
              {` `}
              <ExternalLinkIcon
                url={`https://stackoverflow.com/users/${social.stackOverflow}`}
                icon={faStackOverflow}
              />
              {` `}
              <ExternalLinkIcon
                url={`https://www.linkedin.com/in/${social.linkedIn}`}
                icon={faLinkedinIn}
              />
              {` `}
              <ExternalLinkIcon url={`/rss.xml`} icon={faLinkedinIn} />
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
