import styled, { keyframes } from "styled-components";
import {
  Tabs,
  flex,
  LoginLogo,
  flexAlign,
  flexBetween,
  flexJustBetween,
  FlexWrapper,
  FlexAlignWrapper,
  FlexBetweenWrapper,
  FlexJustBetweenWrapper,
} from "../../components/css.common";

import Yes from "../../static/images/yeah.png";
import No from "../../static/images/noop.png";
import Empty from "../../static/images/empty2.png";
// import Selected from "@/static/images/inbox/selected.png";

export {
  Tabs,
  LoginLogo,
  FlexWrapper,
  FlexAlignWrapper,
  FlexBetweenWrapper,
  FlexJustBetweenWrapper,
};

export const Root = styled.div`
  margin-top: 20px;
`;

export const Content = styled.div`
  &.mobile {
    font-size: 14px;

    .name {
      span {
        font-size: 14px;
      }
    }

    .content {
      margin-top: 10px;
      margin-bottom: 20px;
      box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.1);
      font-size: 14px;
    }

    .address p {
      margin-bottom: 12px;
    }

    .login {
      .login-type {
        strong {
          font-size: 14px;
        }

        p {
          margin-top: 5px;

          .quick-title {

          }
        }

        & > i, & > svg, & > img {
          margin-right: 10px;
        }

        & > svg {
          width: 40px;
          height: 40px;
        }
      }
    }

    .usage {
      li {
        justify-content: space-between;
        font-size: 14px;
        line-height: 1;

        .label {
          width: auto;
        }
      }

      .more {
        a {
          margin-left: 10px;
        }
      }
    }

    .nfts {
      .name {
        margin-bottom: 10px;
      }
    }
  }

  .name {
    ${flexAlign};
    color: #999;
    font-size: 12px;
    
    span {
      margin-right: 10px;
      color: #333333;
      font-size: 16px;
    }
  }

  .content {
    margin-top: 20px;
    margin-bottom: 30px;
    padding: 15px;
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.15);
    border-radius: 10px;
  }

  .usage {
    color: #333333;
    
    .content {
      padding: 20px 15px;
      margin-bottom: 0;
    }

    h3 {
      font-size: 24px;
      font-weight: bold;
      color: #333333;
    }

    li {
      ${flexAlign};
      margin-top: 20px;
      font-size: 14px;
      line-height: 16px;

      .label {
        width: 35%;
      }

      .icon-enable {
        width: 12px;
        height: 8px;
        background: url(${Yes});
        background-size: 100%;
        display: inline-block;

        &.unsupport {
          width: 10px;
          height: 9px;
          background-image: url(${No});
        }
      }

      .gray {
        color: #999;
      }

      .ride {
        font-size: 16px;
        transform: rotate(45deg);
        display: inline-block;
        margin-right: 1px;
        vertical-align: middle;
      }
    }

    .more {
      margin-top: 18px;
      padding-left: 15px;

      a {
        margin-left: 20px;
        color: #55CADB;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }

  .address {
    p {
      ${flexAlign};
      margin-bottom: 15px;
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

      &:last-child {
        margin-bottom: 0;
      }

      span {
        ${flexAlign};
        margin-left: 8px;
        cursor: pointer;
      }

      svg {
        color: #FF563F;
      }

      .nft-getting {
        svg {
          margin-left: 0;
        }
      }

      .none {
        color: #999;
        cursor: default;

        a {
          margin: 10px;
          color: #55CADB;
          text-decoration: underline;
          cursor: pointer;

          svg {
            color: #55CADB;
            margin-left: 3px;
            position: relative;
            top: 1px;
          }
        }
      }
    }
  }

  .login {
    .login-type {
      ${flexAlign};

      strong {
        font-size: 16px;
      }

      p {
        ${flexAlign};
        margin-top: 8px;
        cursor: pointer;

        .quick-title {
          margin-left: 8px;
        }

        svg {
          color: #FF563F;
          vertical-align: middle;
        }
      }

      & > i, & > svg, & > img {
        flex-shrink: 0;
        margin-right: 15px;
      }

      & > svg {
        width: 50px;
        height: 50px;
      }

      .logo-ok {
        border-radius: 10px;
      }
    }
  }

  .nfts {
    .name {
      margin-bottom: 20px;
    }

    th, td {
      &:last-child {
        width: 100px;
      }
    }

    .no-data-root {
      min-height: 300px!important;
    }

    @media (min-height: 850px) {
      .no-data-root {
        min-height: 400px!important;
      }
    }
  }
`;

export const DidRoot = styled.div`
  &.mobile {
    .name, .title {
      font-size: 14px;
    }

    .content {
      margin-top: 10px;
    }

    .did-switch {
      justify-content: space-between;
    }

    .first .content {
      padding: 10px 15px;
    }

    .first .content, .dids {
      box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.1);
    }

    .dids {
      padding: 15px;
    }
  }

  .chunk {
    margin-bottom: 20px;
  }
  
  .name {
    ${flexAlign};
    font-size: 16px;

    strong {
      font-weight: normal;
      margin-left: 10px;
    }

    span {
      font-size: 14px;
      color: #999;
      margin-left: 10px;
    }

    a {
      margin-left: 20px;
      color: #299DED;
      font-size: 12px;
      position: relative;
      top: 2px;
    }
  }

  .first .content, .dids {
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.15);
    border-radius: 10px;
    padding: 15px 20px;
  }

  .title {
    margin-bottom: 10px;
    font-size: 16px;
  }

  .dids {
    padding: 20px;

    .name {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      white-space: nowrap;

      svg {
        flex-shrink: 0;
      }
    }
  }

  .content {
    margin-top: 20px;
  }

  .list, .no-data {
    min-height: 40px;
  }

  .did-list {
    flex-wrap: wrap;

    & > div {
      flex: 0 0 25%;
      padding: 0 15px 15px 15px;
      box-sizing: border-box;

      & > div {
        width: auto;
        flex: 1;
      }
    }

    @media (min-width: 1660px) {
      & > div {
        flex: 0 0 20%;
      }
    }

    @media (max-width: 1200px) {
      & > div {
        flex: 0 0 33.33%;
      }
    }
  }

  .did-switch {
    font-size: 15px;

    strong {
      margin-right: 15px;
    }
  }
`

export const Upload = styled.div`
  position: relative;
  cursor: pointer;

  input {
    position: absolute;
    width: 100%;
    height: 32px;
    opacity: 0;
    cursor: pointer;
  }

  a {
    text-align: center;
    display: block;
  }
`;
