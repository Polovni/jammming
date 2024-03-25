import React, { useState } from 'react';

function Input({ onSearchSubmit }) {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit(searchValue);
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search">Search by Song Name, Artist or Album</label>
      <input
        id="search"
        type="text"
        value={searchValue}
        onChange={handleChange}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default Input;
