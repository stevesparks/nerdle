import { InformationCircleIcon } from '@heroicons/react/outline'
import { useState, useEffect } from 'react'
import { Alert } from './components/alerts/Alert'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { AboutModal } from './components/modals/AboutModal'
import { InfoModal } from './components/modals/InfoModal'
import { WinModal } from './components/modals/WinModal'
import { isWordInWordList, isWinningWord} from './lib/words'
import {
  loadGameStateFromLocalStorage,
  saveFinalGameStatesToLocalStorage,
  saveGameStateToLocalStorage,
} from './lib/localStorage'
import useCurrentGame from './lib/useCurrentGame'
import useUsername from './lib/useUsername'
import { LoginModal } from './components/modals/LoginModal'

const images = [
    "elmoween.png",
    "bbq-attorney.png",
    "bbq-loanshark.png",
    "not-a-cat.png",
    "bbq-taxidermy-2.png",
    "whoisbillmonk.gif",
    "bbq-llamabarn.png",
    "bbq-taxidermy-2.png",
    "airdnd.png"
]
const shuffledImages = images.sort((a,b) => 0.5 - Math.random())
var imageIndex = 0
const banner = document.getElementById("banner") as HTMLImageElement
setInterval(() => {
    banner.src = shuffledImages[imageIndex]
    if(imageIndex === shuffledImages.length-1) {
        imageIndex = 0
    } else {
        imageIndex++
    }
}, 5000)

function App() {
  const {username, setUsername} = useUsername();
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [isWinModalOpen, setIsWinModalOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isWordNotFoundAlertOpen, setIsWordNotFoundAlertOpen] = useState(false)
  const [isGameLost, setIsGameLost] = useState(false)
  const [shareComplete, setShareComplete] = useState(false)
  const {solution, solutionIndex, setSolutionIndex} = useCurrentGame();
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage()
    if (loaded?.solution !== solution) {
      return []
    }
    if (loaded.guesses.includes(solution)) {
      setIsGameWon(true);
    }
    return loaded.guesses
  })

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, solution })
  }, [guesses, solution])

  useEffect(() => {
    if (isGameWon) {
      setIsWinModalOpen(true)
    }
  }, [isGameWon])

  const onChar = (value: string) => {
    if (currentGuess.length < 5 && guesses.length < 6 && !isLoginModalOpen) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const onDelete = () => {
    setCurrentGuess(currentGuess.slice(0, -1))
  }

  const resetForNextGame = () => {
    const gameData = {
      guesses: guesses.length,
      won: isGameWon,
      username
    }
    saveFinalGameStatesToLocalStorage(gameData);
    setSolutionIndex(solutionIndex + 1);
    setGuesses([]);
    setCurrentGuess('');
    setIsGameWon(false);
    setIsGameLost(false);
  }

  const onEnter = () => {
    if (!isWordInWordList(currentGuess) && !isLoginModalOpen) {
      setIsWordNotFoundAlertOpen(true);
      return setTimeout(() => {
        setIsWordNotFoundAlertOpen(false);
        setCurrentGuess('');
      }, 2000)
    }

    const winningWord = isWinningWord({word: currentGuess, solution})

    if (currentGuess.length === 5 && guesses.length < 6 && !isGameWon) {
      setGuesses([...guesses, currentGuess])
      setCurrentGuess('')

      if (winningWord) {
        return setIsGameWon(true)
      }

      if (guesses.length === 5) {
        setIsGameLost(true)
        return setTimeout(() => {
          setIsGameLost(false)
          resetForNextGame();
        }, 2000)
      }
    }
  }

  return (
    <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
      <Alert message="Word not found" isOpen={isWordNotFoundAlertOpen} />
      <Alert
        message={`You lost, the word was ${solution}`}
        isOpen={isGameLost}
      />
      <Alert
        message="Game copied to clipboard"
        isOpen={shareComplete}
        variant="success"
      />
      <div className="usernameContainer">
      <button onClick={() => setIsLoginModalOpen(true)}>{username ? `Welcome, ${username}` : `Login`}</button>
      </div>
      <div className="flex w-80 mx-auto items-center mb-8">
          <h1 className="text-xl grow font-bold">Nerdle</h1>
          <h3 className="font-bold">Speed round Wordle</h3>
        <InformationCircleIcon
          className="h-6 w-6 cursor-pointer"
          onClick={() => setIsInfoModalOpen(true)}
        />
      </div>
      <Grid guesses={guesses} currentGuess={currentGuess} solution={solution} />
      <Keyboard
        onChar={onChar}
        onDelete={onDelete}
        onEnter={onEnter}
        guesses={guesses}
        solution={solution}
      />
      <WinModal
        isOpen={isWinModalOpen}
        handleClose={() => {
          setIsWinModalOpen(false)
          resetForNextGame();
        }}
        guesses={guesses}
        solution={solution}
        handleShare={() => {
          setIsWinModalOpen(false)
          setShareComplete(true)
          return setTimeout(() => {
            setShareComplete(false)
            resetForNextGame();
          }, 2000)
        }}
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        handleClose={() => setIsInfoModalOpen(false)}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        handleClose={() => setIsAboutModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        handleClose={() => setIsLoginModalOpen(false)}
        handleClick={(value) => setUsername(value)}
      />

      <button
        type="button"
        className="mx-auto mt-8 flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setIsAboutModalOpen(true)}
      >
        About this game
      </button>
    </div>
  )
}

export default App
