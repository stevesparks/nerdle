import { WORDS } from '../constants/wordlist'
import { VALIDGUESSES } from '../constants/validGuesses'

export const isWordInWordList = (word: string) => {
  return (
    WORDS.includes(word.toLowerCase()) ||
    VALIDGUESSES.includes(word.toLowerCase())
  )
}

export const isWinningWord = (word: string) => {
  return solution === word
}

export const getIndexBasedOnDay = () => {
  // January 1, 2022 Game Epoch
  const epochMs = 1641013200000
  const now = Date.now()
  const msInDay = 86400000

  return Math.floor((now - epochMs) / msInDay)
}

export const getIndexBasedOnPuzzlesPlayed = () => {
  return loadIndexFromLocalStorage()
}

export const getIndex = () => {
  // return getIndexBasedOnDay()
  return getIndexBasedOnPuzzlesPlayed()
}

export const getWordOfDay = () => {
  const index = getIndex()

  return {
    solution: WORDS[index].toUpperCase(),
    solutionIndex: index,
  }
}

export const { solution, solutionIndex } = getWordOfDay()

const gameIndexKey = 'gameIndex'

export const saveIndexToLocalStorage = (index: number) => {
  localStorage.setItem(gameIndexKey, index.toString())
}
export const incrementIndex = (index: number) => {
  saveIndexToLocalStorage(loadIndexFromLocalStorage() + 1)
}

export const loadIndexFromLocalStorage = () => {
  const state = localStorage.getItem(gameIndexKey)

  return parseInt(state ?? "0")
}
