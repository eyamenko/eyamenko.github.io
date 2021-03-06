import React from 'react';
import { Link } from 'gatsby';
import { config } from '@fortawesome/fontawesome-svg-core';

import { rhythm, scale } from '../utils/typography';

config.autoAddCss = false;

class Layout extends React.Component {
  render() {
    const { landing, title, children, author } = this.props;

    let header;

    if (landing) {
      header = (
        <h1
          style={{
            ...scale(1.3),
            marginBottom: rhythm(1.5),
            marginTop: 0,
          }}
        >
          <Link
            style={{
              textDecoration: `none`,
              boxShadow: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
      );
    } else {
      header = (
        <h3
          style={{
            fontFamily: `Montserrat, sans-serif`,
            marginTop: 0,
          }}
        >
          <Link
            style={{
              textDecoration: `none`,
              boxShadow: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h3>
      );
    }
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <header>{header}</header>
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, {author}
        </footer>
      </div>
    );
  }
}

export default Layout;
