import React, { useState, useEffect } from 'react';


const App = () => {
  
  const [users, setUsers] = useState([]);
 
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  
  const fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async (user) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const newUser = await response.json();
      setUsers([...users, { ...user, id: newUser.id }]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleUpdateUser = async (user) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE',
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const styles = `
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1.5rem;
      font-family: sans-serif;
    }
    .main-title {
      font-size: 1.875rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.25rem;
      color: white;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }
    .btn-primary { background-color: #4299e1; }
    .btn-primary:hover { background-color: #3182ce; }
    .add-user-btn { margin-bottom: 1rem; }
    .btn-edit { background-color: #ecc94b; margin-right: 0.5rem; }
    .btn-edit:hover { background-color: #d69e2e; }
    .btn-delete { background-color: #f56565; }
    .btn-delete:hover { background-color: #e53e3e; }
    .btn-secondary { background-color: #a0aec0; margin-right: 0.5rem; }
    .btn-secondary:hover { background-color: #718096; }
    .user-table {
      width: 100%;
      background-color: white;
      border-collapse: collapse;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      border-radius: 0.5rem;
      overflow: hidden;
    }
    .user-table th, .user-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e2e8f0;
      text-align: left;
    }
    .user-table th { background-color: #f7fafc; font-weight: bold; }
    .user-table tr:last-child td { border-bottom: none; }
    .actions-cell { text-align: left; }
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal-content {
      background-color: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    .modal-title { font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; color: #4a5568; margin-bottom: 0.5rem; }
    .form-control {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #cbd5e0;
      border-radius: 0.25rem;
      box-sizing: border-box;
    }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 1.5rem; }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <h1 className="main-title">Gerenciador de Usuarios</h1>
        <button onClick={openAddModal} className="btn btn-primary add-user-btn">
          Adicionar
        </button>
        <UserTable
          users={users}
          onEdit={openEditModal}
          onDelete={handleDeleteUser}
        />
        {isModalOpen && (
          <UserForm
            user={selectedUser}
            onSave={selectedUser ? handleUpdateUser : handleAddUser}
            onClose={closeModal}
          />
        )}
      </div>
    </>
  );
};

const UserTable = ({ users, onEdit, onDelete }) => (
  <table className="user-table">
    <thead>
      <tr>
        <th>Nome</th>
        <th>Email</th>
        <th>Botões</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td className="actions-cell">
            <button onClick={() => onEdit(user)} className="btn btn-edit">
              Editar
            </button>
            <button onClick={() => onDelete(user.id)} className="btn btn-delete">
              Deletar
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const UserForm = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    user || { name: '', email: '' }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{user ? 'Edit User' : 'Add User'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
