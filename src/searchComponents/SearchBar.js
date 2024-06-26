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
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        id="search"
        type="text"
        value={searchValue}
        onChange={handleChange}
        className="search-input"
        placeholder="Search by Song Name, Artist or Album"
      />
    </form>
  );
}

export default Input;
