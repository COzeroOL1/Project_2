import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { readDeck } from "../utils/api";

function Study() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    async function loadDeck() {
      const abortController = new AbortController();
      try {
        const response = await readDeck(deckId, abortController.signal);
        setDeck(response);
      } catch (error) {
        console.error("Error loading deck:", error);
      }
      return () => abortController.abort();
    }
    loadDeck();
  }, [deckId]);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    if (cardIndex < deck.cards.length - 1) {
      setCardIndex(cardIndex + 1);
      setFlipped(false);
    } else {
      const restart = window.confirm(
        "Restart cards?\n\nClick 'cancel' to return to the home page."
      );
      if (restart) {
        setCardIndex(0);
        setFlipped(false);
      } else {
        navigate("/");
      }
    }
  };

  if (!deck) {
    return <h2>Loading...</h2>;
  }

  if (deck.cards.length <= 2) {
    return (
      <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {deck.name}
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Study
            </li>
          </ol>
        </nav>
        <h2>{deck.name}: Study</h2>
        <h3>Not enough cards.</h3>
        <p>
          You need at least 3 cards to study. There are {deck.cards.length} cards in this
          deck.
        </p>
        <Link to={`/decks/${deck.id}/cards/new`} className="btn btn-primary">
          <span className="oi oi-plus" /> Add Cards
        </Link>
      </div>
    );
  }

  const currentCard = deck.cards[cardIndex];

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">Home</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {deck.name}
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Study
          </li>
        </ol>
      </nav>
      <h2>Study: {deck.name}</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            Card {cardIndex + 1} of {deck.cards.length}
          </h5>
          <p className="card-text">
            {flipped ? currentCard.back : currentCard.front}
          </p>
          <button className="btn btn-secondary mr-2" onClick={handleFlip}>
            Flip
          </button>
          {flipped && (
            <button className="btn btn-primary" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Study;
