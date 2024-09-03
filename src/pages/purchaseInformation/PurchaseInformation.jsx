import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { getUserData } from '../../services/appservice';
import { Loader } from '../../components/Loader/Loader';
import moment from 'moment'
import { formatCurrency } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';
import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';

const calculatePoints = (amount) => {
  let points = 0;
  if (amount > 100) {
    points += 2 * (amount - 100);
  }
  if (amount >= 50 && amount <= 100) {
    points += amount - 50;
  }
  return points;
};

export const PurchaseInformation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({})
  const [errorMessage, setErrorMessage] = useState('');
  const [rewardsInfo, setRewardsInfo] = useState([]);
  const [rewardsBreakup, setRewardsBreakUp] = useState([])
  const [isLoading, setLoading] = useState(false)

  const purchaseColumns = useMemo(
    () => [
      {
        accessorKey: 'purchase_date', //simple recommended way to define a column
        header: 'Purchase Date',
        Cell: ({ cell }) => moment(cell.getValue()).format('MMM DD,yyyy')
      },
      {
        accessorKey: 'purchase_amount', //simple recommended way to define a column
        header: 'Purchase Amount',
        Cell: ({ cell }) => formatCurrency(parseFloat(cell.getValue()))
      },
      {
        accessorKey: 'reward_points', //simple recommended way to define a column
        header: 'Reward Points',
        Cell: ({ cell }) => formatCurrency(parseFloat(cell.getValue()))
      }
    ],
    [],
  );
  const purchaseHistoryTable = useMaterialReactTable({
    columns: purchaseColumns,
    data: rewardsInfo,
    enableColumnOrdering: true,
    enableGlobalFilter: false,
  });


  const breakUpColumns = useMemo(
    () => [
      {
        accessorKey: 'month', //simple recommended way to define a column
        header: 'Month',
        Cell: ({ cell }) => moment(cell.getValue(), 'YYYYMM').format('MMMM, YYYY')
      },
      {
        accessorKey: 'reward_points', //simple recommended way to define a column
        header: 'Reward Points',
      }
    ],
    [],
  );
  const breakupTable = useMaterialReactTable({
    columns: breakUpColumns,
    data: rewardsBreakup,
    enableColumnOrdering: true,
    enableGlobalFilter: false,
  });


  const calculateUserRewards = () => {
    const { purchase_history } = userInfo;
    if (purchase_history?.length) {
      const rewardsArr = purchase_history.map((purchaseObj) => ({
        ...purchaseObj,
        reward_points: calculatePoints(parseFloat(purchaseObj.purchase_amount))
      }))
      setRewardsInfo(rewardsArr)
    }
  }

  useEffect(() => {
    setLoading(true)
    getUserData(id).then((resp) => {
      if (resp.err) {
        setErrorMessage(resp.err.toString())
      }
      if (resp.data) {
        setUserInfo(resp.data)
      }
    }).finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (userInfo) {
      calculateUserRewards()
    }
  }, [userInfo])

  useEffect(() => {
    if (rewardsInfo.length) {
      const breakupObj = {};
      rewardsInfo.forEach((rewardObj) => {
        const dateObj = moment(rewardObj.purchase_date);
        const key = dateObj.format('yyyy-MMM');
        if (breakupObj[key]) {
          breakupObj[key].reward_points += rewardObj.reward_points
        } else {
          breakupObj[key] = {
            month: dateObj.format('yyyyMM'),
            year: dateObj.format('yyyy'),
            render_month: dateObj.format('MMMM, yyyy'),
            reward_points: rewardObj.reward_points
          }
        }
      })
      setRewardsBreakUp(Object.values(breakupObj))
    }
  }, [rewardsInfo])

  return <div className="container">
    {isLoading ? <Loader /> : ''}
    <div className="link" role='link' onClick={() => navigate(`/`)}>
      Go Back
    </div>
    <h2>User Information</h2>
    <h3>User Name: {userInfo.user_name}</h3>
    <h3>Purchase Information</h3>
    {
      errorMessage ? <div className="error">{errorMessage}</div> : ''
    }
    {
      !errorMessage && userInfo?.purchase_history ? <MaterialReactTable table={purchaseHistoryTable} /> : ''
    }

    <h3>Rewards Monthly Breakup</h3>
    {
      !rewardsBreakup.length ? 'Reward Points Not available' : <MaterialReactTable table={breakupTable} />
    }
  </div>;
};
