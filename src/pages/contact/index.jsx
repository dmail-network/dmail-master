import React, { useEffect, useState, useCallback, useRef } from "react";
import { observer, inject } from "mobx-react";

import Container from "@/components/layout/container";
import Tabs from "@/components/Tabs";
import { Root } from "./css";
import Contact from './contact'
// import Cc from './cc'

const tabList = [
  {
    name: 'Dmail Contact',
    value: 1,
    key: 'dusers',
  },
  // {
  //   name: 'CC Profiles',
  //   value: 2,
  //   key: 'cc',
  // },
]

const Index = ({ store }) => {
  return (
    <Container noSearch="false">
      <Root className="flexColumn1">
        <Tabs tabList={tabList} matchKey="key">
          <Contact />
          {/* <Cc /> */}
        </Tabs>
      </Root>
    </Container>
  )
};

export default inject("store")(observer(Index));
