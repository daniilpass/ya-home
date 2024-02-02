import { LoginInfo } from '@homemap/shared/index.js';
import { YaLoginInfo } from '../yaClient/model/YaLoginInfo.js';

export const mapYaLoginInfoToLoginInfo = (yaLogin: YaLoginInfo): LoginInfo => {
    return {
        id: yaLogin.id,
        login: yaLogin.login,
    };
};
