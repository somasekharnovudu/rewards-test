import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router";
import { UserList } from "./pages/userList/UserList";
import { PurchaseInformation } from "./pages/purchaseInformation/PurchaseInformation";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact Component={UserList} />
        <Route path="user/:id" exact Component={PurchaseInformation} />
      </Routes>
    </div>
  );
}

export default function () {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
