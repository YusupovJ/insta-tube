import { AutoChatActionFlavor } from "@grammyjs/auto-chat-action";
import { Context, SessionFlavor } from "grammy";
import { videoFormat } from "ytdl-core";

export type MyContext = Context & SessionFlavor<SessionData> & AutoChatActionFlavor;

export interface IInstagram {
	thumb: string;
	link: string;
	type: string;
	title: string;
}

export interface SessionData {
	url: string;
}

export interface IVideos {
	[key: string]: videoFormat;
}
