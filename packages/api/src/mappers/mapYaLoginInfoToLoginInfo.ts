import { UserInfo } from '@homemap/shared';

import { YaLoginInfo } from '../yaClient/model/YaLoginInfo';

export const mapYaLoginInfoToLoginInfo = (yaLogin: YaLoginInfo): UserInfo => {
    return {
        id: yaLogin.id,
        login: yaLogin.login,
    };
};
