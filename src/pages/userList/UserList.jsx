import { getUserList } from "../../services/appservice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export const UserList = () => {
  const navigate = useNavigate();

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
              <td>
                {user.purchase_history.reduce(
                  (total, item) => total + parseFloat(item.purchase_amount),
                  0
                )}
              </td>
              <td>
                <button onClick={() => navigate("user/:id")}>
                  more details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
