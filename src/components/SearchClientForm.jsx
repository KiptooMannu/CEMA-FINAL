import React, { useState } from 'react';
import './_SearchClientForm.scss';

const SearchClientForm = ({ onClientSearched }) => {
  const [searchClientId, setSearchClientId] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Searching...');
    setError('');

    if (!searchClientId.trim()) {
      setStatus('Failed');
      setError('Please enter a Client ID to search.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/clients/search?query=${searchClientId}`, {  // Changed to "query"
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization header if needed
          // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStatus('Success');
        onClientSearched(data.data); // Access the data property
      } else {
        const errorData = await response.json();
        setStatus('Failed');
        setError(errorData?.message || 'Client not found.');
        onClientSearched(null);
      }
    } catch (err) {
      setStatus('Failed');
      setError('Network error occurred.');
      console.error('Error searching client:', err);
    }
  };

  return (
    <div className="search-client-form">
      <h3>Search for Client</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Client ID:
          <input
            type="text"
            value={searchClientId}
            onChange={(e) => setSearchClientId(e.target.value)}
          />
        </label>
        <button type="submit" disabled={status === 'Searching...'}>
          {status === 'Searching...' ? 'Searching...' : 'Search Client'}
        </button>
        {status && <p>{status}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default SearchClientForm;
