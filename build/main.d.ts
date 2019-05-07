export interface IRDAuthData {
    device_code: string;
    user_code: string;
    interval: number;
    expires_in: number;
    verification_url: string;
    direct_verification_url: string;
    client_id?: string;
    client_secret?: string;
}
export interface IRDAuthToken {
    access_token: string;
    expires_in: number;
    token_type: string;
    refresh_token: string;
}
export interface IRDUserInfos {
    id: number;
    username: string;
    email: string;
    points: number;
    locale: string;
    avatar: string;
    type: string;
    premium: number;
    expiration: string;
}
export interface IRDUnrestrictCheck {
    host: string;
    link: string;
    filename: string;
    filesize: string;
    supported: number;
}
export interface IRDUnrestrictLinkAlternative {
    id: string;
    filename: string;
    download: string;
    type: string;
}
export interface IRDUnrestrictLink {
    id: string;
    filename: string;
    mimeType: string;
    filesize: number;
    link: string;
    host: string;
    chunks: string;
    crc: number;
    download: string;
    streamable: number;
    alternative: IRDUnrestrictLinkAlternative[];
}
export interface IRDTrafficData {
    left: number;
    bytes: number;
    links: number;
    limit: number;
    type: string;
    extra: number;
    reset: string;
}
export interface IRDTraffic {
    [index: string]: IRDTrafficData;
}
export interface IRDTrafficDetailsHostData {
    [index: string]: number;
}
export interface IRDTrafficDetailsHost {
    host: IRDTrafficDetailsHostData;
    bytes: number;
}
export interface IRDTrafficDetails {
    [index: string]: IRDTrafficDetailsHost;
}
export interface IRDStreamingQuality {
    [index: string]: string;
}
export interface IRDStreaming {
    apple: IRDStreamingQuality;
    dash: IRDStreamingQuality;
    liveMP4: IRDStreamingQuality;
    h264WebM: IRDStreamingQuality;
}
export interface IRDStreamingMediaInfosDetailsVideoData {
    stream: string;
    lang: string;
    lang_iso: string;
    codec: string;
    colorspace: string;
    width: number;
    height: number;
}
export interface IRDStreamingMediaInfosDetailsVideo {
    [index: string]: IRDStreamingMediaInfosDetailsVideoData;
}
export interface IRDStreamingMediaInfosDetailsAudioData {
    stream: string;
    lang: string;
    lang_iso: string;
    codec: string;
    sampling: number;
    channels: number;
}
export interface IRDStreamingMediaInfosDetailsAudio {
    [index: string]: IRDStreamingMediaInfosDetailsAudioData;
}
export interface IRDStreamingMediaInfosDetailsSubtitlesData {
    stream: string;
    lang: string;
    lang_iso: string;
    type: string;
}
export interface IRDStreamingMediaInfosDetailsSubtitles {
    [index: string]: IRDStreamingMediaInfosDetailsSubtitlesData;
}
export interface IRDStreamingMediaInfosDetails {
    video: IRDStreamingMediaInfosDetailsVideo;
    audio: IRDStreamingMediaInfosDetailsAudio;
    subtitles: IRDStreamingMediaInfosDetailsSubtitles[];
}
export interface IRDStreamingMediaInfos {
    filename: string;
    hoster: string;
    link: string;
    type: string;
    season: string;
    episode: string;
    year: string;
    duration: number;
    bitrate: number;
    size: number;
    details: IRDStreamingMediaInfosDetails;
    poster_path: string;
    audio_image: string;
    backdrop_path: string;
}
/**
 * Cette class donne les fonctions
 * necessaire a l'obtention d'un
 * token d'authentification.
 *
 * La procédure et décrite a cette
 * adresse https://api.real-debrid.com/#device_auth_no_secret
 */
export declare class RealDebridRESTAuth {
    private static readonly clientID;
    private static readonly base_url;
    private static readonly url_device;
    private static readonly url_credentials;
    private static readonly url_token;
    private static readonly grantType;
    /**
     * Obtient les infos permetant a l'application de s'enregister
     */
    static ObtainAuthData(): Promise<IRDAuthData>;
    /**
     * Automatise la vérification manuel nécéssaire pour enregistrer cette app
     * @param authData Informations d'enregistrement
     * @param authCookie Le cookie de l'utilisateur (le déteneur du comte real debrid)
     * @param deviceName Le nom d'appareille qui vas etre attribuer
     */
    static ByPassUserVerificationEndPoint(authData: IRDAuthData, authCookie: string, deviceName?: string): Promise<IRDAuthData>;
    /**
     * Check si l'app a l'authorisation ou pas de s'enregister
     * @param authData Informations d'enregistrement
     */
    static CheckCredentialsEndpoint(authData: IRDAuthData): Promise<IRDAuthData>;
    /**
     * Obtient un token
     * @param authData Informations d'enregistrement
     */
    static ObtainToken(authData: IRDAuthData): Promise<IRDAuthToken>;
}
export declare class RealDebridREST {
    private static readonly base_url;
    private token;
    private auth;
    constructor(authenticationToken: IRDAuthToken);
    private TokenString;
    DisableAccessToken(): Promise<void>;
    Time(): Promise<Date>;
    TimeIso(): Promise<Date>;
    User(): Promise<IRDUserInfos>;
    UnrestrictCheck(link: string, password?: string): Promise<IRDUnrestrictCheck>;
    UnrestrictLink(link: string, password?: string, remote?: number): Promise<IRDUnrestrictLink>;
    UnrestrictFolder(link: string): Promise<string[]>;
    UnrestrictConainerFile(path: string, filename: string): Promise<string[]>;
    Traffic(): Promise<IRDTraffic>;
    TrafficDetails(start: Date, end: Date): Promise<IRDTrafficDetails>;
    StreamingTranscode(id: string): Promise<IRDStreaming>;
    StreamingMediaInfos(id: string): Promise<IRDStreamingMediaInfos>;
}
