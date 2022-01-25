const gameStateKey = 'gameState';
const gameStatsKey = 'gameStats';

type StoredGameState = {
  guesses: string[]
  solution: string
}

type GameData = {
  guesses: number,
  won: boolean
}

type FinalGameData = {
  guesses: {
    [id: number]: number,
    lost: number
  },
  won: number,
  lost: number,
  totalGames: number
}


export const saveGameStateToLocalStorage = (gameState: StoredGameState) => {
  localStorage.setItem(gameStateKey, JSON.stringify(gameState))
}

export const loadGameStateFromLocalStorage = () => {
  const state = localStorage.getItem(gameStateKey)

  return state ? (JSON.parse(state) as StoredGameState) : null
}

const defaultGameData: FinalGameData = {
  guesses: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, lost: 0},
  won: 0,
  lost: 0,
  totalGames: 0
}

export const loadFinalGameDataFromLocalStorage = (): FinalGameData => {
  const state = localStorage.getItem(gameStatsKey)
  return state ? (JSON.parse(state) as FinalGameData) : defaultGameData;
}

export const saveFinalGameStatesToLocalStorage = (gameData: GameData) => {
  const previousGameStats = loadFinalGameDataFromLocalStorage();
  const {guesses, won, lost, totalGames} = previousGameStats;
  if (!gameData.won) {
    guesses.lost = guesses.lost + 1;
  } else {
    guesses[gameData.guesses] = guesses[gameData.guesses] + 1;
  }
  const currentGameStats = {
    guesses,
    won: gameData.won ? won + 1 : won,
    lost: !gameData.won ? lost + 1 : lost,
    totalGames: totalGames + 1
  }
  localStorage.setItem(gameStatsKey, JSON.stringify(currentGameStats))
}