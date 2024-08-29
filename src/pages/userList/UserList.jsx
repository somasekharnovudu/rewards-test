import { getUserList } from "../../services/appservice";
import { useState, useEffect } from "react";

export const UserList = () => {
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const list = await getUserList();
      setUserList(list);
    };
    fetchUsers();
  }, []);

  return (
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
          {userList.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.user_name}</td>
              <td>{user.purchase_history.purchase_amount}</td>
              <td>click here for more data</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
