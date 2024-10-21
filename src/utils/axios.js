import axios from "axios";
import { userInfoStorage, userInfoKeys, clearStorage } from "@/utils/storage";
import Message from "@/components/Message/index";
import { getLoginUrlWithReturnParams } from "@/utils/index";

// repeat requery when offline or http error
export const fixedQuery = (queryFn, isQueryCorrectFn, times = 3, interval = 800) => {
  if (typeof queryFn !== 'function' || typeof isQueryCorrectFn !== 'function') {
    throw new Error('FixedQuery function args type error');
  }

  let index = 1
  const fn = async (...args) => {
    const res = await queryFn(...args)
    if (isQueryCorrectFn(res) || index >= times) {
      index = 1
      return res
    } else {
      index++
      await new Promise(resolve => setTimeout(resolve, interval))
      return fn(...args)
    }
  }

  return fn
}

export const baseURL = import.meta.env.PROD || import.meta.env.VITE_REQUEST_TYPE === "production"
  ? "https://icp.dmail.ai"
    : "https://testmail.dmail.ai";
export const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.defaults.timeout = 120000;

export const cache = {
  tokenGetted: false,
  pid: userInfoStorage.get(userInfoKeys[0]) || undefined,
  enpid: userInfoStorage.get(userInfoKeys[5]) || undefined,
};

const detectTokenGetted = async () => {
  if (cache.tokenGetted) {
    return
  }
  await new Promise((resolve) => setTimeout(resolve, 200));
  return await detectTokenGetted();
};

axiosInstance.interceptors.request.use(
  async (config) => {
    // Do something before request is sent
    if (cache.pid === undefined) {
      cache.pid = userInfoStorage.get(userInfoKeys[0]) || undefined;
    }

    if (cache.enpid === undefined) {
      cache.enpid = userInfoStorage.get(userInfoKeys[5]) || undefined;
    }

    if (cache.pid && cache.enpid && config.headers) {
      config.headers["dm-pid"] = cache.pid;
      config.headers["dm-encstring"] = cache.enpid;
    }
    
    if (config.headers && config.headers.ignoreToken) {
      delete config.headers.ignoreToken
      return config
    }
    if (!cache.enpid && !cache.tokenGetted && !config.headers.ignoreToken) {
      await detectTokenGetted()
      config.headers["dm-pid"] = cache.pid || userInfoStorage.get(userInfoKeys[0]);
      config.headers["dm-encstring"] = cache.enpid || userInfoStorage.get(userInfoKeys[5]);
    }

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    const code = res.data.code;
    // failed -2; expired -1
    // if ((code == -1 || code == -2) && import.meta.env.PROD) {
    if ((code == -1 || code == -2)) {
    // if ((code == -1 || code == -2) && 1) {
      Message.warn("Login status is disabled");
      clearStorage();
      setTimeout(() => {
        window.location.href = getLoginUrlWithReturnParams();
      }, 500);
    } else if (code === 0) {
      // Message.error(res.data.msg || "Request error");
    }
    return res;
  },
  (error) => {
    if (error.code == "ECONNABORTED" && error.message.includes("15000ms")) {
      return Promise.reject(error);
    }

    if (error.code == "ECONNABORTED") {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default function (config) {
  if (config.errorTitle) {
    if (!config.transformResponse) {
      config.transformResponse = [];
    }
    Array.isArray(config.transformResponse) &&
      config.transformResponse.push((data) => ({
        ...JSON.parse(data),
        errorTitle: config.errorTitle,
      }));
  }

  return axiosInstance(config).catch(function (res) {
    return res;
  });
}
