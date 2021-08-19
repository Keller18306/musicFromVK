export const PERSISTENT_ID_VERSION_OLD = 2;
export const PERSISTENT_ID_VERSION_MAP = 3;
export const PERSISTENT_ID_VERSION = 4;

export enum FileType {
    Thumbnail,
    ProfilePhoto,
    Photo,
    VoiceNote,
    Video,
    Document,
    Encrypted,
    Temp,
    Sticker,
    Audio,
    Animation,
    EncryptedThumbnail,
    Wallpaper,
    VideoNote,
    SecureRaw,
    Secure,
    Background,
    DocumentAsFile,
    Size,
    None
};

export const typesNames: string[] = [
    'thumbnail',
    'profilePhoto',
    'photo',
    'voiceNote',
    'video',
    'document',
    'encrypted',
    'temp',
    'sticker',
    'audio',
    'animation',
    'encryptedThumbnail',
    'wallpaper',
    'videoNote',
    'secureRaw',
    'secure',
    'background',
    'documentAsFile',
    'size',
    'none'
]

export const WEB_LOCATION_FLAG =  1 << 24;
export const FILE_REFERENCE_FLAG = 1 << 25;