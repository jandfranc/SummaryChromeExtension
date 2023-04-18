/// <reference types="chrome" />

async function sendRequest<T>(url: string, method: string, body: object, onSuccess?: (responseData: T) => void): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    const options: RequestInit = {
        method,
        headers,
        body: JSON.stringify(body),
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const responseData: T = await response.json();
    if (onSuccess) {
        onSuccess(responseData);
    }
    return responseData;
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === 'ADD_SUMMARY') {
        try {
            const responseData = await sendRequest<{ summary: string }>('http://localhost:3000/summary/summaries', 'POST', { text: message.payload.text }, (responseData) => {
                const newSummary = {
                    id: Date.now().toString(),
                    text: message.payload.text,
                    summary: responseData.summary,
                    date: new Date().toISOString(),
                    tags: [],
                    highlightId: message.payload.highlightId,
                };
                // Save the new summary to local storage
                chrome.storage.local.get('summaries', ({ summaries }) => {
                    if (!summaries) {
                        summaries = [];
                    }
                    summaries.push(newSummary);
                    chrome.storage.local.set({ summaries });
                });
                // Send the new summary to the content script
                if (sender.tab?.id) {
                    chrome.tabs.sendMessage(sender.tab.id, {
                        type: 'NEW_SUMMARY',
                        payload: newSummary,
                    });
                }


            });
        } catch (error) {
            console.error(error);
        }
    }
});



chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab.id) {
            chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['contentScript.js'] });
        }
    });
});

