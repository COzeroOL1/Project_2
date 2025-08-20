import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import NotFound from "./Layout/NotFound";
import Home from "./Home";
import CreateDeck from "./CreateDeck";
import Deck from "./Deck";
import Study from "./Study";
import EditDeck from "./EditDeck";
import AddCard from "./AddCard";
import EditCard from "./EditCard";
import "./App.css";

function App() {
  return (
    <div className="app-routes">
      <Layout>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/decks/new" element={<CreateDeck />} />
          <Route path="/decks/:deckId" element={<Deck />}>
            <Route path="edit" element={<EditDeck />} />
            <Route path="study" element={<Study />} />
            <Route path="cards/new" element={<AddCard />} />
            <Route path="cards/:cardId/edit" element={<EditCard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;