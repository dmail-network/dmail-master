import React, { useEffect, useState, useCallback, useRef } from "react";
import { withRouter, useHistory } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { observer, inject } from "mobx-react";
import { NoNavAndTopPaths } from "@/router";

import { levelNameMap } from '@/pages/events/utils'
// import { Dmail, bindNftDialog } from "@/utils/index";
import PopInvites from '@/pages/events/popInvites'
import { Logo, Nav, UseLimit, FlexBetweenWrapper, Invite } from "./css";
import { NavList, NavMobileList } from "./utils";
import Svgs from "@/components/svgs/navs";
import NavLogo from "@/static/images/nav-logo.svg";

const Root = styled.div`
  width: 260px;
  /* padding: 32px 0 38px; */
  background: #111111;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  /* box-sizing: border-box; */
  overflow-y: auto;

  &.mobile {
    width: 74%;
    max-width: 350px;
    min-width: 250px;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 111;
    transform: translateX(-100%);
    transition: transform .3s ease-out 0s;

    &.expand {
      transform: translateX(0)
    }
  }

  & > div {
    width: 100%;

    &:first-child {
      margin-bottom: 40px;
      padding-top: 30px;
    }
  }
`;

const NavChunk = ({ location: { pathname }, store }) => {
  const history = useHistory();
  const { myNftList, unReadList, usedVolume, bindedNft, defaultAlias, initing, routerBlockFn } = store.common;
  const { isMobile, navExpand } = store.mobile;
  const bindedNftVolume = usedVolume[bindedNft] || usedVolume[defaultAlias] || {}

  const toPath = (path) => async () => {
    const notInbox = !pathname.includes('/inbox') && path.includes(pathname)
    if (initing || notInbox) {
      return
    }
    if (routerBlockFn) {
      routerBlockFn(() => history.push(path))
      return
    }
    if (path.includes('/setting') || path.includes('/presale')) {
      history.push(path);
      return
    }

    history.push(path);
  };

  const toPoints = async () => {
    // if (await store.common.bindOrBuyNftPop(isMobile, history, 'upgrade')) {
    //   return
    // }
    if (routerBlockFn) {
      routerBlockFn(() => history.push('/events/plans'))
      return
    }
    history.push('/events/plans');
  }

  const onClick = () => {
    if (import.meta.env.PROD) {
      history.push('/inbox');
    } else {
      // store.common.regetToken()
      store.common.sendWelcomeEmail()
    }
  }

  useEffect(() => {
    store.mobile.setNavExpand(false)
  }, [pathname])

  const noNavAndTop = !!NoNavAndTopPaths.filter((path) => path.indexOf(pathname) === 0).length
  if (noNavAndTop) {
    return null
  }

  return (
    <>
      <Root className={`__nav ${isMobile ? 'mobile' : ''} ${navExpand ? 'expand' : ''}`}>
        <div>
          <Logo onClick={onClick} className={`${isMobile ? 'mobile' : ''}`}>
            <img src={NavLogo} alt="" />
          </Logo>
          <Nav className={`${isMobile ? 'mobile' : ''}`}>
            {(isMobile ? NavMobileList : NavList).map(({ key, name, path, splitLine, mobileSplitLine, id }, index) => (
              <div key={name} className={`menu ${key} ${(isMobile ? mobileSplitLine : splitLine) ? 'split-line' : ''}`}>
                <div
                  style={{ cursor: initing ? 'wait' : 'pointer' }}
                  className={pathname.includes(path) ? "on li" : "li"}
                  onClick={toPath(path)}
                  id={id || ''}
                >
                  { key !== 'compose' ? <span className="icons"><Svgs type={key} selected={pathname.includes(path)} /></span> : null}
                  <span className="name">{name}</span>
                  <span className={unReadList[name] ? "unread show" : "unread"}>
                    {unReadList[name] > 99 ? `99+` : unReadList[name]}
                  </span>
                </div>
              </div>
            ))}
          </Nav>
        </div>
        <UseLimit>
          <Invite>
            <span>Plans: <strong>{ levelNameMap[bindedNftVolume.level] || '--' }</strong></span>
            <a onClick={toPoints}>Free Upgrade</a>
          </Invite>
          <div className="use-volume" title={`${usedVolume.volume}${usedVolume.volumeUnit} used`}>
            <i style={{ width: `${bindedNftVolume.usedVolumePercent || 0}%` }} className={bindedNftVolume.usedVolumePercent > 100 ? 'excceed' : ''}></i>
          </div>
          <FlexBetweenWrapper className="use-info">
            <div>
              Daily limit: <strong className={usedVolume.page > bindedNftVolume.totalPage ? "excceed" : ""}>{usedVolume.page}</strong>/{bindedNftVolume.totalPage || '-'}
            </div>
            <div>
              <strong className={usedVolume.bVolume > bindedNftVolume.bTotalVolume ? "excceed" : ""}>{usedVolume.volume}{usedVolume.volumeUnit}</strong>/{bindedNftVolume.totalVolume || '-'}{bindedNftVolume.totalVolumeUnit || ''}
            </div>
          </FlexBetweenWrapper>
        </UseLimit>
      </Root>
    </>
  );
};

export default withRouter(inject("store")(observer(NavChunk)));
