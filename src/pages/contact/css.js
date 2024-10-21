import styled, { keyframes } from "styled-components";
import {
  flex,
  flexAlign,
  flexBetween,
  flexJustBetween,
  FlexWrapper,
  FlexAlignWrapper,
  FlexBetweenWrapper,
  FlexJustBetweenWrapper,
  flexAlignCenter,
} from "../../components/css.common";

import { web23Tag } from '@/components/emails/css'

export {
  FlexWrapper,
  FlexAlignWrapper,
  FlexBetweenWrapper,
  FlexJustBetweenWrapper,
};

export const Root = styled.div`
  flex: 1;
  overflow: hidden;
  padding-top: 30px;

  .side {
    ${flex};
    flex-direction: column;
    min-width: 260px;
    max-width: 360px;
    padding: 20px 0;
    border-right: 1px solid #eee;
    overflow: hidden;
  }

  .search {
    flex-shrink: 0;
    margin: 0 20px;
  }

  .users {
    flex: 1;
    overflow-y: auto;
    padding: 0 20px;

    & > .flex1 {
      display: flex;
      justify-content: center;
      height: 100%;
    }
  }

  .content {
    flex: 1;
  }
`;

export const DmailRoot = styled.div`
  ${flex};
  height: 100%;

  &.mobile {
    .side {
      width: 100%;
      border: none;
      overflow-x: hidden;

      .search {
        margin-bottom: 7px;
      }

      .users {
        margin-top: 0;
        padding-top: 8px;
      }

      .edit {
        margin-left: 20px;
        color: #666;

        svg {
          display: block;
        }
      }

      li {
        padding: 15px;
        margin-bottom: 15px;
        box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.1);
        border-radius: 8px;

        &.on {
          background-color: transparent;
        }

        img, .avatar {
          width: 40px;
          height: 40px;
          line-height: 40px;
          font-size: 20px;
        }

        .info {
          p {
            &:first-child {
              margin-bottom: 5px;
            }
            &:nth-child(2) {
              font-size: 14px;
            }
          }
        }

        .email {
          font-size: 16px;
        }
      }
    }

    .input {
      padding: 0 12px;
    }

    .item-remark .input {
      padding: 10px 12px;
    }

    .small_ {
      font-size: 13px!important;
    }
  }

  .base-btn {
    background-color: #111;
    color: #fff;
    transition: box-shadow 0.5s ease;

    &:hover {
      box-shadow: 0px 1px 9px 0px rgba(0,0,0,0.7);
    }
  }

  .del {
    ${flexAlign};
    color: #B00000;
    font-size: 16px;
    cursor: pointer;

    svg {
      width: 14px;
      height: 14px;
      margin-right: 5px;
    }
  }

  .avatar {
    ${flexAlignCenter}
    text-align: center;
    background: #E8E8E8;
    font-weight: bold;
    color: #999;
  }

  .content {
    padding: 20px;
  }

  .detail {
    padding: 20px;
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.15);
    border-radius: 10px;
  }

  .ava-alias {
    ${flexBetween}

    img, .avatar {
      display: block;
      width: 80px;
      height: 80px;
      line-height: 80px;
      border-radius: 10px;
      margin-right: 28px;
      font-size: 40px;
    }

    strong {
      font-size: 20px;
    }

    .small {
      font-size: 15px;
      margin-left: -10px;
    }
  }

  .list {
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid #eee;

    li {
      &:not(:last-child) {
        margin-bottom: 20px;
      }

      span {
        display: inline-block;
        width: 42px;
      }
    }
  }

  .form-item {
    margin-top: 20px;
  }

  .input {
    ${flexAlign}
    margin-top: 10px;
    height: 40px;
    padding: 0 20px;
    background: #F6F6F6;
    border-radius: 10px;
    position: relative;

    input, textarea {
      flex: 1;
      font-size: 14px;
      background-color: transparent;
      border: none;
    }

    input {
      height: 100%;
    }

    .count {
      margin-left: 15px;
      color: #999;
    }
  }

  .item-remark {
    .input {
      height: auto;
      padding: 10px 20px;
      line-height: 20px;
    }

    textarea {
      height: 60px;
      outline: none;
      resize: none;
    }

    .count {
      position: absolute;
      right: 20px;
      bottom: 10px;
    }
  }
  
`

export const CcRoot = styled.div`
  ${flex};
  height: 100%;
`