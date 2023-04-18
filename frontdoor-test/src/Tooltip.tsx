// Import necessary modules and components.
import React from 'react';

// Define the expected properties for the component as an interface.
interface TooltipProps {
    summary: string;
    tags: string[];
}

// Define the component as a functional component with the `React.FC` type.
const Tooltip: React.FC<TooltipProps> = ({ summary, tags }) => {
    // Render the tooltip as a div with some styling properties.
    return (
        <div style={{
            position: 'absolute',
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: '#fff',
            zIndex: 9999,
            pointerEvents: 'none',
            display: 'none',
            whiteSpace: 'normal',
            color: '#000',
            wordWrap: 'break-word',
            maxWidth: '300px',
        }}>
            {/* Render the summary and tags as separate paragraphs. */}
            <p style={{ color: '#000' }}>{summary}</p>
            <p style={{ color: '#000' }}>Tags: {tags.join(', ')}</p>
        </div>
    );
};

// Export the component as the default export of the module.
export default Tooltip;
