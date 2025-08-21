import { Log, UserManager } from 'oidc-client';

import config from '../config';

export class AuthService {
    constructor() {
        const settings = {
            authority: config.mattrStsAuthority,
            client_id: config.mattrClientId,
            redirect_uri: `${config.mattrClientRoot}signin-callback.html`,
            silent_redirect_uri: `${config.mattrClientRoot}silent-renew.html`,            
            post_logout_redirect_uri: `${config.mattrClientRoot}`,
            response_type: 'code',
            prompt: 'login',
            scope: 'openid ' + config.mattrClientScope,
        };
        this.userManager = new UserManager(settings);
        Log.logger = console;
        Log.level = Log.INFO;
    }
    getUser() {
        return this.userManager.getUser();
    }
    login() {
        return this.userManager.signinRedirect();
    }
    renewToken() {
        return this.userManager.signinSilent();
    }
    logout() {
        return this.userManager.signoutRedirect();
    }
}
