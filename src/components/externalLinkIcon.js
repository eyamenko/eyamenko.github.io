import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ExternalLinkIcon(props) {
  return (
    <a
      className="gatsby-resp-image-link"
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={props.icon} />
    </a>
  );
}

export default ExternalLinkIcon;
