import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";
import NavBar from './components/Navigation/NavBar'
import Home from "./containers/Home";
import MapList from "./containers/MapList";
import CreateLot from "./containers/CreateLot";
// import Owner from "components/Lot/Owner";

const App = () => {
  const [state, setState] = useState({
    lots: [],
    user: {},
    owned: [],
    leased: [],
    lotsOwnerStatus: {},
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/lots"),
      axios.get("/users/me"),
      axios.get("/api/lots/owned"),
      axios.get("/api/lots/leased"),
    ]).then(
      ([{ data: lots }, { data: user }, { data: owned }, { data: leased }]) => {
        let lotsOwnerStatus = {};
        lots.forEach((lot) => {
          lotsOwnerStatus[lot.id] = null;
        });
        owned.forEach((lot) => {
          lotsOwnerStatus[lot.id] = "owned";
        });
        leased.forEach((lot) => {
          lotsOwnerStatus[lot.id] = "leased";
        });

        setState((prev) => ({
          ...prev,
          lots,
          user,
          owned,
          leased,
          lotsOwnerStatus,
        }));
      }
    );
  }, []);

  return (
    <div className="App">
      <Router>
        <NavBar />
        <Switch>
          {/* <Route path="/owner">
            <Owner />
          </Route> */}
          <Route path="/mapview">
            <MapList
              state={state}
              setState={setState}
              // lots={state.lots}
              // lotsOwnerStatus={state.lotsOwnerstatus}
            />
          </Route>
          <Route path="/new">
            <CreateLot />
          </Route>
          <Route path="/">
            <Home
              state={state}
              setState={setState}
              // lots={state.lots}
              // user={state.user}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
