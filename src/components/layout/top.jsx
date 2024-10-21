import React, { useEffect, useState, useCallback, useRef } from "react";
import { observer, inject } from "mobx-react";
import styled, { keyframes } from "styled-components";
import { withRouter, useHistory } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { NoNavAndTopPaths } from "@/router";

import { GuidePages, inboxIds } from "@/components/Guide/index";
import { Dmail } from '@/utils/index'
import Svgs from "@/components/svgs/top";
import { PageList, getParentPath } from "./utils";
import { TopActions } from "./css";
import UserInfo from './userInfo'
import { flexBetween } from "../css.common";

const Root = styled.div`
  ${flexBetween}
  padding: 15px 20px 0 20px;

  .page-name {
    font-weight: bold;
    font-size: 20px;
    color: #000000;
  }
`;

const Top = ({ location: { pathname }, store }) => {
  const { myNftList, routerBlockFn, unReadList } = store.common;
  const history = useHistory();

  const toContact = () => {
    history.push("/contacts/dusers")
  }

  const toPoints = async () => {
    if (routerBlockFn) {
      routerBlockFn(() => history.push('/events/points'))
      return
    }
    history.push("/events/points")
  }
  const toSetting = () => {
    history.push("/setting/account")
  }

  const [pageName, setPageName] = useState('')
  useEffect(() => {
    const fPage = PageList.filter(({ path }) => pathname.indexOf(getParentPath(path)) === 0)
    // console.log('fPage', fPage, pathname, PageList)
    setPageName(fPage.length ? fPage[0].name : 'Dmail')

    const num = unReadList.Inbox > 0 ? `(${unReadList.Inbox}) ` : ''
    document.title = fPage.length ? `${num}${fPage[0].name} | ${Dmail}` : `${num}${Dmail}`
  }, [pathname, unReadList])

  const noNavAndTop = !!NoNavAndTopPaths.filter((path) => path.indexOf(pathname) === 0).length
  if (noNavAndTop) {
    return null
  }

  return (
    <Root>
      <div className="page-name">{pageName}</div>
      <TopActions>
        <div className="group">
          {/* <div className="item btn">
            <Svgs type="workspace" />
            <span>Workspace</span>
          </div>
          <div className="item btn">
            <Svgs type="dapp" />
            <span>DApps center</span>
          </div> */}
          <div className="item btn" onClick={toContact}>
            <Svgs type="contact" />
            <span>Contact</span>
          </div>
        </div>
        <div className="group">
          <div className="item btn quick-title" data-title="Points" onClick={toPoints}>
            <Svgs type="points" />
          </div>
          <div className="item btn quick-title" data-title="Setting" onClick={toSetting} id={`__guide_${GuidePages.inbox}_${inboxIds[0]}`}>
            <Svgs type="settings" />
          </div>
          <UserInfo />
        </div>  
      </TopActions>
    </Root>
  );
};

export default withRouter(inject("store")(observer(Top)));
