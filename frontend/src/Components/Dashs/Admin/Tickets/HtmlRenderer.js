import React from 'react';

function HTMLRenderer({ htmlContent }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}

export default HTMLRenderer;