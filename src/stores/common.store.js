import { makeAutoObservable, toJS } from "mobx";
import { Storage, Channel_Id, userInfoStorage, userInfoKeys, Has_Switched_Did, Has_Enabled_Did, Binded_Did_List } from "@/utils/storage";
import Message from "@/components/Message/index";
import { getUserUsageInfo, getToken, bindDid, bindAlias, addUserInfo, aliasBindedQuery } from "@/api/web2/index";
import { rigisterDefaultAlias, getDefaultAliasByPid } from "@/api/web2/common";
import { sendWelcome, dmailPid } from '@/utils/send'
import { cache, baseURL } from "@/utils/axios";
import { isLoginPage, defaultAva, dmailAi, getQueryString } from "@/utils/index";
import GetDids, { Chains } from "@/utils/did";
import { CanisterIds, http, transformPrincipalId, getAlias } from "@/api/index";
import { setBodyCid, getCanisterId, bindCanisterId, setCanisterId } from "@/api/canisterId";
import { detectedIsMixed, getCidByPid } from "@/api/mails/web2";
import Modal from "@/components/Modal/index";
import { CacheKeys } from '@/stores/pages/email.store.js'

const defaultUsedVolume = {
  channelId: '',
  points: 0,
  page: '-',
  bVolume: 0,
  volume: '-',
  volumeUnit: '',
  notReadSize: 0,
  equityInfo: null,

  // level: 0,
  // points: 0,
  // channelId: '',
  // levelName: levelNameMap[0],
  // decentralizedStorage: true,
  // emailEncryption: true,
  // rewardFactor: '1.0',

  // page: 0,
  // volume: 0,
  // bVolume: 0,
  // totalPage: 0,
  // volumeUnit: "",
  // totalVolume: 0,
  // bTotalVolume: 0,
  // totalVolumeUnit: "",
  // // usedVolumePercent%
  // usedVolumePercent: 0,
  // hasTipVolumeWillFull: false,
};

export default class CommonStore {
  channelIdFromInvitedFriends = '';
  userInfo = userInfoKeys.reduce((res, key) => {
    res[key] = "";
    return res;
  }, {});
  principalId = "";
  tokenGetted = false;
  enabledDid = '';
  // for compose from
  senderFrom = ''

  stopKeyDownSwitchEmail = false;

  unReadList = {
    Inbox: 0,
  };
  // trigger clear email cache when clearCacheKeys change; such as recieve new emails, move inbox email to spam/trash
  clearCacheKeys = [];
  usedVolume = {
    ...defaultUsedVolume,
  };

  initing = false;
  bindingDmailAlias = false;
  getBindedNftEnd = false;
  // include '@dmail.ai'
  defaultAlias = "";
  // exclude '@dmail.ai'
  bindedNft = '';
  bindedNftIndex = 0;
  myNftList = [];
  aminoNftList = [];
  gettingNftList = false;
  gettingAminoNftList = false;

  myDids = {};
  gettingMyDids = false;

  profileInfo = null;
  pidToAvaMap = {};

  // ask to save or not when leave compose page
  routerBlockFn = null;

  // inboxRefresh = 0;
  
  bindedDid = ''
  didFirstEnabled = Storage.get(Has_Enabled_Did);
  didFirstSwitched = Storage.get(Has_Switched_Did);

  constructor() {
    makeAutoObservable(this);
  }

  // triggerInboxRefresh() {
  //   this.inboxRefresh += 1;
  // }

  setClearCacheKeys(keys) {
    this.clearCacheKeys = Array.isArray(keys) ? keys : [keys]
  }

  setFirstDidEnabled() {
    this.didFirstEnabled = true
  }

  setFirstDidSwitched() {
    this.didFirstSwitched = true
    Storage.set(Has_Switched_Did, true);
  }

  setStopKeyDownSwitchEmail(status) {
    this.stopKeyDownSwitchEmail = status;
  }

  setChannelIdFromInvitedFriends(value, notStore = false) {
    !notStore && Storage.set(Channel_Id, value)
    this.channelIdFromInvitedFriends = value
  }

  setEnabledDid(value) {
    this.enabledDid = value
    value && this.setSenderFrom(value)
  }

  setSenderFrom(value) {
    this.senderFrom = value
  }

  async detectBindedDidValid(address, principalId) {
    if (!principalId || address === principalId) {
      return
    }

    const getDids = new GetDids(address, principalId)
    // use otherData to order alltypedata if need
    this.gettingMyDids = true
    await getDids.getAllDids((type, currentData, queryError) => {
      if (type === Chains.eth) {
        this.myDids = { ...this.myDids, ethData: currentData, allData: getDids.allData }
      } else if (type === Chains.bsc) {
        this.myDids = { ...this.myDids, bscData: currentData, allData: getDids.allData }
      } else if (type === Chains.PlatON) {
        this.myDids = { ...this.myDids, hashKeyData: currentData, allData: getDids.allData }
      } else if (type === Chains.Polygon) {
        this.myDids = { ...this.myDids, polData: currentData, allData: getDids.allData }
      } else if (type === Chains.ConfluxESpace) {
        this.myDids = { ...this.myDids, confluxData: currentData, allData: getDids.allData }
      } else if (type === Chains.zkSync) {
        this.myDids = { ...this.myDids, zkSyneData: currentData, allData: getDids.allData }
      } else if (type === Chains.IoTeX) {
        this.myDids = { ...this.myDids, ioTeXData: currentData, allData: getDids.allData }
      }

      // request binded did error
      if (getDids.bindedDid === false) {
        return
      }

      // set binded
      this.setEnabledDid(getDids.bindedDid)
      const isBinedDidValid = getDids.detectBindedDidValid(type, currentData)
      if (isBinedDidValid === 0) {
        return
      }
      // delete bind when binded did invalid (did has transfered by user)
      if (isBinedDidValid === -1) {
        this.setEnabledDid('')
        bindDid(principalId, '', true)
      }
    })
    this.gettingMyDids = false
  }

  async updateBined(isMobile, alias, index) {
    this.setBindedNft(`${alias}`, Number(index), isMobile);
    const hasBindedInWeb2 = await aliasBindedQuery(alias)
    // fix web3 binded but web2 not bind bug (only a few accounts has this bug)
    if (!hasBindedInWeb2) {
      const loginAddress = this.userInfo[userInfoKeys[2]] || userInfoStorage.get(userInfoKeys[2])
      bindAlias(alias, this.principalId, loginAddress, '')
    }
  }

  async detectGettingBindedNftEnded() {
    if (this.getBindedNftEnd) {
      return this.bindedNft;
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
    return await this.detectGettingBindedNftEnded();
  }

  async getNftAlias(isMobile) {
    const { alias, index } = await getAlias(this.principalId);
    this.getBindedNftEnd = true;
    if (alias) {
      this.updateBined(isMobile, alias, index)
    }
    return alias;
  }

  async regetToken(isMobile = false) {
    const sIdentity = this.principalId
    if (!sIdentity) {
      return
    }
    let token = ''
    try {
      const res = await http(CanisterIds.jwt_cache, "update_create_jwt_by_pid", [
        transformPrincipalId(sIdentity),
      ]);
      if (typeof res.Ok === 'string') {
        token = res.Ok
      } else {
        Message.error('Login error.');
        return false
      }
    } catch (error) {
      Message.error('Login error.');
      return false
    }
    
    const success = await getToken(sIdentity)
    if (!success) {
      Message.error('Login error.');
      return false
    }
    cache.enpid = token
    this.setUserInfo({
      [userInfoKeys[5]]: token,
    });
    this.getAndSetUserInfo(this.principalId, isMobile)
  }

  async getTokenAndStoreUserInfo(isMobile, history, sIdentity, loadingKey, loginAddress, chainId = '', notInitData = false) {
    let token = ''
    this.tokenGetted = false;

    const icode = getQueryString('icode')

    try {
      const res = await http(CanisterIds.jwt_cache, "update_create_jwt_by_pid", [
        transformPrincipalId(sIdentity),
      ]);
      if (typeof res.Ok === 'string') {
        token = res.Ok
      } else {
        Message.error('Login error.');
        return false
      }
    } catch (error) {
      Message.error('Login error.');
      return false
    }
    
    const success = await getToken(sIdentity)
    if (!success) {
      Message.error('Login error.');
      return false
    }
    cache.enpid = token
    const res = this.setUserInfo({
      [userInfoKeys[0]]: sIdentity,
      [userInfoKeys[1]]: loadingKey,
      [userInfoKeys[2]]: loginAddress,
      [userInfoKeys[5]]: token,
      [userInfoKeys[7]]: chainId,
    });

    rigisterDefaultAlias(sIdentity, loginAddress || sIdentity, loadingKey, icode || '')

    if (!res) {
      Message.error('Login error.');
      return false
    }
    
    !notInitData && await this.initData(isMobile);
    return true
  }

  async setInitingStatus(status) {
    this.initing = status
  }

  async sendWelcomeEmail(_bodyCid) {
    const bodyCid = _bodyCid || userInfoStorage.get(userInfoKeys[3])
    const dmailCid = await getCanisterId(dmailPid, true)
    dmailCid && sendWelcome(dmailCid, bodyCid, this.principalId, this.defaultAlias)
  }

  async bindAndGetCanisterId(principalId) {
    const res = await http(CanisterIds.router, "queryCidByPid", [
      transformPrincipalId(principalId),
    ]);
    if (Array.isArray(res.Ok)) {
      if (res.Ok.length) {
        const canisterId = res.Ok[0].toText();
        setBodyCid(canisterId);
        return canisterId;
      } else {  // not binded yet
        const cid = await bindCanisterId(principalId)
        detectedIsMixed(cid, principalId).then((isMixedCanister) => this.isMixedCanister = isMixedCanister)
        cid && this.sendWelcomeEmail(cid)
        return cid
      }
    }

    return ''
  }

  // last Canister upgrade failed, the Canister mrvim-lqaaa-aaaap-abc7a-cai is invalid, so these user will rebuild Canister
  // fixed by jiaxu
  // async rebildProblematicMixedCid(principalId) {
  //   const res = await getCidByPid(principalId)
  //   console.log('rebildProblematicMixedCid res', res)
  //   if (res === undefined) {
  //     return false
  //   }

  //   if (res && res.type === 'mixer') {
  //     const cid = await bindCanisterId(principalId)
  //     cid && this.setUserInfo({
  //       [userInfoKeys[3]]: cid,
  //     });
  //   }

  //   return true
  // }
  
  // async checkRigisterDefaultAlias(principalId, loginAddress, wallet_name) {
  //   const defaultAlias = await getDefaultAliasByPid(principalId)
  //   if (defaultAlias === '') {
  //     await rigisterDefaultAlias(principalId, loginAddress || principalId, wallet_name)
  //   }
  // }

  async initData(isMobile) {
    this.tokenGetted = true;
    cache.tokenGetted = true;
    const bodyCid = userInfoStorage.get(userInfoKeys[3])
    // let hasFixedCid = false
    if (bodyCid) {
      if (bodyCid === 'gy5ko-taaaa-aaaap-aanrq-cai') {
        window.location.href = '/login'
        return
      }

      setBodyCid(bodyCid);
      
      detectedIsMixed(bodyCid, this.principalId).then((isMixedCanister) => {
        console.log('isMixedCanister', isMixedCanister)
      })
    }
    return new Promise(async (resolve) => {
      if (!this.principalId) {
        resolve(false);
        return false;
      }
      this.getProfileInfo();
      const loginAddress = this.userInfo[userInfoKeys[2]] || userInfoStorage.get(userInfoKeys[2])
      this.defaultAlias = `${loginAddress}${dmailAi}`
      const loginType = this.userInfo[userInfoKeys[1]] || userInfoStorage.get(userInfoKeys[1])
      this.detectBindedDidValid(loginAddress, this.principalId)

      this.getNftAlias(isMobile);
      this.getMyNftList(null, false, isMobile)
      
      // this.checkRigisterDefaultAlias(this.principalId, loginAddress, loginType)

      if (bodyCid) {
        resolve(true);
        return true;
      }

      this.setInitingStatus(true)
      const canisterId = await this.bindAndGetCanisterId(this.principalId)
      detectedIsMixed(canisterId, this.principalId).then((isMixedCanister) => {
        console.log('isMixedCanister', isMixedCanister)
      })
      if (canisterId) {
        this.setUserInfo({[userInfoKeys[3]]: canisterId })
      }
      this.setInitingStatus(false)
      resolve(!!canisterId);
    });
  }

  setRouterBlockFn(fn) {
    this.routerBlockFn = fn;
  }

  setUnRead(num, name = "Inbox") {
    const lastInboxNum = this.unReadList.Inbox
    if (name === 'Inbox' && num > 0 && num > lastInboxNum) {
      this.setClearCacheKeys([CacheKeys.inbox])
    }
    this.unReadList = {
      [name]: parseInt(num || 0),
    };
  }

  setUsedVolume(newData) {
    this.usedVolume = {
      ...this.usedVolume,
      ...newData,
    };
  }

  async getAndSetUserInfo(principalId, isMobile) {
    const data = await getUserUsageInfo(principalId || this.principalId, this.bindedNftIndex);
    if (data) {
      const { notReadSize, ...newData } = data;
      this.setUsedVolume(newData);
      this.setUnRead(notReadSize);
      this.volumeFullTip(isMobile);
    }
  }

  async queryFrequentData(isMobile) {
    if (isLoginPage()) {
      return;
    }
    const principalId = this.principalId || this.getPrincipalId();
    if (!principalId) {
      return false;
    }
    const encstring = this.userInfo[userInfoKeys[5]] || userInfoStorage.get(userInfoKeys[5])
    if (!encstring) {
      return false;
    }

    await this.getAndSetUserInfo(principalId, isMobile)
  }

  volumeFullTip(isMobile) {
    if (!this.bindedNft || !(this.bindedNft in this.usedVolume)) {
      return
    }
    const data = this.usedVolume[this.bindedNft]
    // hasTipVolumeWillFull is avoid to get localstorage data
    const hasExceedLimit =
      this.usedVolume.bVolume >= data.bTotalVolume - 20 * 1024 * 1024;
    if (
      hasExceedLimit &&
      !data.hasTipVolumeWillFull &&
      userInfoStorage.get(userInfoKeys[6])
    ) {
      this.usedVolume[this.bindedNft].hasTipVolumeWillFull = true;
      this.setUserInfo({
        [userInfoKeys[6]]: true
      })
      Modal({
        isMobile,
        type: "warn",
        title: "Insufficient space",
        content:
          "There's not sufficient mailbox space and Beta version does not support expansion. You can free up canister space by permanently deleting emails in Trash.",
        okText: "Ok",
        noCancel: true,
        async onOk() {
          return true;
        }
      });
    }
  }

  setUserInfo(data) {
    const res = userInfoStorage.set(data, this.userInfo);
    if (res) {
      this.userInfo = res
      if (!this.principalId && res[userInfoKeys[0]]) {
        this.principalId = res[userInfoKeys[0]];
      }
    }
    return res;
  }

  getUserInfo() {
    const userInfo = userInfoStorage.get("all");
    if (typeof userInfo === "object") {
      this.userInfo = { ...this.userInfo, ...userInfo };
    }
  }

  getPrincipalId() {
    if (this.principalId) {
      return this.principalId;
    }

    this.getUserInfo();
    this.principalId = this.userInfo[userInfoKeys[0]] || "";
    this.bindedNft = this.userInfo[userInfoKeys[4]] || "";
    return this.principalId;
  }

  async setBindedNft(emailName, index, isMobile) {
    if (emailName) {
      this.setUserInfo({ [userInfoKeys[4]]: emailName })
      this.bindedNft = emailName;
      this.bindedNftIndex = index;
      await this.getAndSetUserInfo(this.principalId, isMobile)
    }
  }

  // if not bind, currentBindedNftId is 0
  async bindDmailAlias(isMobile, nft, currentBindedNftId = 0, autoBind = false) {
    const principalId = this.principalId
    if (this.bindingDmailAlias) {
      return false
    }
    this.bindingDmailAlias = true;
    let success = false
    const lastBindedNft = this.bindedNft
    try {
      const res = await http(CanisterIds.dmail_nft, "bind", [
        transformPrincipalId(principalId),
        currentBindedNftId === 0 ? [] : [currentBindedNftId],
        nft.id,
      ]);
      if (res.Ok) {
        success = true
        !autoBind && Message.success('Bind successful')
        this.updateMyNftList(nft, isMobile);
        const loginAddress = this.userInfo[userInfoKeys[2]] || userInfoStorage.get(userInfoKeys[2])
        const loginType = this.userInfo[userInfoKeys[1]] || userInfoStorage.get(userInfoKeys[1])
        bindAlias(nft.emailName, principalId, loginAddress, this.channelIdFromInvitedFriends, loginType)
        const cid = await getCanisterId(principalId, true)
        if (!cid) {
          const close = !autoBind ? Message.loading('Account initialization...') : function () { }
          const dmailCid = await getCanisterId(dmailPid, true)
          if (nft.emailName.length > 7) { 
            const cid = await bindCanisterId(principalId)
            await detectedIsMixed(cid, principalId)
            if (!lastBindedNft && cid) {
              dmailCid && sendWelcome(dmailCid, cid, principalId, nft.emailName)
            }
            cid && close()
          } else {
            setCanisterId(principalId)
              .then(async (canisterId) => {
                close()
                if (!lastBindedNft && canisterId) {
                  // const dmailCid = await getCanisterId(dmailPid, true)
                  dmailCid && sendWelcome(dmailCid, canisterId, principalId, nft.emailName)
                }
              })
              .catch(() => {
                close()
              })
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
    this.bindingDmailAlias = false;
    return success
  }

  updateMyNftList(nft, isMobile) {
    this.setBindedNft(nft.emailName, Number(nft.id), isMobile);
    this.myNftList = this.myNftList.map((item) => {
      item.useing = item.token_id === nft.token_id
      return item;
    });
    // this.sortMyNftList();
  }

  setProfileInfo(avatar_base64) {
    this.profileInfo = avatar_base64 || '';
  }

  async queryAvatarByPid(pid, useDefaultAva) {
    const res = await http(CanisterIds.profile, "queryAvatarByPid", [
      transformPrincipalId(pid),
    ]);
    const ava = useDefaultAva ? defaultAva : ''
    if (res.Ok) {
      this.pidToAvaMap[pid] = res.Ok[0] || ava
    } else {
      this.pidToAvaMap[pid] = ava
    }
  }

  async getAvaFromPid(pid, useDefaultAva = false) {
    if (!pid || typeof pid !== 'string') {
      return ''
    }
    const flipText = `function() {hi, dmail}`

    if (pid in this.pidToAvaMap) {
      const pidToAvaMap = this.pidToAvaMap
      if (pidToAvaMap[pid] === flipText) {
        while (1) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          if (pidToAvaMap[pid] !== flipText) {
            break;
          }
        }
      }
      return pidToAvaMap[pid]
    } else {
      this.pidToAvaMap[pid] = flipText
      this.queryAvatarByPid(pid, useDefaultAva)
      return await this.getAvaFromPid(pid)
    }
  }

  async getProfileInfo() {
    const principalId = this.principalId || this.getPrincipalId();
    if (!principalId) {
      console.error("no principalId");
      return;
    }
    const ava = await this.getAvaFromPid(principalId)
    if (ava) {
      this.setProfileInfo(ava);
    }
  }

  // async getDmailNFTInfo(bindedNft) {
  //   if (!bindedNft) {
  //     return
  //   }
  //   const data = await getDmailNFTInfo(bindedNft)
  //   this.dmailNftInfo = data && data.alias ? { [data.alias]: data} : {}
  // }

  setAminoNfts (list) {
    this.aminoNftList = list
  }

  async getAminoNftList(afterGettedCb = null) {
    const principalId = this.principalId || this.getPrincipalId();
    if (!principalId) {
      console.error("no principalId");
      return;
    }
    if (this.aminoNftList.length) {
      return;
    }
    if (this.gettingAminoNftList) {
      return;
    }
    this.gettingAminoNftList = true
    try {
      const list = await http(CanisterIds.nft_market, "query", [
        transformPrincipalId(principalId),
      ]);

      if (Array.isArray(list) && list.length) {
        list.forEach(({ nft_content, index, bind }) => { 
          // const isDmailNft = nft_theme === "Dmail"
          // const isAminoDmailNft = nft_theme === "amino_nft"
          let sContent = ''
          if (typeof nft_content === 'string') {
            sContent = nft_content.replaceAll('\n', '').replaceAll(' ', '').replace(/,\}/g, "}")
          }
          const data = JSON.parse(sContent)
          if (!data) {
            return null
          }
          if (!('points' in data)) {
            this.aminoNftList.push({
              type: 'amino',
              token_id: index,
              id: Number(data.id),
              url: data.url,
              attributes: Array.isArray(data.attributes) ? data.attributes : [],
              useing: !!bind,
            })
          }
        })
      } else {
        this.aminoNftList = []
      }
    } catch (error) {
      console.log(error)
    }
    typeof afterGettedCb === 'function' && await afterGettedCb(this)
    this.gettingAminoNftList = false
  }

  async bindOrBuyNftPop(isMobile, history, action = 'import points') {
    await this.waitingforNftListQueryEnd()
    let status = ''
    if (this.myNftList.length) {
      if (!await this.detectGettingBindedNftEnded()) {
        status = 'bind'
      } else {
        return false
      }
    } else {
      status = 'buy'
    }

    const channelId = this.channelIdFromInvitedFriends
    const content = status === 'bind' ? `Before ${action},you should bind an NFT Domain Account with Dmail. <br />Detected that you have an existing NFT Domain Account,please complete the bind as soon as possible.` : `Before ${action}, please bind an NFT Domain Account with Dmail. You can purchase an NFT Doman Account in pre-sale and complete the bind.`

    Modal({
      isMobile,
      type: "",
      title: "Please bind an NFT Domain Account!",
      content,
      okText: status === 'bind' ? "Bind" : "Buy NFT",
      noCancel: true,
      onOk: async () => {
        status === 'bind' ? history.push(`/setting/account${channelId ? '/' + channelId : ''}`) : history.push("/presale")
        return true;
      },
    });
    return true
  }

  async waitingforNftListQueryEnd() {
    if (!this.gettingNftList) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
    return await this.waitingforNftListQueryEnd();
  }

  // get dmail nft
  async getMyNftList(afterGettedCb = null, forceReget = false, isMobile) {
    const principalId = this.principalId || this.getPrincipalId();
    if (!principalId) {
      console.error("no principalId");
      return;
    }
    if (!forceReget && this.myNftList.length) {
      return;
    }
    if (this.gettingNftList) {
      return;
    }
    this.gettingNftList = true
    if (forceReget) {
      this.myNftList = []
    }
    try {
      const res = await http(CanisterIds.dmail_nft, "query", [
        transformPrincipalId(principalId),
      ]);
      const list = 'Ok' in res ? res.Ok : []
      if (Array.isArray(list) && list.length) {
        list.forEach(({ token_identifier, properties }) => { 
          if (!Array.isArray(properties) || !properties.length) {
            return null
          }
          const attrs = properties.reduce((obj, arr) => {
            obj[arr[0]] = Object.values(arr[1])[0]
            return obj
          }, {})
          if (attrs.binding) {
            this.setBindedNft(attrs.alias, Number(token_identifier), isMobile);
          }
          this.myNftList.push({
            type: 'dmail',
            token_id: token_identifier,
            id: Number(token_identifier),
            emailName: attrs.alias,
            useing: !!attrs.binding,
            digits: attrs.alias.length,
            points: attrs.points,
            img: attrs.location,
          })
          // console.log('attrs', attrs, this.myNftList)
        })
      } else {
        this.myNftList = []
      }
    } catch (error) {
      console.log(error)
    }
    typeof afterGettedCb === 'function' && await afterGettedCb(this)
    this.gettingNftList = false
    this.sortMyNftList();
  }

  sortMyNftList() {
    const jsList = toJS(this.myNftList);
    jsList.sort(function (a, b) {
      return b.useing - a.useing;
    });
    this.myNftList = jsList;
  }
}
