import React, { useState } from 'react';

function AddArticle({ onAdd, loading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onAdd(url);
      setUrl('');
    }
  };

  return (
    <form className="add-article" onSubmit={handleSubmit}>
      <input
        type="url"
        placeholder="Paste article URL here..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={loading}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}

export default AddArticle;