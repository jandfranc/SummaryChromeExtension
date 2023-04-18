import React, { useContext, useReducer } from 'react';

const chromeMock = {
    storage: {
        local: {
            get: function (key, callback) {
                const data = {};
                callback(data);
            },
            set: function (obj, callback) {
                callback();
            },
        },
    },
};

const initialState = {
    summaries: [],
    isFetching: false,
    hasError: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

const SummaryContext = React.createContext();

export const SummaryProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const value = {
        state,
        dispatch,
        chrome: chromeMock,
        loadSummaries: () => { },
    };

    return (
        <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>
    );
};

export const useSummaryContext = () => useContext(SummaryContext);

export default SummaryContext;
