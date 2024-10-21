import React, { useEffect, useState, useCallback, useRef } from "react";
import { withRouter, useHistory, useParams } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { CacheKeys } from '@/stores/pages/email.store.js'
import { useQueryMenus, loadNormalItems, setFavorites, setRead, batchDelete, batchSpam, } from "./fetch";
import { MenuTabs, getDelList, getUpdateList, batchAction, setItemReaded, useMenuChecked, useInit, useEmailsScroll } from './utils'
import { Root, Left, Menus, SearchActions, List } from "./css";

import Message from "@/components/Message/index";
import Pagination from "@/components/layout/pagination";
import Container from "@/components/layout/container";
import SearchBar from "@/components/layout/searchBar";
import Tools from "@/components/layout/mobile.tools";
import EmailItem from "@/components/emails/emails";
import Content from "@/components/emails/content";
import PageEmpty from "@/components/empty";
import { Spin } from "@/components/Loading";
import Svgs from "@/components/svgs/actions";
import SvgsCompose from "@/components/svgs/compose";

const Index = ({ store }) => {
  const { isMobile } = store.mobile;
  const { tokenGetted, principalId, stopKeyDownSwitchEmail } = store.common;
  const history = useHistory();
  const [currentEmailIndex, setCurrentEmailIndex] = useState(-1);
  const [detailLoading, setDetailLoading] = useState(false)
  const [showCheckboxs, setShowCheckboxs] = useState(false)
  // const { Params, token } = useParams;

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
  } = useQueryMenus(store, CacheKeys.inbox, loadNormalItems, "")

  useEmailsScroll(store, listRef, isMobile, menuList)

  useEffect(() => {
    principalId && tokenGetted && reQueryPage(true)
  }, [principalId, tokenGetted])

  const setDataNull = async () => {
    if (!isMobile) {
      setCurrentEmailIndex(-1);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setCurrentEmailIndex(-1);
    }
  }
  const onDelete = async (current, ev = null) => {
    await setDataNull()
    const success = await batchAction(menuListRef, setMenuList, current, false, async (params) => await batchDelete(params, principalId), getDelList, ev)
    if (success && !menuListRef.current.length) {
      reQueryPage(-1)
    }
    if (success) {
      store.common.setClearCacheKeys([CacheKeys.trash])
    }
  };

  const onSpam = async (current, ev = null) => {
    await setDataNull()
    const success = await batchAction(menuListRef, setMenuList, current, false, async (params) => await batchSpam(params, principalId), getDelList, ev)
    if (success && !menuListRef.current.length) {
      reQueryPage(-1)
    }
    if (success) {
      store.common.setClearCacheKeys([CacheKeys.spam])
    }
  };

  const setReadOrUnread = async (value, current = null, ev = null) => {
    if (current && value && current.other?.is_read) {
      return false
    }
    const success = await batchAction(menuListRef, setMenuList, current, principalId, async (params) => await setRead(value, params, principalId), getUpdateList(value, 'read'), ev)
    if (success) {
      store.common.queryFrequentData(isMobile)
    }
    return success
  };

  const setCollected = async (value, current = null, ev = null) => {
    const success = await batchAction(menuListRef, setMenuList, current, principalId, async (params) => await setFavorites(value, params, principalId), getUpdateList(value, 'favorites'), ev)
    if (success) {
      _setCollected(value)
    }
    if (success) {
      store.common.setClearCacheKeys([CacheKeys.star])
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
    !isMobile && onCheckbox(item.id, !item.checked)(ev, true)
    // set read
    if (!item.other.is_read) {
      setItemReaded(item.id, menuListRef, setMenuList)
      const success = await setReadOrUnread(true, item);
      if (!success) {
        setItemReaded(item.id, menuListRef, setMenuList, false)
      }
    }
  };
  useEffect(() => {
    if (queryMenusLoading) {
      setCurrentEmailIndex(-1)
    }
  }, [queryMenusLoading])

  // useEffect(() => {
  //   reQueryPage()
  // }, [inboxRefresh])

  useInit(stopKeyDownSwitchEmail, currentEmailIndex, setCurrentEmailIndex, setReadOrUnread, menuListRef)

  // const { focusLineRef, menusRef } = useSetFocusLineStyle(currentMenu)

  useEffect(() => {
    if (isMobile) {
      const clickFn = (ev) => {
        if (!ev.target.closest('.__checkedShow')) {
          setShowCheckboxs(false)
          unCheckedAll()
        }
      }

      window.addEventListener('click', clickFn)
    
      return () => {
        window.removeEventListener('click', clickFn)
      }
    }
  }, [isMobile])

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
          <div className="checkbox quick-title" data-title={allChecked ? "Deselect" : "Select"} onClick={onAllChecked}>
            <Svgs type={allChecked ? "selected" : "checkbox"} />
          </div>
          {!anyChecked ? (
            <div className="chunk">
              <div data-title="refresh" className={`icons-actions icon-refresh quick-title`}  onClick={reQueryPage}>
                <Svgs type="refresh" />
              </div>
            </div>
          ) : (
            <div className="chunk __checkedShow">
              <div 
                data-title={anyUnRead ? "read" : 'unread'}
                className={`icons-actions quick-title icon-${anyUnRead ? "read" : 'unread'}`} 
                onClick={ () => anyChecked && setReadOrUnread(!!anyUnRead) }
              >
                <Svgs type={anyUnRead ? "read" : 'unread'} />
              </div>
              <div data-title="spam" className={`icons-actions quick-title icon-spam2`} onClick={() => anyChecked && onSpam("multi")}>
                <Svgs type="spam" />
              </div>
              <div data-title="trash" className={`icons-actions quick-title icon-trash2`} onClick={() => anyChecked && onDelete("multi")}>
                <Svgs type="trash" />
              </div>
              <div
                data-title={`${collected ? 'un' : ''}star`}
                className={ `icons-actions quick-title icon-star2 ${collected ? "on" : ""}` }
                onClick={ () => anyChecked && setCollected(!collected) }
              >
                <Svgs type="star" fill={collected ? "#FF563F" : "none"} />
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
                      <EmailItem
                        key={ index }
                        index={ index }
                        data={ item }
                        selected={currentEmailIndex === index}
                        detailLoading={detailLoading}
                        showCheckboxs={ showCheckboxs }
                        setShowCheckboxs = { setShowCheckboxs }
                        viewDetail={ queryDetailById }
                        onCheckbox={ onCheckbox }
                        onDelete={ onDelete }
                        setCollected={ setCollected }
                      />
                    );
                  }) }
                </ul>
              </Spin>
            </List>
          </Left>
          {isMobile ? (
            <Tools show={currentEmailIndex !== -1} back={() => setCurrentEmailIndex(-1)}>
              <Content
                loading={ detailLoading }
                data={ menuList[currentEmailIndex] }
                total={ total }
                setCollected={ setCollected }
                onDelete={ onDelete }
                onSpam={ onSpam }
                Status={ "index" }
              />
            </Tools>
          ) : (
            <Content
              loading={ detailLoading }
              data={ menuList[currentEmailIndex] }
              total={ total }
              setCollected={ setCollected }
              onDelete={ onDelete }
              onSpam={ onSpam }
              Status={ "index" }
            />
          )}
        </Root>
      )}
      
    </Container>
  );
};

export default withRouter(inject("store")(observer(Index)));
