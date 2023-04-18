// Import React hooks and types.
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Define the summary object type.
interface Summary {
    id: string;
    text: string;
    summary: string;
    date: Date;
    tags: string[];
}

// Define the initial state of the summary context.
interface State {
    summaries: Summary[];
}
const initialState: State = {
    summaries: [],
};

// Define the available actions for the summary context.
type Action =
    | { type: 'ADD_SUMMARY'; payload: Summary }
    | { type: 'UPDATE_SUMMARY'; payload: Summary }
    | { type: 'DELETE_SUMMARY'; payload: string }
    | { type: 'LOAD_SUMMARIES'; payload: Summary[] }; // added new action type

// Define the reducer function for the summary context.
const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'ADD_SUMMARY':
            return { ...state, summaries: [...state.summaries, action.payload] };
        case 'UPDATE_SUMMARY':
            return {
                ...state,
                summaries: state.summaries.map((summary) =>
                    summary.id === action.payload.id ? action.payload : summary
                ),
            };
        case 'DELETE_SUMMARY':
            return {
                ...state,
                summaries: state.summaries.filter((summary) => summary.id !== action.payload),
            };
        case 'LOAD_SUMMARIES':
            return {
                ...state,
                summaries: action.payload,
            };
        default:
            return state;
    }
};

// Create a context for the summary state and actions.
const SummaryContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
}>({
    state: initialState,
    dispatch: () => null,
});

// Define the props for the summary context provider.
interface Props {
    children: React.ReactNode;
    initialState?: State;
}

// Create the summary context provider component.
const SummaryProvider: React.FC<Props> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Load summaries from local storage on mount.
    useEffect(() => {
        const loadSummaries = async () => {
            const summariesdata = await new Promise<Summary[]>((resolve) => {
                chrome.storage.local.get('summaries', ({ summaries: storedSummaries }) => {
                    if (storedSummaries) {
                        resolve(storedSummaries);
                    } else {
                        resolve([]);
                    }
                });
            });
            dispatch({ type: 'LOAD_SUMMARIES', payload: summariesdata });
        };
        loadSummaries();
    }, []);

    // Save summaries to local storage on state change.
    useEffect(() => {
        localStorage.setItem('summaries', JSON.stringify(state.summaries));
    }, [state.summaries]);

    // Render the summary context provider with its children.
    return (
        <SummaryContext.Provider value={{ state, dispatch }}>
            {children}
        </SummaryContext.Provider>
    );
};

// Define a custom hook for using the summary context.
const useSummaryContext = () => useContext(SummaryContext);

// Export the summary context provider and custom hook.
export { SummaryProvider, useSummaryContext };
