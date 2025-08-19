import React, { useEffect, useState } from "react";
import { listDecks, deleteDeck } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

function Home() {
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDecks() {
      const abortController = new AbortController();
      try {
        const response = await listDecks(abortController.signal);
        setDecks(response);
      } catch (error) {
        console.error("Error loading decks:", error);
      }
      return () => abortController.abort();
    }
    loadDecks();
  }, []);

  const handleDelete = async (deckId) => {
    const confirmed = window.confirm(" Delete this deck?\n\nYou will not be able to recover it.");
    if (confirmed) {
      const abortController = new AbortController();
      try {
        await deleteDeck(deckId, abortController.signal);
        setDecks((currentDecks) =>
          currentDecks.filter((deck) => deck.id !== deckId)
        );
      } catch (error) {
        console.error("Error deleting deck:", error);
      }
    }
  };

  return (
    <div>
      <Link to="/decks/new" className="btn btn-secondary mb-2">
        <span className="oi oi-plus" /> Create Deck
      </Link>
      {decks.map((deck) => (
        <div className="card mb-3" key={deck.id}>
          <div className="card-body">
            <h5 className="card-title">{deck.name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">
              {deck.cards.length} cards
            </h6>
            <p className="card-text">{deck.description}</p>
            <Link to={`/decks/${deck.id}`} className="btn btn-secondary mr-2">
              <span className="oi oi-eye" /> View
            </Link>
            <Link to={`/decks/${deck.id}/study`} className="btn btn-primary mr-2">
              <span className="oi oi-book" /> Study
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(deck.id)}
            >
              <span className="oi oi-trash" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
