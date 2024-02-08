import { AutoChatActionFlavor } from "@grammyjs/auto-chat-action";
import { Context } from "grammy";

export type MyContext = Context & AutoChatActionFlavor;

export interface IUrls {
    extension: string;
    name: string;
    url: string;
    urlDownloadable: string;
    urlWrapped: string;
}

export interface IInstagram {
    meta: {
        sourceUrl: string;
        title: string;
    };
    pictureUrl: string;
    pictureUrlWrapped: string;
    service: string;
    urls: IUrls[];
}

export interface IFormat {
    itag: number;
    url: string;
    mimeType: string;
    bitrate: number0;
    width: number;
    height: number;
    lastModified: string;
    quality: string;
    fps: number;
    qualityLabel: string;
    projectionType: string;
    audioQuality: string;
    approxDurationMs: string;
    audioSampleRate: string;
    audioChannels: number;
}

export interface IYoutube {
    status: string;
    id: string;
    title: string;
    lengthSeconds: string;
    keywords: string[];
    channelTitle: string;
    channelId: string;
    description: string;
    thumbnail: { url: string; width: number; height: number }[];
    allowRatings: booelan;
    viewCount: string;
    isPrivate: boolean;
    isUnpluggedCorpus: boolean;
    isLiveContent: boolean;
    expiresInSeconds: string;
    formats: IFormat[];
    adaptiveFormats: IFormat[];
    pmReg: string;
    isProxied: boolean;
}
