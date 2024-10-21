import styled, { keyframes } from "styled-components";

import Identity from "@/static/images/login-identity2.png";
import Plug from "@/static/images/login-plug2.png";
import Metamask from "@/static/images/login-metamask.png";
import Infinityswap from "@/static/images/infinityswap-logo.png";
import Bnb from "@/static/images/bnb.png";
import Bitkeep from "@/static/images/login-bitkeep.svg";
import Kucoin from "@/static/images/kucoin.svg";
import Ok from "@/static/images/ok.jpeg";

export const flex = `display: flex;`;
export const flexAlign = `${flex}; align-items: center;`;
export const flexAlignCenter = `${flex}; align-items: center; justify-content: center;`;
export const flexAlignRight = `${flex}; align-items: center; justify-content: end;`;
export const flexBetween = `${flexAlign};justify-content: space-between;`;
export const flexJustBetween = `${flex}; justify-content: space-between;`;

export const FlexWrapper = styled.div`
  ${flex}
`;
export const FlexAlignWrapper = styled.div`
  ${flexAlign}
`;

export const FlexAlignRightWrapper = styled.div`
  ${flexAlignRight}
  align-items: flex-end;
`;

export const FlexBetweenWrapper = styled.div`
  ${flexBetween}
`;

export const FlexJustBetweenWrapper = styled.div`
  ${flexJustBetween}
`;

export const Title = styled.div`
  margin-bottom: 30px;
  line-height: 24px;
  font-size: 20px;
  font-weight: bold;
  color: #FF563F;
`;

export const Tabs = styled.div`
  ${flexAlign}
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;

  &.mobile {
    padding-bottom: 8px;

    .item {
      padding: 0 15px;

      &:first-child {
        margin-left: 15px;
      }

      &:after {
        transform: translateY(8px);
      }
    }
  }

  &.contacts {
    margin-top: 18px;
    padding-bottom: 5px;

    .item {
      padding: 0 15px;
      font-size: 14px;

      &:first-child {
        margin-left: 0;
      }

      &:after {
        transform: translateY(5px);
      }
    }
  }

  .item {
    margin-left: 20px;
    margin-right: 5px;
    padding: 0 18px;
    position: relative;
    cursor: pointer;
    font-size: 16px;
    color: #666;

    &:hover {
      color: #FF563F;
    }

    &:after {
      content: "";
      opacity: 0;
      position: absolute;
      left: 0;
      right: 0;
      top: 100%;
      transform: translateY(15px);
      height: 1px;
      background: #FF563F;
      transition: opacity 0.3s ease-out 0s;
    }
  }
  .on {
    color: #FF563F;

    &:after {
      opacity: 1;
    }
  }
`;

export const LoginLogo = styled.i`
  &.logo-icon {
    width: ${(props) => props.width || 30}px;
    height: ${(props) => props.height || 30}px;
    border-radius: 4px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  &.logo-plug {
    background-image: url(${Plug});
  }

  &.logo-ii {
    background-image: url(${Identity});
  }

  &.logo-infinity {
    background-image: url(${Infinityswap});
  }

  &.logo-metamask {
    background-image: url(${Metamask});
  }

  &.logo-binance {
    background-image: url(${Bnb});
  }

  &.logo-bitkeep {
    background-image: url(${Bitkeep});
  }

  &.logo-kucoin {
    background-position: 0 center;
    background-size: 100%;
    background-image: url(${Kucoin});
  }

  &.logo-ok {
    background-size: 100%;
    background-image: url(${Ok});
  }
`;
