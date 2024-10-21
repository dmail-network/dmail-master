import Modal from "@/components/Modal/index";
import Message from "@/components/Message/index";
import { getDidChain } from "@/utils/did";
import dayjs from 'dayjs'  
import isToday from 'dayjs/plugin/isToday'
import UserAva from "@/static/images/avatar.png";

dayjs.extend(isToday)

// console.log('current', dayjs(new Date().getTime()).isToday(), dayjs(new Date().getTime())) 
//   console.log('-24', dayjs(1675592160957).isToday(), dayjs(1675592160957)) 
//   console.log('-18', dayjs(1675613760957).isToday(), dayjs(1675613760957)) 
//   console.log('-19', dayjs(1675610160957).isToday(), dayjs(1675610160957)) 

export const commonErrorText = 'Something unexpected went wrong. Please try again.'
export const networkErrorText = 'Network error. Please check your internet connection and try again.'
export const num10to16 = (chainId) => `0x${chainId.toString(16)}`
export const defaultAva = UserAva
export const isFirefox = navigator.userAgent.toLowerCase().includes('firefox')
export const isMobileFn = () => /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
const isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;
export const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

if (isFirefox && window.BigInt) {
  window.BigInt.prototype.toJSON = function() { return this.toString() }
}

// console.log('import.meta.env.MODE', import.meta.env.MODE, import.meta.env.PROD, import.meta.env.VITE_REQUEST_TYPE)
export const host = import.meta.env.VITE_PAGE_HOST
export const Dmail = "Dmail";
export const dmailAi = "@dmail.ai";
export const currentMaxDmailNftLen = 11
export const isPrincipalIdFn = (id) =>
  /^([a-z0-9]{5}\-){10}[a-z0-9]{3}$/g.test(id);
export const isDmailFn = (str) => /^[^@]+@dmail.ai$/.test(str);
export const isDefaultAlias = (str) => isDmailFn(str) && str.replace(dmailAi, '').length > currentMaxDmailNftLen
export const isEmailFn = (str) => /^[0-9a-zA-Z_.\-/+]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/.test(str);
export const getAliasFn = (alias) => {
  if (!alias) {
    return ''
  }
  return isEmailFn(alias) || !!getDidChain(alias) ? alias : `${alias}${dmailAi}` 
}
export const scrollIntoViewKey = document.body.scrollIntoViewIfNeeded
  ? "scrollIntoViewIfNeeded"
  : document.body.scrollIntoView
  ? "scrollIntoView"
  : "";
export const isLoginPage = () => {
  return !!["/login", "/dlogin", "/alogin"].filter((path) => window.location.pathname.indexOf(path) === 0).length
}

export const getPosToParent = (parent, sub, isTop = false) => {
  const parentClient = parent.getBoundingClientRect();
  const subClient = sub.getBoundingClientRect();
  return parseInt(
    subClient[isTop ? "top" : "left"] - parentClient[isTop ? "top" : "left"]
  );
};

export const deduplication = (arr) => Array.from(new Set(arr));

export const remainDecimalByString = (num, digits = 2) => {
  if (!/^[0-9]+.?[0-9]*$/.test(num + "")) {
    return num;
  }
  const n = Math.pow(10, digits);
  return Math.round(+num * n) / n;
};

export const throttle = (fn, wait = 300) => {
  var timer = null;
  return function () {
    var context = this;
    var args = arguments;
    if (!timer) {
      timer = setTimeout(function () {
        fn.apply(context, args);
        timer = null;
      }, wait);
    }
  };
};

export const getQueryString = (name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
      return decodeURIComponent(r[2]);
  };
  return '';
}

// export const getSearchValueByKey = (key) => {
//   const search = window.location.search.replace('?', '')
//   const aSearch = search.split('&')
//   if (!aSearch.length) {
//     return ''
//   }
//   const oSearch = aSearch.reduce((res, str) => {
//     const arr = str.split('=')
//     if (arr.length > 1) {
//       res[arr[0]] = arr[1]
//     }
//     return res
//   }, {})
//   return key in oSearch ? oSearch[key] : ''
// }

export const shortHost = link => {
  return link.replace(/\/\/(.*)\.app/, (a, b, c) => {
    return `//${b.substring(0, 5)}...`
  })
}

export const getRandomInInterval = (min, max, isInt = true) => {
  const num = Math.random() * (max - min) + min
  return isInt ? Math.round(num) : num
}

export const shortPrincipalId = (principalId, isPid = true) => {
  return principalId.slice(0, isPid ? 9 : 5) + "****" + principalId.slice(isPid ? -6 : -5);
};

const extraNum = 1000000
export const timeConverter = (UNIX_timestamp) => {
  var time = new Date(Math.floor(UNIX_timestamp / extraNum));
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = time.getFullYear();
  var month = months[time.getMonth()];
  var date = ("0" + time.getDate()).substr(-2);
  var hour = ("0" + time.getHours()).substr(-2);
  var min = ("0" + time.getMinutes()).substr(-2);
  var sec = ("0" + time.getSeconds()).substr(-2);
  return date + " " + month + " " + hour + ":" + min + ":" + sec;
};

const getTwoDigitsNum = (num) => ("0" + num).substr(-2);

export const dateConverter = (UNIX_timestamp) => {
  const date = dayjs(new Date(Math.floor(UNIX_timestamp / extraNum)));
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = date.year()
  const month = date.month()
  const day = date.date()
  const hour = date.hour()
  const minute = date.minute()
  const AMPM = date.format('A')
  if (dayjs(date).isToday()) {
    return `${getTwoDigitsNum(hour)}:${getTwoDigitsNum(minute)} ${AMPM}`
  }
  if (dayjs(date).diff(dayjs().startOf('months')) > 0) {
    return `${months[month]} ${getTwoDigitsNum(day)}`
  }
  return `${year}/${getTwoDigitsNum(month+1)}/${getTwoDigitsNum(day)}`
};

export const con = (str, prefix = 5, suffix = 8, replaceText = '***') => {
  if (!str) return;
  let n = str.split("");
  return n.slice(0, prefix).join("") + replaceText + n.slice(-suffix).join("");
};

export const remainDecimal = (num, digits = 2) => {
  const n = Math.pow(10, digits);
  return Math.round(+num * n) / n;
};

export const getFileSize = (num, returnArray) => {
  const size = Number(num);
  let result = 0;
  let unit = "B";
  if (size / (1024 * 1024 * 1024) > 1) {
    result = remainDecimal(size / 1024 / 1024 / 1024);
    unit = "GB";
  } else if (size / (1024 * 1024) > 1) {
    result = remainDecimal(size / 1024 / 1024);
    unit = "MB";
  } else if (size / 1024 > 1) {
    result = remainDecimal(size / 1024);
    unit = "KB";
  } else {
    result = remainDecimal(size, 4);
    unit = "B";
  }
  return returnArray ? [result, unit] : `${result}${unit}`;
};

// export const bindNftDialog = (hasNfts, history, channelId = 0) => {
//   const fn = history && history.push ? (path) => history.push(path) : (path) => { window.location.href = path };
//   const cb = hasNfts ? () => fn(channelId ? `/setting/account/${channelId}` : "/setting/account") : () => fn("/presale");
//   const content = hasNfts ? `Before sending emails,you should bind an NFT Domain Account with Dmail. <br />Detected that you have an existing NFT Domain Account,please complete the binding as soon as possible.` : `Before sending emails, please bind an NFT Domain Account with Dmail. You can purchase an NFT Doman Account in pre-sale and complete the binding.`
//   const isMobile = isMobileFn()
//   Modal({
//     isMobile,
//     type: "",
//     title: "Please bind an NFT Domain Account!",
//     content,
//     okText: hasNfts ? "Binding" : "Buy NFT",
//     noCancel: true,
//     onOk: async () => {
//       cb();
//       return true;
//     },
//   });
// };

export const copyFromDomText = (dom) => {};

export const copyTextToClipboard = (text, successText) => {
  // console.log('navigator.clipboard', navigator.clipboard)
  if (isAndroid || !navigator.clipboard) {
    const success = fallbackCopyTextToClipboard(text);
    const msg = success ? successText || "Copied!" : "Copy failed";
    Message[success ? "success" : "error"](msg);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      Message.success(successText || "Copied!");
    },
    function (err) {
      Message.error("Copy failed");
    }
  );
};

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let success = false;
  try {
    const successful = document.execCommand("copy");
    if (successful) {
      success = true;
    }
  } catch (err) {
    success = false;
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
  return success;
}

Date.prototype.Format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  }
  return fmt
}

export function formatTimeToStr(times, pattern) {
  var d = new Date(times).Format('yyyy-MM-dd hh:mm:ss')
  if (pattern) {
    d = new Date(times).Format(pattern)
  }
  return d.toLocaleString()
}

export const getLoginUrlWithReturnParams = () => {
  const sPath = window.location.pathname
  const sSearch = window.location.search
  const search = sPath && sPath.replace('/', '') && !sPath.includes('login') ? `?path=${encodeURIComponent(sPath + sSearch)}` : ''
  return `/login${search}`
}
