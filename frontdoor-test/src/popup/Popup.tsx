/// <reference types="chrome" />
import React, { useState } from 'react';
import { useSummaryContext } from './SummaryContext';
import FilterableHighlightsList from './FilterableHighlightsList';
import styled from 'styled-components';
import { PopupContainer } from './PopupStyles';

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


interface ToggleHighlightingMessage {
    type: 'TOGGLE_HIGHLIGHTING';
    payload: {
        isEnabled: boolean;
    };
}


const Popup: React.FC = () => {
    const { dispatch } = useSummaryContext();
    const [isHighlightingEnabled, setIsHighlightingEnabled] = useState(false);

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

export default Popup;
