import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SocialLink({ style, href, icon }) {
  return (
    <a
      style={{
        boxShadow: `none`,
        ...style,
      }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={icon} />
    </a>
  );
}

export default SocialLink;
