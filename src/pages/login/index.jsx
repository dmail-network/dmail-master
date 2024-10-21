import React, { useRef, useState, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { useHistory, withRouter, useParams } from "react-router-dom";
// import MetaMaskSDK from '@metamask/sdk';

import { checkBlackAccount, loginRecord } from "@/api/web2/index";
import Message from "@/components/Message/index";
import Circles from "@/components/Circles/index";
import { host, getQueryString } from "@/utils/index";
import { clearStorage, userInfoKeys } from "@/utils/storage";

import { loginTypes, BtnLoading, Chains, LinkBtns, ChainNameMap } from './utils'
import { plugAuth, infinityswapAuth } from './difinity'
import { metamaskAuth, bnbAuth, bitkeepAuth, kucoinAuth, okAuth, trustAuth } from './metamask/bsc'
import { walletConnect, signMessage } from './metamask/mobile'
import { getLoginedPrincipalId, generateIdentityByHash } from './metamask/utils'
import WorldLogin from "./metamask/worldCoin";
import { phantomAuth } from './metamask/solana'
import { keplrAuth } from './metamask/sei'
import { mantaAuth } from './metamask/manta'
import { authClient } from "./authClient";
import MobileLogin from "./mobile.login";
import { Root, FlexBetweenWrapper, Wrapper } from "./css";
import Logo from "../../static/images/login-logo.svg";
import ChainsSvgs from "@/components/svgs/chains";
import ChainsSubSvgs from "@/components/svgs/chainSubs";
import ChainsWalletSvgs from "@/components/svgs/chainWallets";

const Index = ({ store }) => {
  const { isMobile } = store.mobile;
  const history = useHistory();
  const toPathAfterLoginSuccess = getQueryString('path')

  const [loading, setLoading] = useState({
    // plug、ii、metamask、infinity
    ...loginTypes.reduce((res, key) => {
      res[key] = false
      return res
    }, {})
  });
  const loadingRef = useRef(loading)
  const _setLoading = (key, value) => {
    if (!(key in loading)) {
      return
    }
    const newLoading = {
      ...loadingRef.current,
      ...{ [key]: value }
    }
    loadingRef.current = newLoading
    setLoading(newLoading)
  }

  const backLogin = () => {
    clearStorage();
    store.resetStores();
    history.push('/login')
  }
  const checkValid = async (sIdentity, loadingKey, loginAddress, chainId) => {
    store.common.setInitingStatus(true)
    const fails = await Promise.all([
      (async () => {
        const fail = await checkBlackAccount(sIdentity, true)
        fail && backLogin()
        return fail
      })(),
      (async () => {
        const fail = !await store.common.getTokenAndStoreUserInfo(isMobile, history, sIdentity, loadingKey, loginAddress, chainId, true)
        fail && backLogin()
        return fail
      })()
    ])
    // console.log('fails', fails)
    if (fails.filter((fail) => fail).length) {
      return
    }
    store.common.initData(isMobile)
    loginRecord(loginAddress, loadingKey, chainId)
    _setLoading(loadingKey, false)
    store.common.queryFrequentData(isMobile)
  }
  const afterGetIdentity = async (sIdentity, loadingKey, loginAddress, chainId = '') => {
    store.common.setUserInfo({
      [userInfoKeys[0]]: sIdentity,
      [userInfoKeys[1]]: loadingKey,
      [userInfoKeys[2]]: loginAddress,
      [userInfoKeys[7]]: chainId,
    });
    checkValid(sIdentity, loadingKey, loginAddress, chainId)
    history.push(toPathAfterLoginSuccess || '/inbox');
  }

  const detectIsLoading = () => {
    if (Object.values(loading).filter(item => !!item).length) {
      return true;
    }
    return false
  }

  const iiConnect = async () => {
    if (detectIsLoading()) {
      return;
    }
    await authClient.create();
    await authClient.login();
    const identity = await authClient.getIdentity();
    if (identity) {
      _setLoading('ii', true)
      const sIdentity = identity.getPrincipal().toString();
      await afterGetIdentity(sIdentity, 'ii', sIdentity)
    } else {
      _setLoading('ii', false)
      console.error("could not get identity");
    }
  };

  const plugConnect = async () => {
    if (detectIsLoading()) {
      return;
    }
    if (!isMobile) {
      _setLoading('plug', true);
      const res = await plugAuth();
      if (res === true) {
        const principalId = await window.ic.plug.agent.getPrincipal();
        const sPrincipalId = principalId.toString()
        await afterGetIdentity(sPrincipalId, 'plug', sPrincipalId)
      } else {
        _setLoading('plug', false);
        if (res.msg) {
          Message.error(res.msg)
        }
      }
    }
  };

  // https://infinityswap-docs-wallet.web.app/docs/Infinity-swap-wallet/integration
  const infinityConnect = async () => {
    if (detectIsLoading()) {
      return;
    }
    if (!isMobile) {
      _setLoading('infinity', true);
      const res = await infinityswapAuth();
      if (typeof res === 'string') {
        await afterGetIdentity(res, 'infinity', res)
      } else {
        _setLoading('infinity', false);
        if (res && res.msg) {
          Message.error(res.msg)
        }
      }
    }
  };

  const ethConnectFn = (type, authFn) => async () => {
    if (detectIsLoading()) {
      return;
    }
    let provider = null
    if (isMobile) {
      if (!window.ethereum) {
        window.location.href = `https://metamask.app.link/dapp/${window.location.href || host}`
        return
      } else if (window.ethereum && window.ethereum.isTrust) {
        // https://developer.trustwallet.com/developer/develop-for-trust/mobile#sign-multi-chain-transaction
        // can not sign
        console.log(window.ethereum)
      } else {
        // const MMSDK = new MetaMaskSDK({ dappMetadata: {name: "Dmail", url: `https://${host}`} });
        // provider = MMSDK.getProvider();
        provider = window.ethereum
      }
      
      // console.log(window.ethereum, window.ethereum.isTrust)
    }
    _setLoading(type, true);
    const [principalId, account, chainId] = await authFn(() => setLoading(type, false), provider, isMobile);
    if (typeof principalId === 'string' && principalId) {
      await afterGetIdentity(principalId, type, account, chainId)
    } else {
      _setLoading(type, false);
    }
  }

  const walletConnectFn = async () => {
    if (detectIsLoading()) {
      return;
    }
    const setLoadingFalse = () => _setLoading('wallet', false)
    try {
      const [connector, account, chainId] = await walletConnect(isMobile)
      _setLoading('wallet', true)
      const { signature, loginMessageHash, } = await signMessage(connector, account)
      const principalId = await getLoginedPrincipalId(account, loginMessageHash, signature, setLoadingFalse)
      if (typeof principalId === 'string' && principalId) {
        await afterGetIdentity(principalId, 'wallet', account, parseInt(chainId))
      }
      _setLoading('wallet', false)
    } catch (error) {
      error && Message.error(error)
      return
    }
  }

  const worldCoinFn = async (principalId, account) => {
    await afterGetIdentity(principalId, 'worldcoin', account)
  }

  const solConnectFn = (type) => async () => {
    if (detectIsLoading()) {
      return;
    }
    _setLoading(type, true);
    const [principalId, account, chainId] = await phantomAuth(() => setLoading(type, false));
    if (typeof principalId === 'string' && principalId) {
      await afterGetIdentity(principalId, type, account, chainId)
    } else {
      _setLoading(type, false);
    }
  }

  const seiFn = (type) => async () => {
    if (detectIsLoading()) {
      return;
    }
    _setLoading(type, true);
    const account = await keplrAuth(type, isMobile);
    if (account) {
      const sPrincipalId = await generateIdentityByHash(account, 'Sei')
      if (sPrincipalId) {
        await afterGetIdentity(sPrincipalId, type, account, ChainNameMap[type])
      } else {
        _setLoading(type, false);
        Message.error('Login failed')
      }
    } else {
      _setLoading(type, false);
      Message.error('Get wallet address failed')
    }
  }

  const mantaFn = (type) => async () => {
    if (detectIsLoading()) {
      return;
    }
    _setLoading(type, true);
    const account = await mantaAuth(type, isMobile, true);
    if (account) {
      const sPrincipalId = await generateIdentityByHash(account, 'Manta', true)
      if (sPrincipalId) {
        await afterGetIdentity(sPrincipalId, type, account, ChainNameMap[type])
      } else {
        _setLoading(type, false);
        Message.error('Login failed')
      }
    } else {
      _setLoading(type, false);
      // Message.error('Get wallet address failed')
    }
  }

  const loginAuth = (name) => {
    switch (name) {
      case 'metamask':
        return ethConnectFn('metamask', metamaskAuth)
      
      case 'trust':
        return ethConnectFn('trust', trustAuth)
      
      case 'bitkeep':
        return ethConnectFn('bitkeep', bitkeepAuth)
      
      case 'ok':
        return ethConnectFn('ok', okAuth)
      
      case 'kucoin':
        return ethConnectFn('kucoin', kucoinAuth)
      
      case 'wallet':
        return walletConnectFn
      
      case 'plug':
        return plugConnect
      
      case 'infinity':
        return infinityConnect
      
      case 'ii':
        return iiConnect
      
      case 'keplr': 
        return seiFn(loginTypes[11])
      
      case 'leap': 
        return seiFn(loginTypes[12])
      
      case 'manta': 
        return mantaFn(loginTypes[13])
      
      case 'phantom': 
        return solConnectFn(loginTypes[14])
    
      default:
        break;
    }
  }

  const [currentChain, setCurrentChain] = useState(0)
  const switchMainChain = (index) => {
    if (detectIsLoading()) {
      return;
    }
    setCurrentChain(index)
  }

  const [walletScollPos, setWalletPos] = useState('top')
  useEffect(() => {
    const scrollWallets = document.querySelector('#__wallets_ethMain')
    if (scrollWallets) {
      const scrollHeight = scrollWallets.scrollHeight
      const clientHeight = scrollWallets.clientHeight
      const distance = 5
      const EventFn = () => {
        const scrollTop = scrollWallets.scrollTop
        if (scrollTop < distance) {
          setWalletPos('top')
        } else if (scrollTop > scrollHeight - clientHeight - distance) {
          setWalletPos('bottom')
        } else {
          setWalletPos('center')
        }
      }
      scrollWallets.addEventListener('scroll', EventFn)

      return () => {
        scrollWallets.removeEventListener('scroll', EventFn)
      }
    }
  }, [])

  useEffect(() => {
    clearStorage();
    store.resetStores();
  }, [])

  return isMobile ?
    <MobileLogin
      loading={loading}
      detectIsLoading={detectIsLoading}
      BtnLoading={BtnLoading}
      afterGetIdentity={afterGetIdentity}
      ethConnectFn={ethConnectFn}
      metamaskAuth={metamaskAuth}
      _setLoading={_setLoading}
      iiConnect={iiConnect}
    /> :
    (
      <Root>
        <Circles />
        <Wrapper>
          <FlexBetweenWrapper className="top">
            <div className="logo">
              <img src={ Logo } alt="" />
            </div>
            <LinkBtns className="pos-static" />
          </FlexBetweenWrapper>
          <div className="login">
            <FlexBetweenWrapper className="title">
              <div className="name"><strong>Login To Dmail</strong></div>
              <div className="network">
                <p>{Chains[currentChain].name}</p>
                {Chains[currentChain].subChainSvgs.map((name, index) => (
                  <span key={name} style={{ zIndex: 20 - index }}><ChainsSubSvgs type={name} /></span>
                ))}
              </div>
            </FlexBetweenWrapper>
            <div className="chunks">
              <div className={`chains ${Chains.length > 3 ? 'chains-scroll' : ''}`}>
                {Chains.map(({ name, svg }, index) => (
                  <div className={`item ${svg} ${index === currentChain ? 'on' : ''}`} key={name} onClick={() => switchMainChain(index)}>
                    <ChainsSvgs type={svg} isFocus={index === currentChain} />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
              {Chains.map(({ name, svg, wallets }, index) => (
                <div className={`wallets ${index === currentChain ? 'show' : ''} ${svg === 'ethMain' ? 's-'+walletScollPos : ''}`} key={name}>
                  {svg === 'worldcoin' ? <WorldLogin loginFn={worldCoinFn} /> : (
                    <ul id={`__wallets_${svg}`}>
                      {wallets.map((item, key) => (
                        <li className={`item ${loading[item.svg] ? 'on' : ''}`} key={key} onClick={loginAuth(item.svg)}>
                          <span>{item.name}</span>
                          <p className={item.svg}><ChainsWalletSvgs type={item.svg} /></p>
                          { loading[item.svg] && <span className="loading">{BtnLoading}</span> }
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bottom">
            <div className="help">
              <a href="https://dmailofficial.gitbook.io/helpcenter/v/english/" target="_blank">Help Center</a>
            </div>
            <p>@Dmail Network Foundation LTD.</p>
          </div>
        </Wrapper>
      </Root>
    );
};

export default withRouter(inject("store")(observer(Index)));
