// Import React hooks and components.
import React, { useState, useEffect } from 'react';
import { useSummaryContext } from './SummaryContext';
import styled from 'styled-components';

// Define styled components for the filterable highlights list.
const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FilterInput = styled.input`
  flex-grow: 1;
  padding: 0.5rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
`;

const SummaryList = styled.ul`
  list-style: none;
  padding: 0;
`;

const SummaryListItem = styled.li`
  margin-bottom: 1rem;
`;

// Define the filterable highlights list component.
const FilterableHighlightsList: React.FC = () => {
    // Get the summary context state.
    const { state } = useSummaryContext();

    // Define state for filtering.
    const [textFilter, setTextFilter] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('newest');

    useEffect(() => { }, [state.summaries]);

    // Define event handlers for filter changes.
    const handleTextFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextFilter(event.target.value);
    };

    const handleTagFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTagFilter(event.target.value);
    };

    const handleDateFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDateFilter(event.target.value);
    };

    // Filter the summaries based on the current filter state.
    const filteredSummaries = state.summaries
        .filter((summary) => {
            return summary.text && summary.text.toLowerCase().includes(textFilter.toLowerCase());
        })
        .filter((summary) =>
            tagFilter === '' || summary.tags.some((tag) => tag && tag.toLowerCase().includes(tagFilter.toLowerCase()))
        )
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            if (dateFilter === 'newest') {
                return dateB.getTime() - dateA.getTime();
            } else {
                return dateA.getTime() - dateB.getTime();
            }
        });

    // Render the filterable highlights list with the current filters.
    return (
        <div>
            <h2>Filterable Highlights List</h2>
            <FilterContainer>
                <FilterInput
                    type="text"
                    placeholder="Filter by text"
                    value={textFilter}
                    onChange={handleTextFilterChange}
                />
                <FilterInput
                    type="text"
                    placeholder="Filter by tag"
                    value={tagFilter}
                    onChange={handleTagFilterChange}
                />
                <FilterSelect value={dateFilter} onChange={handleDateFilterChange}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </FilterSelect>
            </FilterContainer>
            <SummaryList>
                {filteredSummaries.map((summary) => (
                    <SummaryListItem key={summary.id}>
                        <p>
                            <strong>{summary.text}</strong>
                        </p>
                        <p>{summary.summary}</p>
                    </SummaryListItem>
                ))}
            </SummaryList>
        </div>
    );
};

// Export the filterable highlights list component.
export default FilterableHighlightsList;
