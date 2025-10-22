import React, { createContext, useContext, useState, useEffect } from "react";

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
    const getInitialSearchResponse = () => {
        const storedResponse = localStorage.getItem('lastSearchResponse');
        return storedResponse ? JSON.parse(storedResponse) : null;
    };

    const [searchResponse, setSearchResponse] = useState(getInitialSearchResponse);

    useEffect(() => {
        if (searchResponse) {
            localStorage.setItem('lastSearchResponse', JSON.stringify(searchResponse));
        }
    }, [searchResponse]);

    const value = {
        searchResponse,
        setSearchResponse,
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};