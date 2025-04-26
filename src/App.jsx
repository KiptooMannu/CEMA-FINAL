import React, { useState } from 'react';
import CreateProgramForm from './components/CreateProgramForm';
import RegisterClientForm from './components/RegisterClientForm';
import EnrollClientForm from './components/EnrollClientForm';
import SearchClientForm from './components/SearchClientForm';
import ClientProfile from './components/ClientProfile';

const App = () => {
  const [programs, setPrograms] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleCreateProgram = (newProgram) => {
    setPrograms([...programs, newProgram]);
  };

  const handleRegisterClient = (newClient) => {
    setClients([...clients, newClient]);
  };

  const handleEnrollClient = (clientId, program) => {
    const updatedClients = clients.map((client) =>
      client.clientId === clientId
        ? { ...client, programs: [...client.programs, program] }
        : client
    );
    setClients(updatedClients);
  };

  const handleSearchClient = (clientId) => {
    const foundClient = clients.find((client) => client.clientId === clientId);
    setSelectedClient(foundClient);
  };

  return (
    <div>
      <h2>Health Information System</h2>
      <CreateProgramForm onProgramCreated={handleCreateProgram} />
      <p>Available Programs: {programs.join(', ')}</p>
      <RegisterClientForm onClientRegistered={handleRegisterClient} />
      <EnrollClientForm clients={clients} programs={programs} onClientEnrolled={handleEnrollClient} />
      <SearchClientForm onClientSearched={handleSearchClient} />
      <ClientProfile client={selectedClient} />
    </div>
  );
};

export default App;