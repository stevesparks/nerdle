import {useEffect, useState} from 'react';
import { WORDS } from '../constants/wordlist';

const gameIndexKey = 'gameIndex';

export const loadIndexFromLocalStorage = (): number => {
    const state = localStorage.getItem(gameIndexKey)
    return parseInt(state ?? "0")
  }

const useCurrentGame = () => {
    const [solutionIndex, setSolutionIndex] = useState<number>(() => loadIndexFromLocalStorage());

    useEffect(() => {
        localStorage.setItem(gameIndexKey, solutionIndex.toString())
    }, [solutionIndex]);

    return {
        solution: WORDS[solutionIndex].toUpperCase(),
        solutionIndex,
        setSolutionIndex
    }
}

export default useCurrentGame;