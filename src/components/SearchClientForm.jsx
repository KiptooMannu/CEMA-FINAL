import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './_SearchClientForm.scss';

const SearchClientForm = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/api/clients', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        
        const data = await response.json();
        setClients(data.data);
        setFilteredClients(data.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching clients:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filter clients based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client => 
        client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm) ||
        client.id.toString().includes(searchTerm)
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  if (isLoading) {
    return (
      <div className="client-search-container">
        <div className="loading-spinner"></div>
        <p>Loading clients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-search-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="client-search-page">
      <ToastContainer />
      
      <div className="search-header">
        <h1>Client Management</h1>
        <div className="search-controls">
          <input
            type="text"
            placeholder="Search clients by name, email, phone, or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">
            <i className="fas fa-search"></i>
          </span>
        </div>
      </div>

      <div className="clients-container">
        <div className="clients-header">
          <h2>Registered Clients</h2>
          <span className="client-count">{filteredClients.length} clients found</span>
        </div>

        {filteredClients.length > 0 ? (
          <div className="clients-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(client => (
                  <tr key={client.id}>
                    <td>{client.id}</td>
                    <td>{client.first_name} {client.last_name}</td>
                    <td>{client.email || '-'}</td>
                    <td>{client.phone || '-'}</td>
                    <td>
                      <button className="view-btn">View</button>
                      <button className="edit-btn">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-results">
            <p>No clients found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchClientForm;