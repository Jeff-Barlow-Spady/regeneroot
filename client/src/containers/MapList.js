import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import MapContainer from "../components/MapContainer";
import LotForm from "../components/Lot/LotForm";
import SmallLotItem from "../components/Lot/SmallLotItem";
import "./MapList.css";
import { SearchInput, Spinner, Pane } from "evergreen-ui";

const MapList = () => {
  const [enteredCity, setEnteredCity] = useState("");
  const [enteredMinSize, setEnteredMinSize] = useState("");
  const [enteredMaxSize, setEnteredMaxSize] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [data, setData] = useState([]);
  const [state, setState] = useState({
    lots: [],
    user: {},
    owned: [],
    leased: [],
  });

  const inputRef = useRef("");

  useEffect(() => {
    const timer = setTimeout(() => {
      //compare old search string with new string, if same, send http request

      // this is dependent on evergreen-ui library ^5.1.2
      // const inputValue = inputRef.current.children[1].value;
      // console.log(inputRef.current.children[1].value)
      // if (enteredCity === inputRef) {
      let query = "?";
      if (enteredCity.length > 0) {
        setIsLoading(true);
        query += `city=${enteredCity}&`;
      }
      if (enteredMinSize.length > 0) {
        setIsLoading(true);
        query += `minimum_size=${enteredMinSize}&`;
      }
      if (enteredMaxSize.length > 0) {
        setIsLoading(true);
        query += `maximum_size=${enteredMaxSize}&`;
      }

      axios.get("/api/lots/search" + query).then((response) => {
        setIsLoading(false);
        setState((prev) => ({
          ...prev,
          lots: response.data,
        }));
      });
    }, 1000);
    // clean up timer before next run
    return () => {
      clearTimeout(timer);
    };
  }, [enteredCity, enteredMinSize, enteredMaxSize, inputRef]);

  return (
    <main className="maplist-view">
      <Pane>
        <nav className="navbar"></nav>
      </Pane>
      <section className="maplist-view--searchbar">
        <Pane
          display="flex"
          flexDirection="row"
          justifyContent="center"
          padding={50}
        >
          <div className="search-item--city">
            <SearchInput
              ref={inputRef}
              placeholder="City name..."
              value={enteredCity}
              onChange={(e) => setEnteredCity(e.target.value)}
            />
          </div>
          <div className="search-item--minsize">
            <SearchInput
              ref={inputRef}
              placeholder="Min lot size in sqft"
              value={enteredMinSize}
              onChange={(e) => setEnteredMinSize(e.target.value)}
            />
          </div>
          <div className="search-item--maxsize">
            <SearchInput
              ref={inputRef}
              placeholder="Max lot size in sqft"
              value={enteredMaxSize}
              onChange={(e) => setEnteredMaxSize(e.target.value)}
            />
          </div>
          {isLoading && (
            <Pane
              display="flex"
              alignItems="center"
              justifyContent="center"
              height={200}
            >
              <Spinner />
            </Pane>
          )}
        </Pane>
      </section>
      <section className="maplist-view--content">
        <div className="small-lot--list">
          {state.lots.map((lot) => {
            return (
              <SmallLotItem
                key={lot.id}
                imageUrls={lot.images}
                title={lot.title}
                city={lot.city}
              />
            );
          })}
        </div>
        <div className="maplist-view--map-container">
          <MapContainer lots={state.lots} />
        </div>
      </section>
    </main>
  );
};

export default MapList;