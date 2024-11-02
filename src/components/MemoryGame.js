import React, { useState, useEffect } from 'react';
import './MemoryGame.css';

import img1 from '../images/image1.png';
import img2 from '../images/image2.png';
import img3 from '../images/image3.png';
import img4 from '../images/image4.png';
import img5 from '../images/image5.png';
import img6 from '../images/image6.png';
import img7 from '../images/image7.png';
import img8 from '../images/image8.png';
import img9 from '../images/image9.png';
import img10 from '../images/image10.png';
import img11 from '../images/image11.png';
import img12 from '../images/image12.png';
import img13 from '../images/image13.png';
import matchSound from '../sounds/match.mp3';
import mismatchSound from '../sounds/mismatch.mp3';
import winnerSound from '../sounds/winner.mp3';
import backgroundMusic from '../sounds/background-music.mp3';

const allImages = [
  { src: img1, matched: false },
  { src: img2, matched: false },
  { src: img3, matched: false },
  { src: img4, matched: false },
  { src: img5, matched: false },
  { src: img6, matched: false },
  { src: img7, matched: false },
  { src: img8, matched: false },
  { src: img9, matched: false },
  { src: img10, matched: false },
  { src: img11, matched: false },
  { src: img12, matched: false },
  { src: img13, matched: false },
  { src: null, matched: false }, 
];

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  const numCards = 24; 
  const audioRef = React.useRef(new Audio(backgroundMusic)); 

  useEffect(() => {
    shuffleCards(numCards);
    // eslint-disable-next-line 
  }, [numCards]);

  useEffect(() => {
    const audio = audioRef.current; 
    audio.loop = true; 
    audio.volume = 0.5; 
    if (isMusicPlaying) {
      audio.play().catch(error => console.error("Error playing background music:", error));
    } else {
      audio.pause(); 
    }

    return () => {
      audio.pause(); 
    };
  }, [isMusicPlaying]);

  const toggleMusic = () => {
    setIsMusicPlaying((prev) => !prev); 
  };

  function shuffleCards(count) {
    const selectedImages = allImages.slice(0, count / 2);
    const shuffledCards = [...selectedImages, ...selectedImages]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setScore(0);
    setMatchedPairs(0);
  }

  function handleCardClick(card) {
    if (flippedCards.length < 2 && !flippedCards.includes(card) && !card.matched) {
      setFlippedCards((prev) => [...prev, card]);
    }
  }

  useEffect(() => {
    if (flippedCards.length === 2) {
      setDisabled(true);
      const [card1, card2] = flippedCards;

      if (card1.src === card2.src) {
        const audioMatch = new Audio(matchSound);
        audioMatch.play();
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.src === card1.src ? { ...card, matched: true } : card
          )
        );
        setMatchedPairs((prev) => prev + 1);
        setScore((prev) => prev + 10);
      } else {
        const audioMismatch = new Audio(mismatchSound);
        audioMismatch.play();
        setScore((prev) => prev - 2);
      }

      setTimeout(() => {
        setFlippedCards([]);
        setDisabled(false);
      }, 1000);
    }
  }, [flippedCards]);


  useEffect(() => {
    if (matchedPairs === 12) {
      const audioVictory = new Audio(winnerSound);
      audioVictory.play().catch(error => console.error("Error playing victory sound:", error));
    }
  }, [matchedPairs]);
  

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audioRef.current.pause(); 
      } else {
        if (isMusicPlaying) {
          audioRef.current.play().catch(error => console.error("Error playing background music:", error));
        }
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
  
   
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMusicPlaying]);
  



return (
  <div className="game-container">
    <h1>Memory Game</h1>
    <div className="score-board">Score: {score}</div>
    
    <div className="music-icon" onClick={toggleMusic}>
      {isMusicPlaying ? '🔊' : '🔇'}
    </div>
    
    <div className="card-grid">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`card ${flippedCards.includes(card) || card.matched ? 'flipped' : ''}`}
          onClick={() => !disabled && handleCardClick(card)}
        >
          <div className="card-inner">
            <div className="card-front"></div>
            <div className="card-back">
              {card.src ? <img src={card.src} alt="card" /> : <div className="blank-card"></div>}
            </div>
          </div>
        </div>
      ))}
    </div>
    
    {matchedPairs === 12 && (
      <div className="modal">
        <div className="modal-content">
          <h2>Congratulations!</h2>
          <p>You completed the game with a score of {score}!</p>
          <button onClick={() => shuffleCards(numCards)}>Play Again</button>
        </div>
      </div>
    )}
    
    <button className="reset-button" onClick={() => shuffleCards(numCards)}>Reset Game</button>
  </div>
);
}
