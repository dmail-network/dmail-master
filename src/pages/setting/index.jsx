import React, { useEffect, useState, useCallback, useRef } from "react";
import { observer, inject } from "mobx-react";

import Container from "@/components/layout/container";
import Tabs from "@/components/Tabs";
import { Root } from "./css";
import Personal from './personal'
import Account from './account'
import Did from './did'

const tabList = [
  {
    name: 'Account',
    value: 2,
    key: 'account',
  },
  {
    name: 'Personal',
    value: 1,
    key: 'personal',
  },
  {
    name: 'DID',
    value: 3,
    key: 'did',
  },
]

const Index = () => {
  return (
    <Container noSearch="false">
      <Root className="flexColumn1">
        <Tabs tabList={tabList} matchKey="name">
          <Account />
          <Personal />
          <Did />
        </Tabs>
      </Root>
    </Container>
  );
};

export default inject("store")(observer(Index));
