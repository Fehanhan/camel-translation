import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator';
import { window , workspace } from "vscode";
// const bing = new GoogleTranslator();
const google = new GoogleTranslator();
const { translate } = require('bing-translate-api');
const googleCN = require('google-translate-api-cn');

// eslint-disable-next-line @typescript-eslint/naming-convention
const BaiDuKey = workspace.getConfiguration("camelTranslation").BaiDuKey;
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaiDuSecret = workspace.getConfiguration("camelTranslation").BaiDuSecret;
const baiduTranslate = require('baidu-translate')(BaiDuKey, BaiDuSecret);

// eslint-disable-next-line @typescript-eslint/naming-convention
const Youdao = require("youdao-fanyi");
// eslint-disable-next-line @typescript-eslint/naming-convention
const YouDaoKey = workspace.getConfiguration("camelTranslation").YouDaoKey;
// eslint-disable-next-line @typescript-eslint/naming-convention
const YouDaoSecret = workspace.getConfiguration("camelTranslation").YouDaoSecret;

export enum EengineType {
  google = "google",
  bing = "bing",
  baidu = "baidu",
  youdao = "youdao",
  googleCN = "googleCN"
}
const engineType = {
  google: async (src: string, { to }: { to: any }) => {
    const res = await google.translate(src, 'auto', to);
    return { text: res };
  },
  bing: async (src: string, { to }: { to: any }) => {
    const res = await translate(src, null, to, true);
    return { text: res.translation };
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  baidu: async (src: string, { to }: { to: any }) => {
    const res = await baiduTranslate(src);
    if (res.error_msg){
      // eslint-disable-next-line no-throw-literal
      throw `请检查配置 ${res.error_msg}`;
    }
    return { text: res.trans_result[0].dst };
  },
  youdao: async (src: string, { to }: { to: any }) => {
    if (!YouDaoKey){
      // eslint-disable-next-line no-throw-literal
      throw '请先配置有道应用ID';
    }
    if (!YouDaoSecret) {
      // eslint-disable-next-line no-throw-literal
      throw '请先配置有道应用秘钥';
    }
    const yd = Youdao({
      appkey: YouDaoKey,
      secret: YouDaoSecret,
    });
    const res = await yd(src);
    if (res.errorCode !== '0'){
      // eslint-disable-next-line no-throw-literal
      throw `错误码： ${res.errorCode}`;
    }
    return { text: res.translation[0] };
  },
  googleCN: async (src: string, { to }: { to: any }) => {
    const res = await googleCN(src, { to: to });
    return { text: res.text };
  }
};
export default engineType;
