
import { render, screen } from '@testing-library/react';
import { SummaryProvider } from '../popup/SummaryContext';
import FilterableHighlightsList from '../popup/FilterableHighlightsList';
import "@testing-library/jest-dom/extend-expect";

const initialState = {
    summaries: [
        {
            id: '1',
            text: 'Test Text 1',
            summary: 'Test Summary 1',
            date: new Date('2023-04-17T12:00:00.000Z'),
            tags: ['tag1', 'tag2'],
        },
        {
            id: '2',
            text: 'Test Text 2',
            summary: 'Test Summary 2',
            date: new Date('2023-04-16T12:00:00.000Z'),
            tags: ['tag3', 'tag4'],
        },
    ],
};

it('renders FilterableHighlightsList component with correct content', () => {
    render(
        <SummaryProvider initialState={initialState}>
            <FilterableHighlightsList />
        </SummaryProvider>
    );

    expect(screen.getByText('Filterable Highlights List')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Filter by text')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Filter by tag')).toBeInTheDocument();
});

