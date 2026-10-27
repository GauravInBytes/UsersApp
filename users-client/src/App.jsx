import { useEffect, useState } from "react";
import User from "./components/User";
import AddUser from "./components/AddUser";

import "./App.css";

const API_URL = "https://localhost:7163/api/users";
// Change the port to match the HTTPS URL shown when you start UsersApi.

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadNewUsers, setLoadNewUsers] = useState(false);
  const [showAddUserModel, setShowAddUserModel] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [loadNewUsers]);

  async function loadUsers() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      setUsers(await response.json());
      setLoadNewUsers(false);
    } catch (err) {
      setError(err.message || "Could not load users.");
    } finally {
      setLoading(false);
    }
  }

  const toggleShowAddUserModel = () => {
    setShowAddUserModel(!showAddUserModel);
  }
  return (
    <main className="page">
      <section className="card">
        <h1>Users</h1>
        <button className="addUserButton" onClick={toggleShowAddUserModel}>Add User</button>
        {showAddUserModel && <AddUser setShowAddUserModel={setShowAddUserModel} setLoadNewUsers={setLoadNewUsers} />}
        <p className="subtitle">Users loaded from the ASP.NET Core API</p>

        {loading && <p>Loading users…</p>}
        {error && <p className="error">Error: {error}</p>}

        {!loading && !error && users.length === 0 && (
          <p>No users found.</p>
        )}

        {!loading && !error && users.length > 0 && (
          <ul className="user-list">
            {users.map((user) => (
              <User key={user.id}
                user={user}
                setLoadNewUsers={setLoadNewUsers}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;