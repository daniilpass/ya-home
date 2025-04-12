import type { UserInfo } from '@homemap/shared';

import type { YaLoginInfo } from '../yaClient/model/YaLoginInfo';

export const mapYaLoginInfoToLoginInfo = (yaLogin: YaLoginInfo): UserInfo => {
    return {
        id: yaLogin.id,
        login: yaLogin.login,
    };
};
