import React from 'react';
import { getUserList } from '../../services/appservice';
import { Link } from 'react-router-dom';
import { Loader } from '../../components/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/utils';

export const UserList = () => {

  const [userList, setUserList] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    setLoading(true);
    getUserList().then((resp) => {
      if (resp.err) {
        setErrorMessage(resp.err.toString())
      }
      if (resp.data) {
        const aggregateData = resp.data.map((userObj) => {
          return {
            ...userObj,
            purchase_amount: userObj.purchase_history.reduce((a, b) => a + parseFloat(b.purchase_amount), 0)
          }
        })
        setUserList(aggregateData)
      }
    }).finally(() => {
      setLoading(false)
    })

  }, [])

  return (
    <div className="user-list-container">
      {isLoading ? <Loader /> : ''}
      <h2>User list</h2>
      {
        errorMessage ? <div className="error">{errorMessage}</div> : ''
      }
      {
        !errorMessage && userList.length ? <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>Total Purchased Amount</th>
            </tr>
          </thead>
          <tbody>
            {
              userList.map((userObj) => <tr key={userObj.id}>
                <td>{userObj.id}</td>
                <td>{userObj.user_name}</td>
                <td>{formatCurrency(userObj.purchase_amount)}</td>
                <td>
                  <div className="link" role='link' onClick={() => navigate(`user/${userObj.id}`)}>
                    Click for Purchase details & Rewards
                  </div>
                </td>
              </tr>)
            }
          </tbody>
        </table> : ''
      }

    </div>
  );
};
