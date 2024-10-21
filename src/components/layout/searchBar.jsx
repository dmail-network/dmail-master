import React, { useEffect, useState, useCallback, useRef } from "react";
import { observer, inject } from "mobx-react";
import styled, { keyframes } from "styled-components";

import { flex, flexAlign, flexBetween } from "../css.common";
import { Search, Redirect, GoPage, SearchChunk } from "./css";

const Root = styled.div`
  &.mobile {
    background: #F5F5F5;
    border-bottom: none;
    padding: 0 7px 0 15px;
  }

  ${flexBetween}
  padding: 4px 14px 4px 22px;
  border-bottom: 1px solid #eee;
  position: relative;
  z-index: 10;
`;

const SearchBar = ({ store, children }) => {
  const { isMobile } = store.mobile;
  const [showRedirect, setShowRedirect] = useState(false);

  const closeRedirect = (ev) => {
    if (
      !ev.target.classList.contains("_redirectPop") &&
      !ev.target.parentElement.classList.contains("_redirectPop")
    ) {
      setShowRedirect(false);
    }
  };

  const SearchList = () => {
  };
  useEffect(() => {
    document.body.addEventListener("click", closeRedirect);

    return () => {
      document.body.removeEventListener("click", closeRedirect);
    };
  }, []);

 
  return (
    <Root className={`${isMobile ? 'mobile' : ''}`}>
      {children}
      {/* <SearchChunk> */}
        {/* <Search>
          <input type="text" placeholder="Search" />
          <div className="search-btn" onClick={ SearchList }></div>
        </Search> */}

        {/* <Redirect>
          <div className="page">
            <strong>1</strong>/9
          </div>
          <div
            className="to _redirectPop"
            onClick={() => setShowRedirect(true)}
          >
            <span>&gt;</span> redirect to
          </div>
          <GoPage
            className={`${showRedirect ? "on _redirectPop" : "_redirectPop"}`}
          >
            <span>Redirect to</span>
            <input type="number" />
            <a rel="noopener noreferrer"  >Go</a>
          </GoPage> */}
        {/* </Redirect> */}
      {/* </SearchChunk> */}
    </Root>
  );
};

export default inject("store")(observer(SearchBar));
