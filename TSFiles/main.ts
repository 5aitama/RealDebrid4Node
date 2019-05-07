import rp from "request-promise-native";
import fs = require('fs')
import moment = require("moment");

export interface IRDAuthData {
    device_code             : string
    user_code               : string
    interval                : number
    expires_in              : number
    verification_url        : string
    direct_verification_url : string
    client_id               ?: string
    client_secret           ?: string
}

export interface IRDAuthToken {
    access_token    : string,
    expires_in      : number,
    token_type      : string,
    refresh_token   : string
}

export interface IRDUserInfos {
    id          : number,
    username    : string,
    email       : string,
    points      : number,
    locale      : string,
    avatar      : string,
    type        : string,
    premium     : number,
    expiration  : string
}

export interface IRDUnrestrictCheck {
    host        : string,
    link        : string,
    filename    : string,
    filesize    : string
    supported   : number
}

export interface IRDUnrestrictLinkAlternative {
    id          : string,
    filename    : string,
    download    : string,
    type        : string
}

export interface IRDUnrestrictLink {
    id          : string
    filename    : string
    mimeType    : string
    filesize    : number
    link        : string
    host        : string
    chunks      : string
    crc         : number
    download    : string
    streamable  : number
    alternative : IRDUnrestrictLinkAlternative[]
}

export interface IRDTrafficData {
    left    : number
    bytes   : number
    links   : number
    limit   : number
    type    : string
    extra   : number
    reset   : string
}

export interface IRDTraffic {
    [index: string] : IRDTrafficData
}

export interface IRDTrafficDetailsHostData {
    [index: string] : number
}

export interface IRDTrafficDetailsHost {
    host    : IRDTrafficDetailsHostData
    bytes   : number
}

export interface IRDTrafficDetails {
    [index: string] : IRDTrafficDetailsHost
}

export interface IRDStreamingQuality {
    [index: string]: string
}

export interface IRDStreaming {
    apple       : IRDStreamingQuality
    dash        : IRDStreamingQuality
    liveMP4     : IRDStreamingQuality
    h264WebM    : IRDStreamingQuality
}

export interface IRDStreamingMediaInfosDetailsVideoData {
    stream      : string
    lang        : string
    lang_iso    : string
    codec       : string
    colorspace  : string
    width       : number
    height      : number
}

export interface IRDStreamingMediaInfosDetailsVideo {
    [index: string] : IRDStreamingMediaInfosDetailsVideoData
}

export interface IRDStreamingMediaInfosDetailsAudioData {
    stream      : string
    lang        : string
    lang_iso    : string
    codec       : string
    sampling    : number
    channels    : number
}

export interface IRDStreamingMediaInfosDetailsAudio {
    [index: string] : IRDStreamingMediaInfosDetailsAudioData
}

export interface IRDStreamingMediaInfosDetailsSubtitlesData {
    stream      : string
    lang        : string
    lang_iso    : string
    type        : string
}

export interface IRDStreamingMediaInfosDetailsSubtitles {
    [index: string] : IRDStreamingMediaInfosDetailsSubtitlesData
}

export interface IRDStreamingMediaInfosDetails {
    video       : IRDStreamingMediaInfosDetailsVideo
    audio       : IRDStreamingMediaInfosDetailsAudio
    subtitles   : IRDStreamingMediaInfosDetailsSubtitles[]
}

export interface IRDStreamingMediaInfos {
    filename        : string
    hoster          : string
    link            : string
    type            : string
    season          : string
    episode         : string
    year            : string
    duration        : number
    bitrate         : number
    size            : number 
    details         : IRDStreamingMediaInfosDetails
    poster_path     : string
    audio_image     : string
    backdrop_path   : string
}

/**
 * Cette class donne les fonctions
 * necessaire a l'obtention d'un
 * token d'authentification.
 * 
 * La procédure et décrite a cette
 * adresse https://api.real-debrid.com/#device_auth_no_secret
 */
export class RealDebridRESTAuth {

    private static readonly clientID           = 'X245A4XAIBGVM'
    private static readonly base_url           = 'https://api.real-debrid.com/oauth/v2'
    private static readonly url_device         = '/device/code'
    private static readonly url_credentials    = '/device/credentials'
    private static readonly url_token          = '/token'
    private static readonly grantType          = 'http://oauth.net/grant_type/device/1.0'
    
    /**
     * Obtient les infos permetant a l'application de s'enregister
     */
    public static ObtainAuthData() : Promise<IRDAuthData> {
        return new Promise<IRDAuthData>((resolve, reject) => {
            rp({
                url: this.base_url + this.url_device,
                qs: { client_id: 'X245A4XAIBGVM', new_credentials: 'yes' },
                json: true
            })
            .then(res => {
                if(res as IRDAuthData) {
                    resolve(<IRDAuthData>res)
                } else {
                    reject('Response was not type of IRDAuthData! Need update ?')
                }
            })
            .catch(err => reject(err))
        })
    }

    /**
     * Automatise la vérification manuel nécéssaire pour enregistrer cette app
     * @param authData Informations d'enregistrement
     * @param authCookie Le cookie de l'utilisateur (le déteneur du comte real debrid)
     * @param deviceName Le nom d'appareille qui vas etre attribuer
     */
    public static ByPassUserVerificationEndPoint(authData: IRDAuthData, authCookie: string, deviceName: string = "Node JS App") {
        return new Promise<IRDAuthData>((resolve, reject) => {
            rp({
                uri: authData.direct_verification_url,
                method: 'POST',
                form: {
                    action: 'Allow'
                },
                headers: {
                    'Cookie': `auth=${authCookie}`,
                },
                followAllRedirects: true,
            })
            .then(res => {
                return rp({
                    uri: authData.direct_verification_url,
                    method: 'POST',
                    form: {
                        deviceName: deviceName,
                        action: 'Set that name'
                    },
                    headers: {
                        'Cookie': `auth=${authCookie}`,
                    },
                    followAllRedirects: true,
                })
                .then(res => resolve(authData))
                .catch(reject)
            })
            .catch(reject)
        })
    }

    /**
     * Check si l'app a l'authorisation ou pas de s'enregister
     * @param authData Informations d'enregistrement
     */
    public static CheckCredentialsEndpoint(authData: IRDAuthData) {
        return new Promise<IRDAuthData>((resolve, reject) => {
            rp({
                uri: RealDebridRESTAuth.base_url + RealDebridRESTAuth.url_credentials,
                qs: {
                    client_id: RealDebridRESTAuth.clientID,
                    code: authData.device_code
                },
                json: true
            })
            .then(res => {
                authData.client_id = res.client_id
                authData.client_secret = res.client_secret
                resolve(authData)
            })
            .catch(reject)
        })
    }

    /**
     * Obtient un token
     * @param authData Informations d'enregistrement
     */
    public static ObtainToken(authData: IRDAuthData) {
        return new Promise<IRDAuthToken>((resolve, reject) => {
            rp({
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
            .then(res => resolve(<IRDAuthToken>res))
            .catch(reject)
        })
    }
}

export class RealDebridREST {
    private static readonly base_url : string = 'https://api.real-debrid.com/rest/1.0/'
    
    private token : IRDAuthToken
    private auth: string

    constructor(authenticationToken: IRDAuthToken) {
        this.token = authenticationToken
        this.auth = this.TokenString()
    }

    private TokenString() {
        return `${this.token.token_type} ${this.token.access_token}`
    }

    public DisableAccessToken() : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            rp({
                uri: RealDebridREST.base_url + 'disable_access_token', 
                headers: {
                    'Authorization': this.auth
                }
            })
            .then(resolve)
            .catch(reject)
        })
    }

    public Time() {
        return new Promise<Date>((resolve, reject) => {
            rp({
                uri: RealDebridREST.base_url + 'time', 
            })
            .then(res => resolve(new Date(res)))
            .catch(reject)
        })
    }

    public TimeIso() {
        return new Promise<Date>((resolve, reject) => {
            rp({
                uri: RealDebridREST.base_url + 'time', 
            })
            .then(res => resolve(new Date(res)))
            .catch(reject)
        })
    }

    public User() {
        return new Promise<IRDUserInfos>((resolve, reject) => {
            rp({
                uri: RealDebridREST.base_url + 'user',
                headers: {
                    'Authorization': this.auth
                }
            })
            .then(res => { 
                if(res as IRDUserInfos) {
                    resolve(<IRDUserInfos>res)
                } else {
                    reject('Incompatible with IRDUserInfos')
                }
            })
            .catch(reject)
        })
    }

    public UnrestrictCheck(link: string, password ?: string) {
        return new Promise<IRDUnrestrictCheck>((resolve, reject) => {
            rp({
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
                if(res as IRDUnrestrictCheck) {
                    resolve(<IRDUnrestrictCheck>res)
                } else {
                    reject('Incompatible with IDRUnrestrictCheck')
                }
            })
            .catch(reject)
        })
    }

    public UnrestrictLink(link: string, password ?: string, remote ?: number) {
        return new Promise<IRDUnrestrictLink>((resolve, reject) => {
            rp({
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
                if(res as IRDUnrestrictLink) {
                    resolve(<IRDUnrestrictLink>res)
                } else {
                    reject('Incompatible with IDRUnrestrictLink')
                }
            })
            .catch(reject)
        })
    }

    public UnrestrictFolder(link: string) {
        return new Promise<string[]>((resolve, reject) => {
            rp({
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
                if(res as string[]) {
                    resolve(<string[]>res)
                } else {
                    reject('Incompatible with String[]')
                }
            })
            .catch(reject)
        })
    }

    public UnrestrictConainerFile(path: string, filename: string) {
        return new Promise<string[]>((resolve, reject) => {
            let option = {
                mehtod: 'PUT',
                uri: RealDebridREST.base_url + 'unrestrict/containerFile',
                formData: {
                    file: {
                        value: fs.createReadStream(path),
                        option: {
                            filename: filename
                        }
                    }
                },
                headers: {
                    'Authorization': this.auth,
                },
                json: true
            }
            rp(option)
            .then(res => { 
                if(res as string[]) {
                    resolve(<string[]>res)
                } else {
                    reject('Incompatible with string[]')
                }
            })
            .catch(reject)
        })
    }

    public Traffic() {
        return new Promise<IRDTraffic>((resolve, reject) => {
            rp({
                uri: RealDebridREST.base_url + 'traffic',
                headers: {
                    'Authorization': this.auth
                },
                json: true
            })
            .then(res => { 
                resolve(<IRDTraffic>res)
            })
            .catch(reject)
        })
    }

    public TrafficDetails(start: Date, end: Date) {
        return new Promise<IRDTrafficDetails>((resolve, reject) => {
            rp({
                uri: RealDebridREST.base_url + 'traffic/details',
                headers: {
                    'Authorization': this.auth
                },
                qs: {
                    start: moment(start).format('YYYY-MM-DD'),
                    end: moment(end).format('YYYY-MM-DD')
                },
                json: true
            })
            .then(res => { 
                resolve(<IRDTrafficDetails>res)
            })
            .catch(reject)
        })
    }

    public StreamingTranscode(id: string) {
        return new Promise<IRDStreaming>((resolve, reject) => {
            rp({
                uri: RealDebridREST.base_url + `streaming/transcode/${id}`,
                headers: {
                    'Authorization': this.auth
                },
                json: true
            })
            .then(res => { 
                resolve(<IRDStreaming>res)
            })
            .catch(reject)
        })
    }

    public StreamingMediaInfos(id: string) {
        return new Promise<IRDStreamingMediaInfos>((resolve, reject) => {
            rp({
                uri: RealDebridREST.base_url + `streaming/mediaInfos/${id}`,
                headers: {
                    'Authorization': this.auth
                },
                json: true
            })
            .then(res => { 
                resolve(<IRDStreamingMediaInfos>res)
            })
            .catch(reject)
        })
    }
}