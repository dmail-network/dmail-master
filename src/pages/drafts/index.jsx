import React, { useEffect, useState, useCallback, useRef } from "react";
import { observer, inject } from "mobx-react";
import { withRouter, useHistory } from "react-router-dom";
import { fromJS } from "immutable";

import { DraftsDb } from "@/utils/indexedDb";
import { loadNormalItems } from "./utils";
import { batchDeleteDraft, useQueryMenus } from "../inbox/fetch";
import { MenuTabs, getDelList, batchAction, useMenuChecked, useEmailsScroll } from '../inbox/utils'
import { Root, Left, Menus, SearchActions, List } from "../inbox/css";

import Pagination from "@/components/layout/pagination";
import Container from "@/components/layout/container";
import SearchBar from "@/components/layout/searchBar";
import EmailDraftItem from "@/components/emails/emailsDraft";
import ContentDraft from "@/components/emails/contentDraft";
import PageEmpty from "@/components/empty";
import { Spin } from "@/components/Loading";
import Svgs from "@/components/svgs/actions";

const Index = ({ store }) => {
  const { isMobile } = store.mobile;
  const { principalId } = store.common;
  const [currentEmailIndex, setCurrentEmailIndex] = useState(-1);
  const [detailLoading, setDetailLoading] = useState(false)
  const [showCheckboxs, setShowCheckboxs] = useState(false)

  const {
    toPage,
    offset,
    limit,
    menuList,
    menuListRef,
    setMenuList,
    loading: queryMenusLoading,
    allEmailsloaded,
    total,
    reQueryPage,
    error: queryMenusError,
    listRef,
  } = useQueryMenus(store, 'no-cache', loadNormalItems, "", 20, false)
  
  useEmailsScroll(store, listRef, isMobile, menuList)

  const batchDelete = async (params) => {
    const _params = fromJS(params).toJS()
    while (_params.length) {
      const { iid } = _params.pop()
      await DraftsDb.delete(principalId, iid)
    }
    return { Ok: true }
  }

  const onRealDelete = async (current, ev = null) => {
    setCurrentEmailIndex(-1);
    const success = await batchAction(menuListRef, setMenuList, current, true, async (params) => await batchDelete(params), getDelList, ev)
    if (success && !menuListRef.current.length) {
      reQueryPage(-1)
    }
  };

  const {
    collected,
    _setCollected,
    allChecked,
    anyChecked,
    anyUnRead,
    onCheckbox,
    unCheckedAll,
  } = useMenuChecked(menuList, menuListRef, setMenuList, setCurrentEmailIndex, principalId)

  const queryDetailById = async (index, item, ev) => {
    ev && ev.preventDefault && ev.preventDefault();
    if (item.loading) {
      return
    }
    setCurrentEmailIndex(index);
    unCheckedAll()
  };

  const onAllChecked = (ev) => {
    if (!allEmailsloaded) {
      return
    }
    setShowCheckboxs(true)
    onCheckbox("multi", !allChecked)(ev)
  }

  return (
    <Container className={`${isMobile ? 'mobile' : ''}`}>
      <SearchBar>
        <SearchActions className={`${isMobile ? 'mobile' : ''}`}>
          <div className="checkbox quick-title" data-title={allChecked ? "Deselect" : "Select"} onClick={ onAllChecked }>
            <Svgs type={allChecked ? "selected" : "checkbox"} />
          </div>
          {!anyChecked ? (
            <div className="chunk">
              <div data-title="refresh" className={`icons-actions icon-refresh quick-title`} onClick={reQueryPage}>
                <Svgs type="refresh" />
              </div>
            </div>
          ) : (
            <div className="chunk __checkedShow">
              <div
                data-title="delete"
                className={`icons-actions quick-title icon-delete`}
                onClick={() => anyChecked && onRealDelete("multi")}
              >
                <Svgs type="delete" />
              </div>
            </div>
          )}
        </SearchActions>
        <Pagination disablePage={!allEmailsloaded} loading={queryMenusLoading} limit={limit} total={total} offset={offset} toPage={toPage} />
      </SearchBar>
      { !menuList.length ? (
        <Spin loading={ queryMenusLoading } className="flex1"><PageEmpty /></Spin>
      ) : (
        <Root>
          <Left className={`${isMobile ? 'mobile __checkedShow' : ''}`}>
            <List ref={listRef}>
              <Spin loading={ queryMenusLoading }>
                <ul>
                  { menuList.map((item, index) => {
                    return (
                      <EmailDraftItem
                        key={ index }
                        index={ index }
                        data={ item }
                        selected={currentEmailIndex === index}
                        detailLoading={detailLoading}
                        showCheckboxs={ showCheckboxs }
                        setShowCheckboxs = { setShowCheckboxs }
                        viewDetail={ queryDetailById }
                        onCheckbox={ onCheckbox }
                      />
                    );
                  }) }
                </ul>
              </Spin>
            </List>
          </Left>
          {isMobile ? null : <ContentDraft total={total} />}
        </Root>
      ) }
      
    </Container>
  );
};

export default withRouter(inject("store")(observer(Index)));
