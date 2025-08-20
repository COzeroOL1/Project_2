import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useOutletContext } from "react-router-dom";
import { readDeck, readCard, updateCard } from "../utils/api";
import CardForm from "../CardForm";

function EditCard() {
  const { deckId, cardId } = useParams();
  const navigate = useNavigate();
  const { deck, setDeck } = useOutletContext();
  const [formData, setFormData] = useState({
    front: "",
    back: "",
  });

  useEffect(() => {
    async function loadCard() {
      const abortController = new AbortController();
      try {
        const cardResponse = await readCard(cardId, abortController.signal);
        setFormData({ front: cardResponse.front, back: cardResponse.back });
      } catch (error) {
        console.error("Error loading card:", error);
      }
      return () => abortController.abort();
    }
    loadCard();
  }, [cardId]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await updateCard({ ...formData, id: cardId, deckId: Number(deckId) }, abortController.signal);
      const updatedDeck = await readDeck(deckId, abortController.signal);
      setDeck(updatedDeck);
      navigate(`/decks/${deckId}`);
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const handleCancel = () => {
    navigate(`/decks/${deckId}`);
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
            <Link to={`/decks/${deck.id}`}>{deck.name}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Edit Card {cardId}
          </li>
        </ol>
      </nav>
      <h1>Edit Card</h1>
      <CardForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        submitLabel="Save"
      />
    </div>
  );
}

export default EditCard;