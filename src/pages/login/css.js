import styled, { keyframes } from "styled-components";
import {
  flexAlign,
  flexBetween,
  FlexWrapper,
  FlexAlignWrapper,
  FlexBetweenWrapper,
  FlexJustBetweenWrapper,
  flexJustBetween,
  flexAlignCenter,
} from "../../components/css.common";

import L1 from "../../static/images/login-l1.png";
import L2 from "../../static/images/login-l2.png";
import L3 from "../../static/images/login-l3.png";
import L4 from "../../static/images/login-l4.png";

export {
  FlexWrapper,
  FlexAlignWrapper,
  FlexBetweenWrapper,
  FlexJustBetweenWrapper,

  L1,
  L2,
  L3,
  L4,
};

export const Root = styled.div`
  background: #fff center;
  background-size: cover;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export const Wrapper = styled.div`
  ${flexBetween}
  flex-direction: column;
  height: 100vh;
  padding: 10vh 14vw 6vh;
  box-sizing: border-box;

  .top {
    width: 100%;
  }

  .logo {
    img {
      width: 160px;
    }
  }

  .bottom {
    text-align: center;

    p {
      margin-top: 16px;
      color: #999;
    }
  }

  .help {
    a {
      color: #333;
      font-size: 14px;
      line-height: 16px;
      border-bottom: 1px solid #333;

      &:hover {
        border-color: #FF563F;
        color: #FF563F;
      }
    }
  }

  .login {
    width: 540px;
    box-sizing: border-box;
    padding: 35px 45px;
    background: #FFFFFF;
    box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.1);
    border-radius: 20px;
    
    .name {
      font-size: 16px;
    }
  }

  .title {
    line-height: 35px;
  }

  .network {
    ${flexAlign};

    p {
      margin-right: 28px;
    }

    span {
      ${flexAlignCenter};
      width: 30px;
      height: 30px;
      box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.15);
      border-radius: 50%;
      position: relative;
      margin-left: -11px;
      background-color: #fff;

      svg {
        display: block;
      }
    }
  }

  .chunks {
    display: flex;
    margin-top: 20px;
  }

  .chains {
    padding-right: 30px;
    border-right: 1px solid #eee;
    margin-right: 30px;
    height: 230px;
    overflow-y: auto;
    overflow-x: hidden;

    &.chains-scroll {
      .item {
        &:not(:first-child) {
          margin-top: 20px;
        }
      }
    }

    .item {
      ${flexAlign};
      flex-direction: column;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: 10px;
      font-size: 12px;
      cursor: pointer;
      color: #666666;

      &:not(:first-child) {
        margin-top: 28px;
      }

      &.on {
        background: #C8E3FD;
        color: #2169D8;
      }

      &:not(.on):hover {
        background-color: #EFF0EF;
      }

      &.ethMain {
        svg {
          margin-bottom: 2px;
        }
      }

      &.difinity {
        svg {
          margin-top: -5px;
        }

        span {
          margin-top: -3px;
        }
      }

      &.worldcoin {
        svg {
          margin-bottom: 3px;
        }

        span {
          transform: scale(0.6);
        }
      }

      &.solana {
        svg {
          margin-bottom: 4px;
        }
      }

      &.sei {
        svg {
          margin-bottom: 3px;
        }
      }

      &.manta {
        svg {
          margin-bottom: 3px;
        }
      }

      span {
        transform: scale(0.8);
        height: 10px;
        user-select: none;
      }
    }
  }

  .wallets {
    flex: 1;
    display: none;
    height: 230px;
    position: relative;

    &::before, &::after {
      content: '';
      height: 50px;
      position: absolute;
      left: 0;
      right: 0;
      z-index: 10;
      pointer-events: none;
      opacity: 0;
      transition: opacity 1s ease-in-out 0s;
    }

    &.s-top, &.s-center {
      &::after {
        background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.90) 80%);
        bottom: 0;
        opacity: 1;
      }
    }

    &.s-bottom, &.s-center {
      &::before {
        background: linear-gradient(180deg, rgba(255,255,255,.90) 0%, rgba(255,255,255,0) 80%);
        top: 0;
        opacity: 1;
      }
    }

    &.show {
      display: block;
    }

    ul {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 20px;
      margin-right: -20px;
    }

    .item {
      ${flexBetween};
      width: 332px;
      height: 46px;
      padding: 0 35px;
      border-radius: 10px;
      font-size: 16px;
      color: #666666;
      position: relative;
      border: 1px solid #EEEEEE;
      box-sizing: border-box;
      user-select: none;
      cursor: pointer;

      &:hover, &.on {
        background: #EEEEEE;
      }

      &:not(:last-child) {
        margin-bottom: 25px;
      }

      .loading {
        ${flexAlignCenter};
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: rgba(255, 255, 255, .5);
        border-radius: 10px;
      }

      p {
        ${flexAlign};
        justify-content: center;
        width: 32px;
        height: 32px;
        box-sizing: border-box;
        border-radius: 100%;
        overflow: hidden;
      }

      .metamask, .trust, .kucoin {
        overflow: inherit;
      }
      .ok {
        border-radius: 10px;
      }
      .wallet {
        background: #3A99FC;
      }
      .plug {
        background: #18181C;
      }
      .ii {
        background: #fff;
      }
      .keplr {
        border-radius: 0;
      }
    }
  }

  .world-coin {
    ${flexAlign};
    flex-direction: column;
    justify-content: center;
    height: 100%;

    svg {
      width: 40px;
      height: 40px;
    }

    p {
      margin: 20px 0 30px;
      font-weight: bold;
      color: #333333;
    }

    a {
      width: 200px;
      height: 34px;
      background: #3C3C3C;
      color: #fff;
    }
  }
`

export const Content = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  margin-top: -60px;

  color: #333333;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;

  &.mobile {
    margin-top: -9vh;

    .login {
      margin-top: 35px;
      padding: 60px;
      width: 400px;
      max-width: calc(100vw - 40px);
      box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.1);
      border-radius: 10px;
    }

    .logo {
      img {
        max-width: 238px;
        min-width: 125px;
        width: 35vw;
      }

      p {
        margin-top: 10px;
        font-size: 14px;
        font-weight: normal;
      }
    }

    .login-btn-wallet {
      & > svg {
        width: 30px;
      }
    }

    .help {
      margin-top: 20px;
      font-weight: normal;
    }

    .main-btn {
      &:last-child {
        margin-bottom: 0;
      }
    }

    .login-btn {
      width: auto;
      max-width: 240px;
    }
  }

  .logo {
    text-align: center;

    img {
      width: 238px;
    }

    p {
      margin-top: 15px;
    }
  }

  .login {
    margin-top: 50px;
    padding: 40px 64px;
    width: 540px;
    box-sizing: border-box;
    background: #FFFFFF;
    border-radius: 20px;
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.2);
  }

  .split-line {
    ${flexAlign};
    height: 1px;
    margin-top: 48px;
    margin-bottom: 28px;

    &:before,
    &:after {
      flex: 1;
      content: "";
      height: 1px;
      background: #eee;
    }

    span {
      position: relative;
      top: -1px;
      width: 78px;
      line-height: 20px;
      // font-size: 16px;
      // font-weight: 600;
      text-align: center;
    }
  }

  .btns {
    a {
      position: relative;
      overflow: hidden;

      .loading {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        ${flexAlign};
        justify-content: center;
        background: rgba(0, 0, 0, 0.5);

        .MuiCircularProgress-svg {
          color: #fff;
        }
      }
    }
  }

  .main-btn {
    margin-bottom: 20px;

    .login-btn-main {
      & > svg {
        margin-right: 15px;
      }
    }
  }

  .login-btn-main {
    padding: 0;
    justify-content: center;

    .metamask {
      margin-right: 8px;
      transform: translateX(-9px);
    }
  }

  .other-btns {
    ${flexAlign};
    justify-content: center;
    flex-wrap: wrap;
    padding: 0 50px;

    a {
      ${flexAlign};
      justify-content: center;
      width: 38px;
      height: 38px;
      padding: 0;
      margin: 0 33px 17px 0;
      line-height: 38px;
      background: #FFFFFF;
      box-shadow: 0 0 10px 3px rgb(0, 0, 0, .1);
      cursor: pointer;
      border-radius: 8px;
      transition: background 0.5s ease;
      overflow: visible;
      position: relative;
      z-index: 10;

      &:nth-child(n+5) {
        z-index: 9;
      }

      &:nth-child(4), &:last-child {
        margin-right: 0;
      }

      &:nth-child(n+5) {
        margin-bottom: 0;
      }

      &:hover {
        background: #F5F5F5;
      }
    }

    i {
      margin: 0;
      border-radius: 50%;
    }

    .bnb {
      width: 21px;
      height: 24.5px;
      border-radius: 0;
      background-size: 100%;
    }
  }

  .help {
    position: absolute;
    left: 50%;
    top: 100%;
    margin-top: 40px;
    transform: translateX(-50%);

    a {
      color: #FF563F;
      font-size: 14px;
      line-height: 16px;
      padding-bottom: 3px;
      border-bottom: 1px solid #FF563F;

      &:hover {
        border-color: #333;
        color: #333;
      }
    }
  }
`;

export const Links = styled.div`
  ${flexAlign};
  justify-content: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 40px;

  &.pos-static {
    position: static;
  }

  a {
    width: 32px;
    height: 32px;
    margin-right: 30px;
    background: url(${L1}) no-repeat;
    background-size: 100%;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.15);
    }

    &:last-child {
      margin-right: 0;
    }
  }

  .telegram {
    background-image: url(${L2});
  }
  .m {
    background-image: url(${L3});
  }
  .discord {
    background-image: url(${L4});
  }
`
