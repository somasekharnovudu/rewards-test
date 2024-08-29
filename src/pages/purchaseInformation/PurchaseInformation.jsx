import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getUserData } from '../../services/appservice';
import { Loader } from '../../components/Loader/Loader';
import moment from 'moment'
import { formatCurrency } from '../../utils/utils';

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
  const [userInfo, setUserInfo] = useState({})
  const [errorMessage, setErrorMessage] = useState('');
  const [rewardsInfo, setRewardsInfo] = useState([]);
  const [rewardsBreakup, setRewardsBreakUp] = useState([])
  const [isLoading, setLoading] = useState(false)

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
    <h2>User Information</h2>
    <h3>User Name: {userInfo.user_name}</h3>
    <h3>Purchase Information</h3>
    {
      errorMessage ? <div className="error">{errorMessage}</div> : ''
    }
    {
      !errorMessage && userInfo?.purchase_history ? <table>
        <thead>
          <tr>
            <th>Purchase Date</th>
            <th>Purchase Amount</th>
            <th>Reward Points</th>
          </tr>
        </thead>
        <tbody>
          {
            rewardsInfo.map((rewardObj) => <tr key={rewardObj.purchase_date + rewardObj.reward_points}>
              <td>{moment(rewardObj.purchase_date).format('MMM DD,yyyy')}</td>
              <td>{formatCurrency(parseFloat(rewardObj.purchase_amount))}</td>
              <td>{rewardObj.reward_points}</td>
            </tr>)
          }
        </tbody>
      </table> : ''
    }

    <h3>Rewards Monthly Breakup</h3>
    {
      !rewardsBreakup.length ? 'Reward Points Not available' : <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Reward Points</th>
          </tr>
        </thead>
        <tbody>
          {
            rewardsBreakup.map((rewardObj) => <tr key={rewardObj.month}>
              <td>{rewardObj.render_month}</td>
              <td>{rewardObj.reward_points}</td>
            </tr>)
          }
        </tbody>
      </table>
    }
  </div>;
};
