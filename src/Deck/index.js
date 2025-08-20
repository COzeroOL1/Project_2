import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { readDeck, deleteDeck, deleteCard } from "../utils/api";

function Deck() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [deck, setDeck] = useState(null);

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

  const handleDeleteDeck = async () => {
    const confirmed = window.confirm("Delete this deck?\n\nYou will not be able to recover it.");
    if (confirmed) {
      const abortController = new AbortController();
      try {
        await deleteDeck(deck.id, abortController.signal);
        navigate("/");
      } catch (error) {
        console.error("Error deleting deck:", error);
      }
    }
  };

  const handleDeleteCard = async (cardId) => {
    const confirmed = window.confirm("Delete this card?\n\nYou will not be able to recover it.");
    if (confirmed) {
      const abortController = new AbortController();
      try {
        await deleteCard(cardId, abortController.signal);
        setDeck((currentDeck) => {
          const updatedCards = currentDeck.cards.filter((card) => card.id !== cardId);
          return { ...currentDeck, cards: updatedCards };
        });
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    }
  };

  if (!deck) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {deck.name}
          </li>
        </ol>
      </nav>
      <p>{deck.description}</p>
      <Link to={`/decks/${deck.id}/edit`} className="btn btn-secondary mr-2">
        <span className="oi oi-pencil" /> Edit
      </Link>
      <Link to={`/decks/${deck.id}/study`} className="btn btn-primary mr-2">
        <span className="oi oi-book" /> Study
      </Link>
      <Link to={`/decks/${deck.id}/cards/new`} className="btn btn-primary mr-2">
        <span className="oi oi-plus" /> Add Cards
      </Link>
      <button className="btn btn-danger" onClick={handleDeleteDeck}>
        <span className="oi oi-trash" /> Delete
      </button>

      {location.pathname === `/decks/${deckId}` && (
        <>
          <h2 className="mt-4">Cards</h2>
          <div className="card-list">
            {deck.cards.map((card) => (
              <div className="card mb-3" key={card.id}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p>{card.front}</p>
                    </div>
                    <div className="col-md-6">
                      <p>{card.back}</p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <Link
                      to={`/decks/${deck.id}/cards/${card.id}/edit`}
                      className="btn btn-secondary mr-2"
                    >
                      <span className="oi oi-pencil" /> Edit
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      <span className="oi oi-trash" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <Outlet context={{ deck, setDeck, handleDeleteCard, handleDeleteDeck }} />
    </div>
  );
}

export default Deck;