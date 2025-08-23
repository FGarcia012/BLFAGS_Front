import React, { useState } from 'react';

const HashtagSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };
  return (
    <form className="hashtag-search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Buscar hashtag..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button type="submit">Buscar</button>
    </form>
  );
};

export default HashtagSearch;