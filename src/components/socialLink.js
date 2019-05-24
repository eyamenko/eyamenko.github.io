import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SocialLink(props) {
  return (
    <a
      style={{
        boxShadow: `none`,
        paddingRight: '15px',
      }}
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={props.icon} />
    </a>
  );
}

export default SocialLink;
