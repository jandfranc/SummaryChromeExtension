// Import dependencies
/// <reference types="chrome" />
import React from 'react';
import ReactDOM from 'react-dom';
import Tooltip from './Tooltip';
import * as rangy from "rangy";
import "rangy/lib/rangy-classapplier";

// Initialize rangy and create a class applier for highlights
rangy.init();
const highlighter = rangy.createClassApplier('highlight', {
    elementTagName: 'span',
    elementProperties: {
        style: {
            backgroundColor: 'yellow',
        },
    },
    onElementCreate: (element: HTMLElement) => {
        // Add a unique highlight ID to each highlight element
        const highlightId = `highlight-${Date.now()}`;
        element.setAttribute('data-highlight-id', highlightId);
    },
});
// Create a map to store tooltips
const tooltipMap = new Map<string, HTMLDivElement>();

// Define message interfaces
interface ToggleHighlightingMessage {
    type: 'TOGGLE_HIGHLIGHTING';
    payload: {
        isEnabled: boolean;
    };
}

interface NewSummaryMessage {
    type: "NEW_SUMMARY";
    payload: {
        highlightId: string;
        summary: string;
        tags: string[];
    };
}

type ContentScriptMessage = ToggleHighlightingMessage | NewSummaryMessage;

// Function to create a tooltip element
const createTooltip = (summary: string, tags: string[]): HTMLDivElement => {
    const tooltipElement = React.createElement(Tooltip, { summary, tags });
    const container = document.createElement("div");
    ReactDOM.render(tooltipElement, container);
    return container.firstElementChild as HTMLDivElement;
};

// Function to handle mouse over event on highlights
const onMouseOverHighlight = (e: MouseEvent, tooltip: HTMLDivElement) => {
    // Calculate the tooltip position and display it
    const scrollTop = window.scrollY || window.pageYOffset;
    const scrollLeft = window.scrollX || window.pageXOffset;
    tooltip.style.display = 'block';
    tooltip.style.position = 'fixed';
    tooltip.style.top = `${e.pageY - scrollTop}px`;
    tooltip.style.left = `${e.pageX - scrollLeft}px`;
};

// Function to handle mouse out event on highlights
const onMouseOutHighlight = (tooltip: HTMLDivElement) => {
    tooltip.style.display = 'none';
};

// Variables to store state
let isHighlightingEnabled = false;
let lastHighlightedElement: HTMLSpanElement | null = null;

// Function to handle text click event when highlighting is enabled
const handleTextClick = async (e: MouseEvent) => {
    if (!isHighlightingEnabled || !lastHighlightedElement) return;

    const text = lastHighlightedElement.innerText;
    const highlightId = lastHighlightedElement.getAttribute('data-highlight-id');

    // Send a message to the extension to add a new summary
    chrome.runtime.sendMessage({
        type: 'ADD_SUMMARY',
        payload: {
            text: text,
            highlightId: highlightId,
        },
    });
};

// Event listener for mouseup event to handle text selection and highlighting
document.addEventListener('mouseup', (e: MouseEvent) => {
    if (isHighlightingEnabled) {
        const selectedText = window.getSelection()!;
        const range = selectedText.getRangeAt(0);

        const highlightSpan1 = range.commonAncestorContainer.parentElement;
        if (highlightSpan1 && highlightSpan1.hasAttribute('highlight')) {
            // If the selection is already highlighted, return
            return;
        }

        const existingHighlightSpans = range.cloneContents().querySelectorAll('span[highlight]');
        if (existingHighlightSpans.length > 0) {
            // If the selection overlaps with an existing highlight, return
            return;
        }
        // Apply the highlight to the selected text
        highlighter.applyToSelection();
        const selectedHighlights = document.querySelectorAll('span.highlight');
        const latestHighlight = selectedHighlights[selectedHighlights.length - 1] as HTMLSpanElement | null;

        if (latestHighlight) {
            lastHighlightedElement = latestHighlight;
        }

        // Remove the text selection
        selectedText.removeAllRanges();
    }
});

// Handle text click when highlighting is enabled
document.addEventListener('click', (e: MouseEvent) => {
    const targetElement = e.target as HTMLElement;
    if (isHighlightingEnabled && targetElement.classList.contains('highlight')) {
        handleTextClick(e);
    }
});

// Listen to messages from the extension and perform actions accordingly
chrome.runtime.onMessage.addListener((message: ContentScriptMessage, sender, sendResponse) => {
    if (message.type === 'TOGGLE_HIGHLIGHTING') {
        isHighlightingEnabled = message.payload.isEnabled;
    } else if (message.type === 'NEW_SUMMARY') {
        // If a new summary is received, create a tooltip and attach it to the highlight element

        const newSummary = message.payload;
        const highlightSpans = document.querySelectorAll(`span[data-highlight-id="${newSummary.highlightId}"]`); // Find all the highlightSpans by their data-highlight-id attribute

        if (highlightSpans.length > 0) {
            let tooltip: HTMLDivElement;
            if (tooltipMap.has(newSummary.highlightId)) {
                tooltip = tooltipMap.get(newSummary.highlightId) as HTMLDivElement;
            } else {
                tooltip = createTooltip(newSummary.summary, newSummary.tags);
                tooltipMap.set(newSummary.highlightId, tooltip);
                document.body.appendChild(tooltip);
            }
            // Attach mouseover and mouseout event handlers to the highlight element

            highlightSpans.forEach((highlightSpan: Element) => {
                (highlightSpan as HTMLElement).addEventListener('mousemove', (e: MouseEvent) => {
                    onMouseOverHighlight(e, tooltip);
                    (highlightSpan as HTMLElement).appendChild(tooltip);
                });
                (highlightSpan as HTMLElement).addEventListener('mouseout', (e: MouseEvent) => onMouseOutHighlight(tooltip));
            });
        }
    }
});
