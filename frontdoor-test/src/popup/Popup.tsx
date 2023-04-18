// Import React hooks and components.
import React, { useState } from 'react';
import { useSummaryContext } from './SummaryContext';
import FilterableHighlightsList from './FilterableHighlightsList';
import styled from 'styled-components';
import { PopupContainer } from './PopupStyles';

// Define styled components for the popup view.
const PopupTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const HighlightingButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

// Define the message type for toggling highlighting.
interface ToggleHighlightingMessage {
    type: 'TOGGLE_HIGHLIGHTING';
    payload: {
        isEnabled: boolean;
    };
}

// Define the popup component.
const Popup: React.FC = () => {
    // Get the summary context dispatch function.
    const { dispatch } = useSummaryContext();

    // Define state for highlighting.
    const [isHighlightingEnabled, setIsHighlightingEnabled] = useState(false);

    // Toggle highlighting on click and send a message to the content script.
    const toggleHighlighting = () => {
        setIsHighlightingEnabled(!isHighlightingEnabled);
        const message: ToggleHighlightingMessage = {
            type: 'TOGGLE_HIGHLIGHTING',
            payload: { isEnabled: !isHighlightingEnabled },
        };
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (tab.id) {
                chrome.tabs.sendMessage(tab.id, message);
            }
        });
    };

    // Render the popup view with the filterable highlights list.
    return (
        <div>
            <PopupContainer>
                <PopupTitle>Summaries</PopupTitle>
                <HighlightingButton onClick={toggleHighlighting}>
                    {isHighlightingEnabled ? 'Disable Highlighting' : 'Enable Highlighting'}
                </HighlightingButton>
                <FilterableHighlightsList />
            </PopupContainer>
        </div>
    );
};

// Export the popup component.
export default Popup;
