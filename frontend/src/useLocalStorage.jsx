/** Custom hook for managing state with localStorage. */

import { useState } from 'react';

function useLocalStorage(key, initialValue) {
    // get stored value of use initial value
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        }   catch (error) {
            console.log('error reading localStorage key:', key, error);
            return initialValue;
        }
    });

    // set the value and updated localStorage
    const setValue = value => {
        try {
            setStoredValue(prevValue => {
                const valueToStore = value instanceof Function ? value(prevValue) : value;
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
                return valueToStore;
            });
        }   catch (error) {
            console.error('error setting local storage key:', key, error);
        }
    };
    return [storedValue, setValue];
}

export default useLocalStorage;