"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const fs = require("fs");
/**
 * Cette class donne les fonctions
 * necessaire a l'obtention d'un
 * token d'authentification.
 *
 * La procédure et décrite a cette
 * adresse https://api.real-debrid.com/#device_auth_no_secret
 */
class RealDebridRESTAuth {
    /**
     * Obtient les infos permetant a l'application de s'enregister
     */
    static ObtainAuthData() {
        return new Promise((resolve, reject) => {
            request_promise_native_1.default({
                url: this.base_url + this.url_device,
                qs: { client_id: 'X245A4XAIBGVM', new_credentials: 'yes' },
                json: true
            })
                .then(res => {
                if (res) {
                    resolve(res);
                }
                else {
                    reject('Response was not type of IRDAuthData! Need update ?');
                }
            })
                .catch(err => reject(err));
        });
    }
    /**
     * Automatise la vérification manuel nécéssaire pour enregistrer cette app
     * @param authData Informations d'enregistrement
     * @param authCookie Le cookie de l'utilisateur (le déteneur du comte real debrid)
     * @param deviceName Le nom d'appareille qui vas etre attribuer
     */
    static ByPassUserVerificationEndPoint(authData, authCookie, deviceName = "Node JS App") {
        return new Promise((resolve, reject) => {
            request_promise_native_1.default({
                uri: authData.direct_verification_url,
                method: 'POST',
                form: {
                    action: 'Allow'
                },
                headers: {
                    'Cookie': "auth=H7ZERNCDLDUZRPZUGGVNJ2RIRFXWSZJJ3KADSGA",
                },
                followAllRedirects: true,
            })
                .then(res => {
                return request_promise_native_1.default({
                    uri: authData.direct_verification_url,
                    method: 'POST',
                    form: {
                        deviceName: deviceName,
                        action: 'Set that name'
                    },
                    headers: {
                        'Cookie': "auth=H7ZERNCDLDUZRPZUGGVNJ2RIRFXWSZJJ3KADSGA",
                    },
                    followAllRedirects: true,
                })
                    .then(res => resolve(authData))
                    .catch(reject);
            })
                .catch(reject);
        });
    }
    /**
     * Check si l'app a l'authorisation ou pas de s'enregister
     * @param authData Informations d'enregistrement
     */
    static CheckCredentialsEndpoint(authData) {
        return new Promise((resolve, reject) => {
            request_promise_native_1.default({
                uri: RealDebridRESTAuth.base_url + RealDebridRESTAuth.url_credentials,
                qs: {
                    client_id: RealDebridRESTAuth.clientID,
                    code: authData.device_code
                },
                json: true
            })
                .then(res => {
                authData.client_id = res.client_id;
                authData.client_secret = res.client_secret;
                resolve(authData);
            })
                .catch(reject);
        });
    }
    /**
     * Obtient un token
     * @param authData Informations d'enregistrement
     */
    static ObtainToken(authData) {
        return new Promise((resolve, reject) => {
            request_promise_native_1.default({
                uri: RealDebridRESTAuth.base_url + RealDebridRESTAuth.url_token,
                method: 'POST',
                form: {
                    client_id: authData.client_id,
                    client_secret: authData.client_secret,
                    code: authData.device_code,
                    grant_type: RealDebridRESTAuth.grantType
                },
                json: true
            })
                .then(res => resolve(res))
                .catch(reject);
        });
    }
}
RealDebridRESTAuth.clientID = 'X245A4XAIBGVM';
RealDebridRESTAuth.base_url = 'https://api.real-debrid.com/oauth/v2/';
RealDebridRESTAuth.url_device = 'device/code';
RealDebridRESTAuth.url_credentials = 'device/credentials';
RealDebridRESTAuth.url_token = 'token';
RealDebridRESTAuth.grantType = 'http://oauth.net/grant_type/device/1.0';
exports.RealDebridRESTAuth = RealDebridRESTAuth;
class RealDebridREST {
    constructor(authenticationToken) {
        this.token = authenticationToken;
        this.auth = this.TokenString();
    }
    TokenString() {
        return `${this.token.token_type} ${this.token.access_token}`;
    }
    DisableAccessToken() {
        return new Promise((resolve, reject) => {
            request_promise_native_1.default({
                uri: RealDebridREST.base_url + 'disable_access_token',
                headers: {
                    'Authorization': this.auth
                }
            })
                .then(resolve)
                .catch(reject);
        });
    }
    Time() {
        return new Promise((resolve, reject) => {
            request_promise_native_1.default({
                uri: RealDebridREST.base_url + 'time',
            })
                .then(res => resolve(new Date(res)))
                .catch(reject);
        });
    }
    TimeIso() {
        return new Promise((resolve, reject) => {
            request_promise_native_1.default({
                uri: RealDebridREST.base_url + 'time',
            })
                .then(res => resolve(new Date(res)))
                .catch(reject);
        });
    }
    User() {
        return new Promise((resolve, reject) => {
            request_promise_native_1.default({
                uri: RealDebridREST.base_url + 'user',
                headers: {
                    'Authorization': this.auth
                }
            })
                .then(res => {
                if (res) {
                    resolve(res);
                }
                else {
                    reject('Incompatible with IRDUserInfos');
                }
            })
                .catch(reject);
        });
    }
    UnrestrictCheck(link, password) {
        return new Promise((resolve, reject) => {
            request_promise_native_1.default({
                uri: RealDebridREST.base_url + 'unrestrict/check',
                method: 'POST',
                form: {
                    link: link,
                    password: password
                },
                headers: {
                    'Authorization': this.auth
                },
                json: true
            })
                .then(res => {
                if (res) {
                    resolve(res);
                }
                else {
                    reject('Incompatible with IDRUnrestrictCheck');
                }
            })
                .catch(reject);
        });
    }
    UnrestrictLink(link, password, remote) {
        return new Promise((resolve, reject) => {
            request_promise_native_1.default({
                uri: RealDebridREST.base_url + 'unrestrict/link',
                method: 'POST',
                form: {
                    link: link,
                    password: password,
                    remote: remote
                },
                headers: {
                    'Authorization': this.auth
                },
                json: true
            })
                .then(res => {
                if (res) {
                    resolve(res);
                }
                else {
                    reject('Incompatible with IDRUnrestrictLink');
                }
            })
                .catch(reject);
        });
    }
    UnrestrictFolder(link) {
        return new Promise((resolve, reject) => {
            request_promise_native_1.default({
                uri: RealDebridREST.base_url + 'unrestrict/folder',
                method: 'POST',
                form: {
                    link: link
                },
                headers: {
                    'Authorization': this.auth
                },
                json: true
            })
                .then(res => {
                if (res) {
                    resolve(res);
                }
                else {
                    reject('Incompatible with String[]');
                }
            })
                .catch(reject);
        });
    }
    UnrestrictConainerFile(path) {
        return new Promise((resolve, reject) => {
            let option = {
                mehtod: 'PUT',
                uri: RealDebridREST.base_url + 'unrestrict/containerFile',
                formData: {
                    file: {
                        value: fs.createReadStream(path),
                        option: {
                            filename: path
                        }
                    }
                },
                headers: {
                    'Authorization': this.auth,
                },
                json: true
            };
            request_promise_native_1.default(option)
                .then(res => {
                if (res) {
                    resolve(res);
                }
                else {
                    reject('Incompatible with string[]');
                }
            })
                .catch(reject);
        });
    }
}
RealDebridREST.base_url = 'https://api.real-debrid.com/rest/1.0/';
RealDebridRESTAuth.ObtainAuthData()
    .then(authData => RealDebridRESTAuth.ByPassUserVerificationEndPoint(authData, 'H7ZERNCDLDUZRPZUGGVNJ2RIRFXWSZJJ3KADSGA'))
    .then(RealDebridRESTAuth.CheckCredentialsEndpoint)
    .then(RealDebridRESTAuth.ObtainToken)
    .then(authToken => {
    let rd = new RealDebridREST(authToken);
    console.log('Time');
    rd.Time()
        .then((r) => {
        console.log(`result ${r}`);
        console.log('Test Time Iso');
        return rd.TimeIso();
    })
        .then((r) => {
        console.log(`result ${r}`);
        console.log('Test UnrestrictCheck');
        return rd.UnrestrictCheck('https://1fichier.com/?aliiga1j185z63derxjo&af=22123');
    })
        .then((r) => {
        console.log(r);
    });
})
    .catch(err => console.log(err));
