import React from 'react';
import PropTypes from 'prop-types';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/vs2015.css';

const CodeBlock = ({ language, value }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current) {
      hljs.highlightBlock(ref.current);
    }
  }, [language, value]);

  return (
    <pre>
      <code ref={ref} className={language}>
        {value}
      </code>
    </pre>
  );
};

CodeBlock.propTypes = {
  language: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default CodeBlock;
