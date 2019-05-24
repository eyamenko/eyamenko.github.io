import React from 'react';
import { Link, graphql } from 'gatsby';
import {
  faTwitter,
  faFacebookF,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { rhythm, scale } from '../utils/typography';
import SocialLink from '../components/socialLink';

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const location = this.props.location;
    const { title, author, social } = this.props.data.site.siteMetadata;
    const { previous, next } = this.props.pageContext;
    const url = encodeURIComponent(location.href);
    const text = encodeURIComponent(post.frontmatter.title);

    return (
      <Layout location={location} title={title} author={author}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <h1>{post.frontmatter.title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          {post.frontmatter.date}
          <SocialLink
            style={{ paddingLeft: '15px' }}
            href={`https://twitter.com/intent/tweet?url=${url}&text=${text}&via=${
              social.twitter
            }`}
            icon={faTwitter}
          />
          <SocialLink
            style={{ paddingLeft: '15px' }}
            href={`https://facebook.com/sharer.php?u=${url}`}
            icon={faFacebookF}
          />
          <SocialLink
            style={{ paddingLeft: '15px' }}
            href={`https://www.linkedin.com/shareArticle?url=${url}&mini=true&title=${text}`}
            icon={faLinkedinIn}
          />
          <SocialLink
            style={{ paddingLeft: '15px' }}
            href={location.href}
            icon={faLink}
          />
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <Bio />

        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Layout>
    );
  }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        social {
          twitter
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`;
