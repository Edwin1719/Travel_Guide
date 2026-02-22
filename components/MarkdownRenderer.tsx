
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MapViewer from './MapViewer';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Function to split content and inject MapViewer components
  const renderWithMaps = (text: string) => {
    const mapRegex = /\[MAP:(.*?)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mapRegex.exec(text)) !== null) {
      // Add text before map
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Add Map component
      parts.push(<MapViewer key={match.index} location={match[1]} />);
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  return (
    <div className="markdown-body text-sm text-slate-300 leading-7">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          ul: ({node, ...props}) => <ul className="list-disc ml-5 mb-4 space-y-1 text-slate-400" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal ml-5 mb-4 space-y-1 text-slate-400" {...props} />,
          h1: ({node, ...props}) => (
            <h1 className="text-2xl font-bold mb-4 mt-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 border-b border-white/10 pb-2" {...props} />
          ),
          h2: ({node, ...props}) => (
            <h2 className="text-lg font-semibold mb-3 mt-5 text-white flex items-center gap-2" {...props} />
          ),
          h3: ({node, ...props}) => (
            <h3 className="text-base font-medium mb-2 mt-4 text-blue-300" {...props} />
          ),
          strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
          p: ({node, ...props}) => {
            const children = React.Children.toArray(props.children);
            const contentString = children.map(child => typeof child === 'string' ? child : '').join('');
            
            if (contentString.includes('[MAP:')) {
                return <div className="mb-4">{renderWithMaps(contentString)}</div>;
            }
            return <p className="mb-4 last:mb-0" {...props} />;
          },
          a: ({node, ...props}) => (
            <a className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors inline-flex items-center gap-1" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          code: ({node, ...props}) => (
            <code className="bg-slate-800/50 px-1.5 py-0.5 rounded text-xs font-mono text-blue-300 border border-white/5" {...props} />
          ),
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-blue-500/50 pl-4 italic text-slate-400 my-4" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
