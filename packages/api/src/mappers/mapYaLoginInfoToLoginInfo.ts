import { LoginInfo } from '@homemap/shared';
import { YaLoginInfo } from '../yaClient/model/YaLoginInfo';

export const mapYaLoginInfoToLoginInfo = (yaLogin: YaLoginInfo): LoginInfo => {
    return {
        id: yaLogin.id,
        login: yaLogin.login,
    };
};
