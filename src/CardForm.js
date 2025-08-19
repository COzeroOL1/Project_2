import React from "react";

function CardForm({ formData, handleChange, handleSubmit, handleCancel, submitLabel }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="front">Front</label>
        <textarea
          className="form-control"
          id="front"
          name="front"
          value={formData.front}
          onChange={handleChange}
          rows="3"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="back">Back</label>
        <textarea
          className="form-control"
          id="back"
          name="back"
          value={formData.back}
          onChange={handleChange}
          rows="3"
          required
        />
      </div>
      <button type="button" className="btn btn-secondary mr-2" onClick={handleCancel}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary">
        {submitLabel}
      </button>
    </form>
  );
}

export default CardForm;
