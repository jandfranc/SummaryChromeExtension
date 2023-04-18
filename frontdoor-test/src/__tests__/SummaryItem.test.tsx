
import { render, screen } from '@testing-library/react';
import SummaryItem from '../popup/components/SummaryItem';
import "@testing-library/jest-dom/extend-expect";



const summary = {
    _id: '1',
    text: 'Test Text',
    summary: 'Test Summary',
    date: '2023-04-17T12:00:00.000Z',
    tags: [],
};

it('renders SummaryItem component with correct content', () => {
    render(<SummaryItem summary={summary} />);

    expect(screen.getByText(summary.text)).toBeInTheDocument();
    expect(screen.getByText(summary.summary)).toBeInTheDocument();
    expect(screen.getByText(new Date(summary.date).toLocaleString())).toBeInTheDocument();
});
