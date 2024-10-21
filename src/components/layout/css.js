import styled, { keyframes } from "styled-components";
import {
  LoginLogo,
  flex,
  flexAlign,
  flexBetween,
  flexAlignCenter,
  FlexWrapper,
  FlexAlignWrapper,
  FlexBetweenWrapper,
  FlexJustBetweenWrapper,
} from "../css.common";

import { L1, L2, L3, L4, } from '@/pages/login/css'
import SearchBar from "../../static/images/search.png";
import Quit from "../../static/images/quit.png";

export {
  LoginLogo,
  FlexWrapper,
  FlexAlignWrapper,
  FlexBetweenWrapper,
  FlexJustBetweenWrapper,
};

export const Logo = styled.div`
  width: 119px;
  margin: 0 auto;
  cursor: pointer;

  &.mobile {
    width: 100px;
    margin: 0 0 0 50px;
  }

  img {
    width: 100%;
    display: block;
  }
`;

export const Nav = styled.div`
  margin-top: 35px;
  padding: 0 10px;
  font-family: Arial-Bold, Arial;
  font-size: 15px;

  &.mobile {
    margin-top: 25px;
    padding: 0 20px;
    font-size: 16px;

    .split-line {
      &::after {
        margin: 15px 0;
      }
    }

    .menu {
      margin-bottom: 8px;
    }

    .menu:not(.compose) .li {
      .icons {
        margin-right: 12px;
        display: inline-block;
      }
    }
  }

  .split-line {
    margin-bottom: 0;
    
    &::after {
      content: '';
      height: 1px;
      margin: 15px 32px;
      display: block;
      background-color: #464646;
      font-size: 0;
      line-height: 0;
    }
  }

  .menu {
    margin-bottom: 3px;
  }

  .compose {
    margin-bottom: 26px;

    .li {
      width: 180px;
      height: 35px;
      line-height: 35px;
      margin: 0 auto;
      background: #FFFFFF;
      border-radius: 35px;
      font-weight: bold;
      color: #333;
      text-align: center;

      &:hover {
        box-shadow: 0px 2px 18px 0px rgba(255,255,255,0.7);
      }
    }
  }

  .menu:not(.compose) .li {
    ${flexAlign}
    height: 32px;
    padding-left: 30px;
    color: #fff;
    cursor: pointer;
    border-radius: 5px;
    position: relative;

    &.on,
    &:hover {
      background: rgba(255,255,255,0.1);
    }

    &.on {
      font-weight: bold;
      background: rgba(255,255,255,0.2);
    }

    .icons {
      display: flex;
      width: 18px;
      margin-right: 15px;

      svg {
        position: relative;
        left: 50%;
        transform: translateX(-50%) scale(1.15);
      }
    }

    .unread {
      display: none;
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      padding: 0 8px;
      background: #BD2B15;
      border-radius: 10px;
      line-height: 16px;
      font-size: 12px;
      font-family: Arial-Regular, Arial;
      font-weight: bold;
    }

    .show {
      display: block;
    }
  }
`;

export const TopActions = styled.div`
  ${flexAlign};
  color: #666666;

  .group {
    ${flexAlign};

    &:not(:last-child) {
      padding-right: 25px;
      border-right: 1px solid #EEEEEE;
      margin-right: 15px;
    }

    & > .item {
      ${flexAlign};
      margin-left: 10px;
      padding: 0 15px;
      height: 45px;
      border-radius: 10px;
      text-align: center;
      font-size: 15px;
      cursor: pointer;

      &.mobile {
        height: 35px;
        border-radius: 8px;
        font-size: 14px;
      }

      &.item-user {
        margin-left: 25px;
        padding: 0 20px;
      }
    }
  }

  .btn {
    transition: background .2s linear;

    &:hover {
      background: #e6e6e6;
    }

    span {
      margin-left: 8px;
      font-weight: 500;
    }
  }
`

export const UserInfo = styled.div`
  position: relative;
  z-index: 100;

  &.mobile {
    .user-pop {
      min-width: 265px;
      padding: 15px;
      box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.2);

      &.show {
        display: block!important;
      }
    }

    &:hover {
      .user-pop {
        display: none;
      }
    }

    .logout-btn {
      font-size: 15px;
    }

    .item {
      .label {
        font-size: 14px;
      }

      .value {
        .text {
          max-width: 180px;
        }

        .quick-title {
          margin-left: 6px;
        }
      }
    }

    .logo {
      p {
        font-size: 16px;
      }
    }
  }

  &.item {
    border: 1px solid #111111;
    box-sizing: border-box;
    padding: 0 32px;
    color: #333333;
  }
  
  &:hover {
    .user-pop {
      display: block;
    }
  }

  div.address {
    font-size: 14px;
    font-weight: normal;
  }

  .user-pop {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 12px;
    min-width: 315px;
    padding: 20px;
    background: #fff;
    font-size: 14px;
    box-shadow: 0px 0px 20px 3px rgba(0,0,0,0.25);
    border-radius: 10px;
    box-sizing: border-box;
    text-align: left;
    cursor: default;

    &:before {
      content: "";
      height: 15px;
      position: absolute;
      left: 0;
      right: 0;
      top: -15px;
    }

    &::after {
      content: '';
      width: 0;
      height: 0;
      border-width: 8px;
      border-style: dashed dashed solid dashed;
      border-color: transparent transparent #fff transparent;
      position: absolute;
      right: 50px;
      bottom: 100%;
    }
  }

  .line {
    height: 1px;
    background: #eee;
    line-height: 0;
    overflow: hidden;
  }

  .item {
    ${flexAlign}
    margin: 15px 0;
    position: relative;
    z-index: 0;

    &:first-child {
      z-index: 10;
    }
    &:nth-child(2) {
      z-index: 9;
    }
    &:nth-child(3) {
      z-index: 8;
    }
    &:nth-child(4) {
      z-index: 7;
    }
    &:nth-child(5) {
      z-index: 6;
    }
    &:nth-child(6) {
      z-index: 5;
    }

    & > p {
      /* margin-bottom: 2px; */

      span {
        ${flexAlign};
      }
    }

    .link {
      &:hover {
        color: #333333;
      }
    }

    .label {
      white-space: nowrap;
      font-size: 12px;
      color: #999;
    }

    .value {
      ${flexAlign};
      white-space: nowrap;
      margin-left: 5px;

      span, svg {
        cursor: pointer;
      }

      .text {
        display: inline-block;
        white-space: nowrap;
        max-width: 240px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .quick-title {
        margin-left: 10px;
      }
      svg {
        color: #FF563F;
      }
    }

    strong {
      font-weight: normal;
      color: #55CADB;
      text-decoration: underline;
      cursor: pointer;

      &:hover {
        color: #FF563F;
      }
    }

    a {
      ${flexAlign};
      color: #999;
      cursor: pointer;

      span {
        margin-left: 5px;
      }
    }
  }

  .logo {
    display: flex;
    margin-top: 0;

    & > div {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      /* padding-top: 4px; */
    }

    img {
      display: block;
      margin-right: 10px;
    }

    p {
      ${flexAlign};
      margin-bottom: 8px;
      font-weight: bold;
      font-size: 16px;
      line-height: 18px;
      color: #333333;

      svg {
        width: 16px;
        height: 16px;
      }

      span {
        margin-right: 6px;
      }
    }

    .address {
      font-size: 12px;
      color: #999;
    }
  }

  .logout {
    ${flexAlign};
    flex-direction: column;
    margin-top: 15px;
  }

  .logout-btn {
    width: 180px;
    line-height: 35px;
    border-radius: 35px;
    background: #F5F5F5;
    color: #333333;
    font-size: 14px;
    text-align: center;
    cursor: pointer;

    &:hover {
      transition: background .2s linear;
      background: #e6e6e6;
    }
  }

  .version {
    margin-top: 10px;
    font-size: 12px;
    color: #999;
  }
`;

export const Info = styled.div`
  padding-left: 5px;
  line-height: 24px;
  font-size: 16px;
  color: #38302e;

  p {
    margin-bottom: 3px;

    &:last-child {
      margin-bottom: 0;
    }

    .pid {
      cursor: pointer;
    }
  }

  .can-copy {
    height: 24px;
    cursor: pointer;
  }

  .nft-getting {
    vertical-align: middle;
    margin-right: 3px;

    .MuiCircularProgress-root {
      color: #38302e;
    }
  }

  .binding {
    display: inline-block;
    margin-left: 10px;
    padding: 0 15px;
    background: #FF563F;
    border-radius: 5px;
    color: #fff;
    font-size: 16px;

    line-height: 30px;
  }
  .binding:hover {
    cursor: pointer;
  }

  strong {
    margin-right: 10px;
  }
`;

export const User = styled.div`
  ${flexAlign}

  .ava img {
    display: block;
    width: 45px;
    height: 45px;
    margin-right: 18px;
    border-radius: 10px;
    background-color: #f4f4f4;
  }

  .logout {
    ${flexAlign}
    font-size: 16px;
    color: rgba(0, 0, 0, 0.5);

    i {
      width: 16px;
      height: 16px;
      font-size: 16px;
      //background-image: url(${Quit});
      background-size: 100%;
      margin-right: 3px;
    }
  }
  .logout:hover {
    cursor: pointer;
    color: #FF563F;
    i {
      color: #FF563F;
    }
  }
`;

export const SearchChunk = styled.div`
  ${flexAlign}
`;

export const Search = styled.div`
  ${flexAlign}
  height: 45px;
  background: #F6F6F6;
  border-radius: 10px;
  padding: 0 15px;

  &.mobile {
    height: 40px;
  }

  svg {
    margin-right: 12px;
  }

  input {
    flex: 1;
    line-height: 20px;
    border: none;
    background: transparent;
    font-size: 14px;
    min-width: 0;
    color: #333;

    &::placeholder {
      color: #999;
    }
  }

  .clear {
    ${flexAlign};
    justify-content: center;
    width: 17px;
    height: 17px;
    background: #F0F0F0;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      background: #e6e6e6;
    }

    svg {
      margin: 0;
    }
  }
`;

export const Redirect = styled.div`
  ${flexAlign}
  margin-left: 68px;
  color: #b4b0af;
  font-size: 20px;
  font-weight: 600;
  position: relative;

  strong {
    color: #38302e;
  }

  .to {
    ${flexAlign}
    color: #B4B0AF;
    cursor: pointer;

    span {
      margin: 0 8px;
    }
  }

  @media (max-width: 1800px) {
    margin-left: 45px;
    font-size: 16px;
  }
`;

export const GoPage = styled.div`
  ${flexAlign}
  position: absolute;
  right: 0;
  top: 100%;
  padding: 0 16px;
  height: 60px;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  box-shadow: 0px 6px 8px 1px rgba(183, 173, 171, 0.45);
  color: #7c7370;
  font-size: 20px;
  display: none;

  &.on {
    display: flex;
  }

  span {
    white-space: nowrap;
  }

  input {
    width: 60px;
    height: 30px;
    margin: 0 10px;
    padding: 0 10px;
    border: 1px solid #bfb7b6;
    color: #7c7370;
    font-size: 16px;

    &::-webkit-inner-spin-button {
      display: none !important;
    }
  }

  a {
    color: #463f3d;
    cursor: pointer;
  }
`;

export const UseLimit = styled.div`
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
  color: #fff;
  font-size: 12px;

  .use-info {
    color: #bbb;

    strong {
      color: #FF563F;

      &.excceed {
        color: #B00000;
      }
    }
  }

  .use-volume {
    height: 5px;
    background: #595959;
    margin: 10px 0;
    border-radius: 5px;
    overflow: hidden;
    font-size: 0;

    i {
      height: 100%;
      display: block;
      background: #FF563F;
    }
    .excceed {
      background: #B00000;
    }
  }
`;

export const Invite = styled.div`
  ${flexBetween};
  font-size: 12px;
  color: #fff;

  strong {
    color: #FF563F;
  }

  a {
    padding-bottom: 1px;
    border-bottom: 1px solid rgba(255, 255, 255, .8);
    color: #fff;
    cursor: pointer;
    transition: all .3s ease 0s;

    &:hover {
      color: #FF563F;
      border-bottom-color: #FF563F;
    }
  }
`

export const Links = styled.div`
  ${flexAlign};
  justify-content: center;
  margin-top: 15px;

  a {
    width: 24px;
    height: 24px;
    margin-right: 24px;
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
