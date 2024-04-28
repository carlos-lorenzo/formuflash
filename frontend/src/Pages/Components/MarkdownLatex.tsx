import React from 'react';
import ReactMarkdown from 'react-markdown';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface IMarkdownLatexProps {
  content: string;
}

// Define a type for the 'node' parameter
type MarkdownNode = {
    value: string;
};

const MarkdownLatex: React.FC<IMarkdownLatexProps> = ({ content }) => {
  const components = {
    // Map LaTeX and inline math to their respective components
    math: ({ node }: { node: MarkdownNode }) => <BlockMath math={String(node.value)} />,
    inlineMath: ({ node }: { node: MarkdownNode }) => <InlineMath math={String(node.value)} />
  };

  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={components}
    />
  );
};

export default MarkdownLatex;
