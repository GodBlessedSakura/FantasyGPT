// import React from 'react';
// import remark from 'remark';
// import remarkReact from 'remark-react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

// const CodeBlock = ({ value, language }) => {
//   return (
//     <SyntaxHighlighter language={language} style={darcula}>
//       {value}
//     </SyntaxHighlighter>
//   );
// };

// const renderers = {
//   code: CodeBlock,
// };

// const Markdown = ({ source }) => {
//   const result = remark()
// .use(remarkReact, { remarkReactComponents: renderers })
//     .processSync(source);
//   return <div>{result.contents}</div>;
// };

// export default Markdown;
