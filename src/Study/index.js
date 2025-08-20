import React, { useState } from "react";
import { useParams, useNavigate, Link, useOutletContext } from "react-router-dom";

function Study() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { deck } = useOutletContext();
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!deck) {
    return <h2>Loading...</h2>;
  }

  if (deck.cards.length < 3) {
    return (
      <div>
        <h3>Not enough cards.</h3>
        <p>You need at least 3 cards to study. There are {deck.cards.length} cards in this deck.</p>
        <Link to={`/decks/${deck.id}/cards/new`} className="btn btn-primary">
          <span className="oi oi-plus" /> Add Cards
        </Link>
      </div>
    );
  }

  const currentCard = deck.cards[cardIndex];

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

  return (
    <div>
      <h2 className="mt-2">{deck.name}: Study</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Card {cardIndex + 1} of {deck.cards.length}</h5>
          <p className="card-text">{flipped ? currentCard.back : currentCard.front}</p>
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
