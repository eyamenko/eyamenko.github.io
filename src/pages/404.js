import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

class NotFoundPage extends React.Component {
  render() {
    const { title, author } = this.props.site.siteMetadata;

    return (
      <Layout title={title} author={author}>
        <SEO title="404: Not Found" />
        <h1>Not Found</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      </Layout>
    );
  }
}

export default NotFoundPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        author
      }
    }
  }
`;
