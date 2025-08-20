import React, { useState } from "react";
import { useParams, useNavigate, Link, useOutletContext } from "react-router-dom";
import { createCard, readDeck } from "../utils/api";
import CardForm from "../CardForm";

function AddCard() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { deck, setDeck } = useOutletContext();
  const [formData, setFormData] = useState({
    front: "",
    back: "",
  });

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
      await createCard(deckId, formData, abortController.signal);
      setFormData({ front: "", back: "" });
      const updatedDeck = await readDeck(deckId, abortController.signal);
      setDeck(updatedDeck); 
      navigate(`/decks/${deckId}`);
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  const handleDone = () => {
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
            {deck.name}
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Add Card
          </li>
        </ol>
      </nav>
      <h1>{deck.name}: Add Card</h1>
      <CardForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleDone}
        submitLabel="Save"
      />
    </div>
  );
}

export default AddCard;