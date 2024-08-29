import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [userList, setUserList] = useState([])

  useEffect(() => {

  }, [])


  return (
    <div className="App">
      <header>
        <h2>User List</h2>
      </header>
      <div className="container">
        <div className="user-list-container">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>User Name</th>
                <th>Purchased Amount</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
