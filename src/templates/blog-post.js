import React from 'react';
import { Link, graphql } from 'gatsby';
import {
  faTwitter,
  faFacebookF,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip';
import copy from 'copy-to-clipboard';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { rhythm, scale } from '../utils/typography';

class BlogPostTemplate extends React.Component {
  copy = e => {
    e.preventDefault();
    copy(this.props.location.href);
  };

  render() {
    const post = this.props.data.markdownRemark;
    const { title, author } = this.props.data.site.siteMetadata;
    const { previous, next } = this.props.pageContext;
    const encodedUrl = encodeURIComponent(this.props.location.href);
    const encodedTitle = encodeURIComponent(post.frontmatter.title);

    return (
      <Layout title={title} author={author}>
        <ReactTooltip />
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
          <a
            className="post-link"
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a
            className="post-link"
            href={`https://facebook.com/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a
            className="post-link"
            href={`https://www.linkedin.com/shareArticle?url=${encodedUrl}&mini=true&title=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
          <a
            className="post-link"
            href={this.props.location.href}
            data-tip="Copied"
            data-effect="solid"
            data-event="click"
            data-event-off="mouseleave"
            data-iscapture="true"
            onClick={this.copy}
          >
            <FontAwesomeIcon icon={faLink} />
          </a>
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
