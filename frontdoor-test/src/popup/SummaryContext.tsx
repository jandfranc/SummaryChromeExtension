
import React, { createContext, useContext, useReducer, useEffect } from 'react';


interface Summary {
    id: string;
    text: string;
    summary: string;
    date: Date;
    tags: string[];
}

interface State {
    summaries: Summary[];
}

const initialState: State = {
    summaries: [],
};

type Action =
    | { type: 'ADD_SUMMARY'; payload: Summary }
    | { type: 'UPDATE_SUMMARY'; payload: Summary }
    | { type: 'DELETE_SUMMARY'; payload: string }
    | { type: 'LOAD_SUMMARIES'; payload: Summary[] }; // added new action type

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

const SummaryContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
}>({
    state: initialState,
    dispatch: () => null,
});

interface Props {
    children: React.ReactNode;
    initialState?: State;
}

const SummaryProvider: React.FC<Props> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

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

    useEffect(() => {
        localStorage.setItem('summaries', JSON.stringify(state.summaries));
    }, [state.summaries]);

    return (
        <SummaryContext.Provider value={{ state, dispatch }}>
            {children}
        </SummaryContext.Provider>
    );
};

const useSummaryContext = () => useContext(SummaryContext);

export { SummaryProvider, useSummaryContext };
