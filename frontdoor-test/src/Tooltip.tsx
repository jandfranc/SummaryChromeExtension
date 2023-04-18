import React from 'react';

interface TooltipProps {
    summary: string;
    tags: string[];
}

const Tooltip: React.FC<TooltipProps> = ({ summary, tags }) => {
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
            <p style={{ color: '#000' }}>{summary}</p>
            <p style={{ color: '#000' }}>Tags: {tags.join(', ')}</p>
        </div>
    );
};

export default Tooltip;
