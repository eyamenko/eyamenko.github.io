import React from 'react';
import { Link, graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { rhythm } from '../utils/typography';
import Pagination from '../components/pagination';

class BlogListTemplate extends React.Component {
  render() {
    const { title, author, description } = this.props.data.site.siteMetadata;
    const posts = this.props.data.allMarkdownRemark.edges;

    return (
      <Layout primary title={title} author={author}>
        <SEO title={description} />
        <Bio />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug;
          return (
            <div key={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <small>{node.frontmatter.date}</small>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </div>
          );
        })}
        <Pagination {...this.props.pageContext} />
      </Layout>
    );
  }
}

export default BlogListTemplate;

export const pageQuery = graphql`
  query BlogListByPage($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
        author
        description
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`;
