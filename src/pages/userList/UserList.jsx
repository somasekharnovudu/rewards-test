import React, { useMemo } from 'react';
import { getUserList } from '../../services/appservice';
import { Loader } from '../../components/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/utils';
import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';


export const UserList = () => {

  const [userList, setUserList] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id', //simple recommended way to define a column
        header: 'ID',
      },
      {
        accessorKey: 'user_name', //simple recommended way to define a column
        header: 'User Name',
      },
      {
        accessorKey: 'purchase_amount', //simple recommended way to define a column
        header: 'Purchase Amount',
        Cell: ({ cell }) => formatCurrency(parseFloat(cell.getValue()))
      }, {
        accessorKey: 'details_id',
        header: 'Details',
        enableSorting: false,
        enableColumnOrdering: false,
        Cell: ({ cell }) => <div className="link" role='link' onClick={() => navigate(`user/${cell.getValue()}`)}>
          Click for Purchase details
        </div>
      }
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: userList,
    enableColumnOrdering: true,
    enableGlobalFilter: false,
  });

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
            purchase_amount: userObj.purchase_history.reduce((a, b) => a + parseFloat(b.purchase_amount), 0),
            details_id: userObj.id
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
        !errorMessage && userList?.length ? <MaterialReactTable table={table} /> : ''
      }

    </div>
  );
};
