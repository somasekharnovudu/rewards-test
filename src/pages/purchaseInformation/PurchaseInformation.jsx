import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const PurchaseInformation = () => {
  const params = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const response = await axios.get(
        `http://localhost:3001/users/${params.id}`
      );
      console.log(JSON.stringify(response.data));
      return response.data;
    }

    fetchUser().then((data) => setUser(data));
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
