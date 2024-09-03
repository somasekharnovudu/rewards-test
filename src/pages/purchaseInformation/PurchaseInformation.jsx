// import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getUserData } from "../../services/appservice";

const PurchaseInformation = () => {
  const params = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserData(id) {
      const data = await getUserData(id);
      console.log(JSON.stringify(data));
      setUser(data);
    }
    fetchUserData(params.id);
  }, [params.id]);

  return (
    <div className="container">
      {user && user.id}
      <br />
      {user ? user.user_name : "Loading..."}
    </div>
  );
};

export default PurchaseInformation;
