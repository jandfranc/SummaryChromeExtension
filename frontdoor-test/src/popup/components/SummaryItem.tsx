import React from 'react';
import styled from 'styled-components';

// Styled component for the container of each summary item
const SummaryItemContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1rem;
  margin: 0.5rem 0;
`;

// Styled component for the tag list
const TagList = styled.p`
  display: flex;
  flex-wrap: wrap;
`;

// Styled component for individual tags
const Tag = styled.span`
  background-color: #007bff;
  color: white;
  padding: 3px 5px;
  border-radius: 3px;
  margin-right: 5px;
  margin-bottom: 5px;
`;

// Interface defining the shape of the summary object
interface Summary {
    _id: string;
    text: string;
    summary: string;
    date: string;
    tags: string[];
}

// Props interface for the SummaryItem component
interface Props {
    summary: Summary;
}

// SummaryItem component
const SummaryItem: React.FC<Props> = ({ summary }) => {
    return (
        <SummaryItemContainer>
            <h3>{summary.text}</h3>
            <p>{summary.summary}</p>
            <p>{new Date(summary.date).toLocaleString()}</p>
            <TagList>
                {summary.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                ))}
            </TagList>
        </SummaryItemContainer>
    );
};

export default SummaryItem;
