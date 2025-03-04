import React, { useState, useEffect, useCallback, useMemo, memo } from "react";

const fetchUsers = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  return response.json();
};

const UserList = memo(({ users }) => {
  console.log("Rendering UserList");
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
});

const App = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search users..."
      />
      <UserList users={filteredUsers} />
    </div>
  );
};

export default App;
