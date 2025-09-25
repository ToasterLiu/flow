import React from 'react';

interface HTMLStreamRendererProps {
  htmlContent: string;
}

export const HTMLStreamRenderer: React.FC<HTMLStreamRendererProps> = ({ htmlContent }) => {
  const createMarkup = (html: string) => {
    return { __html: html };
  };

  return (
    <div className="max-w-none">
      <style>
        {`
          .hugo span {
            display: block;
            margin-bottom: 0.75em;
          }
          .hugo .french {
            font-style: italic;
            color: #555;
          }
          .hugo .chinese {
            font-weight: bold;
          }
          .hugo .note {
            color: #007acc;
            font-size: 0.9em;
            border-left: 3px solid #007acc;
            padding-left: 0.75em;
            margin-top: 1em;
          }
          .hugo .cnote {
            color: #800080;
            font-size: 0.9em;
            border-left: 3px solid #800080;
            padding-left: 0.75em;
            margin-top: 1em;
          }
        `}
      </style>
      <div dangerouslySetInnerHTML={createMarkup(htmlContent)} />
    </div>
  );
};
