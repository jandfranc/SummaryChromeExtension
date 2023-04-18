
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SummaryProvider } from '../popup/SummaryContext';
import Popup from '../popup/Popup';
import "@testing-library/jest-dom/extend-expect";




it('renders Popup component with correct content', () => {
    render(
        <SummaryProvider>
            <Popup />
        </SummaryProvider>
    );

    expect(screen.getByText('Summaries')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enable Highlighting' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Disable Highlighting' })).not.toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'Enable Highlighting' }));
    expect(screen.getByRole('button', { name: 'Disable Highlighting' })).toBeInTheDocument();
});
