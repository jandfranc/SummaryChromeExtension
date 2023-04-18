// This function sends an HTTP request to the specified URL using the specified method and request body.
// It expects a JSON response and returns a Promise that resolves with the response data.
async function sendRequest<T>(url: string, method: string, body: object, onSuccess?: (responseData: T) => void): Promise<T> {
    // Set the request headers to indicate that the request body is JSON.
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    // Set the request options, including the method, headers, and body.
    const options: RequestInit = {
        method,
        headers,
        body: JSON.stringify(body),
    };
    // Send the request using the fetch API and wait for the response.
    const response = await fetch(url, options);
    // If the response status is not OK, throw an error.
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    // Parse the response data as JSON and return it.
    const responseData: T = await response.json();
    // If an onSuccess callback was provided, call it with the response data.
    if (onSuccess) {
        onSuccess(responseData);
    }
    return responseData;
}

// Listen for messages from the content script.
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    // If the message type is 'ADD_SUMMARY', try to add a new summary.
    if (message.type === 'ADD_SUMMARY') {
        try {
            // Send a POST request to the summary API with the text of the article.
            const responseData = await sendRequest<{ summary: string }>('http://localhost:3000/summary/summaries', 'POST', { text: message.payload.text }, (responseData) => {
                // If the request was successful, create a new summary object.
                const newSummary = {
                    id: Date.now().toString(),
                    text: message.payload.text,
                    summary: responseData.summary,
                    date: new Date().toISOString(),
                    tags: [],
                    highlightId: message.payload.highlightId,
                };
                // Save the new summary to local storage.
                chrome.storage.local.get('summaries', ({ summaries }) => {
                    if (!summaries) {
                        summaries = [];
                    }
                    summaries.push(newSummary);
                    chrome.storage.local.set({ summaries });
                });
                // Send a message to the content script with the new summary.
                if (sender.tab?.id) {
                    chrome.tabs.sendMessage(sender.tab.id, {
                        type: 'NEW_SUMMARY',
                        payload: newSummary,
                    });
                }
            });
        } catch (error) {
            // If there was an error, log it to the console.
            console.error(error);
        }
    }
});

// Listen for the extension to be installed or updated.
chrome.runtime.onInstalled.addListener(() => {
    // Get the active tab and inject the content script into it.
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab.id) {
            chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['contentScript.js'] });
        }
    });
});
