/// <reference types="chrome" />

import React from 'react';
import ReactDOM from 'react-dom';
import Tooltip from './Tooltip';
import * as rangy from "rangy";
import "rangy/lib/rangy-classapplier";


rangy.init();
const highlighter = rangy.createClassApplier('highlight', {
    elementTagName: 'span',
    elementProperties: {
        style: {
            backgroundColor: 'yellow',
        },
    },
    onElementCreate: (element: HTMLElement) => {
        const highlightId = `highlight-${Date.now()}`;
        element.setAttribute('data-highlight-id', highlightId);
    },
});

const tooltipMap = new Map<string, HTMLDivElement>();



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

const createTooltip = (summary: string, tags: string[]): HTMLDivElement => {
    const tooltipElement = React.createElement(Tooltip, { summary, tags });
    const container = document.createElement("div");
    ReactDOM.render(tooltipElement, container);
    return container.firstElementChild as HTMLDivElement;
};



const onMouseOverHighlight = (e: MouseEvent, tooltip: HTMLDivElement) => {
    const scrollTop = window.scrollY || window.pageYOffset;
    const scrollLeft = window.scrollX || window.pageXOffset;

    tooltip.style.display = 'block';
    tooltip.style.position = 'fixed';
    tooltip.style.top = `${e.pageY - scrollTop}px`;
    tooltip.style.left = `${e.pageX - scrollLeft}px`;
};



const onMouseOutHighlight = (tooltip: HTMLDivElement) => {
    tooltip.style.display = 'none';
};

let isHighlightingEnabled = false;
let lastHighlightedElement: HTMLSpanElement | null = null;

const handleTextClick = async (e: MouseEvent) => {
    if (!isHighlightingEnabled || !lastHighlightedElement) return;

    const text = lastHighlightedElement.innerText;
    const highlightId = lastHighlightedElement.getAttribute('data-highlight-id');

    chrome.runtime.sendMessage({
        type: 'ADD_SUMMARY',
        payload: {
            text: text,
            highlightId: highlightId,
        },
    });
};

document.addEventListener('mouseup', (e: MouseEvent) => {
    if (isHighlightingEnabled) {
        const selectedText = window.getSelection()!;
        const range = selectedText.getRangeAt(0);


        const highlightSpan1 = range.commonAncestorContainer.parentElement;
        if (highlightSpan1 && highlightSpan1.hasAttribute('highlight')) {
            return;
        }

        const existingHighlightSpans = range.cloneContents().querySelectorAll('span[highlight]');
        if (existingHighlightSpans.length > 0) {
            return;
        }

        highlighter.applyToSelection();
        const selectedHighlights = document.querySelectorAll('span.highlight');
        const latestHighlight = selectedHighlights[selectedHighlights.length - 1] as HTMLSpanElement | null;

        if (latestHighlight) {
            lastHighlightedElement = latestHighlight;
        }


        selectedText.removeAllRanges();
    }
});

document.addEventListener('click', (e: MouseEvent) => {
    const targetElement = e.target as HTMLElement;

    if (isHighlightingEnabled && targetElement.classList.contains('highlight')) {
        handleTextClick(e);
    }
});


chrome.runtime.onMessage.addListener((message: ContentScriptMessage, sender, sendResponse) => {
    if (message.type === 'TOGGLE_HIGHLIGHTING') {
        isHighlightingEnabled = message.payload.isEnabled;
    } else if (message.type === 'NEW_SUMMARY') {
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