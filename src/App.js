import React, { useEffect, useState } from "react";

import "./App.scss";
import MenuPopUp from "./components/MenuPopUp";
import LeftSideBar from "./components/LeftSideBar";
import MainFeed from "./components/MainFeed";
import axios from "axios";
import Login from "./components/Login";

function App() {
  const [header, setHeader] = useState({});
  const [isAuth, setIsAuth] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [selectedUser, setSelectedUser] = useState({});
  const [menuVis, setMenuVis] = useState(false);
  const [page, setPage] = useState(0);

  const tokenHandler = (token) => {
    let tokenCopy = token;
    setHeader({ Authorization: `Bearer ${tokenCopy}` });
    setIsAuth(true);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/tweets/", {
          method: "GET",
        });
        const data = await response.json();
        if (
          data.status === "fail" ||
          data.status === "error" ||
          data.status === null
        )
          setIsAuth(false);
        else {
          setIsAuth(true);
          setIsLoaded(true);
          const currentUserCopy = { ...data.data.currentUser };

          setCurrentUser(currentUserCopy);
        }
      } catch (err) {
        console.log(err);
        setIsAuth(false);
      }
    }
    fetchData();
  }, [isAuth]);

  const menuHandler = () => {
    if (menuVis) setMenuVis(false);
    else setMenuVis(true);
  };

  const logOut = async () => {
    try {
      await fetch("/api/v1/users/logout", {
        method: "GET",
      });
      setMenuVis(false);
      setIsAuth(false);
      setCurrentUser({});
      setPage(0);
    } catch (err) {
      console.log(err);
    }
  };

  // const pageRequest = (page) => {
  //   console.log("Page request:", page);
  //   setPage(page);
  // };

  const changePage = (page) => {
    console.log(`Change to page ${page}.`);
    if (page === 0) setSelectedUser({});
    setPage(page);
  };

  const fetchUser = (id) => {
    axios.get(`/api/v1/users/${id}`).then((res) => {
      setSelectedUser(res.data.data.user);
    });
    changePage(1);
  };

  if (!isAuth) {
    // Login/ register screen
    return (
      <div className='App'>
        <Login tokenHandler={tokenHandler} logOut={logOut} />
      </div>
    );
  } else {
    // Main screen
    return (
      <div className='App'>
        <div className='wrapper-main'>
          <MenuPopUp
            menuVis={menuVis}
            menuHandler={menuHandler}
            logOut={logOut}
            currentUser={currentUser}
          />
          <LeftSideBar
            menu={menuHandler}
            currentUser={currentUser}
            // pageRequest={(page) => pageRequest(page)}
            changePage={changePage}
            // setPage={setPage}
          />

          <MainFeed
            header={header}
            currentUser={currentUser}
            selectedUser={selectedUser}
            page={page}
            changePage={changePage}
            fetchUser={fetchUser}
            // pageRequest={(page) => pageRequest(page)}
            isLoaded={isLoaded}
          />

          <div className='rightsidebar'></div>
        </div>
      </div>
    );
  }
}

export default App;
