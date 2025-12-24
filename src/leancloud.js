import AV from 'leancloud-storage';

// LeanCloud 配置信息（公共读写场景，不使用 MasterKey）
const appId = 'cnkoNGMFumAlUcsRPkgAeDNr-MdYXbMMI';
const appKey = 'dl4CexS0VjL94lslmxy6IGnI';
const serverURL = 'https://cnkongmf.api.lncldglobal.com';

if (!AV.applicationId) {
  AV.init({
    appId,
    appKey,
    serverURL
  });
}

export default AV;

