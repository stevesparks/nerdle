import {useEffect, useState} from 'react';

const usernameKey = 'username';

export const loadUsernameFromLocalStorage = (): string => {
    const state = localStorage.getItem(usernameKey)
    return state ?? ""
  }

const useUsername = () => {
    const [username, setUsername] = useState<string>(() => loadUsernameFromLocalStorage());

    useEffect(() => {
        localStorage.setItem(usernameKey, username)
    }, [username]);

    return {
        username,
        setUsername
    }
}

export default useUsername;