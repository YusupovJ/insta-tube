import { AutoChatActionFlavor } from "@grammyjs/auto-chat-action";
import { Context } from "grammy";

export type MyContext = Context & AutoChatActionFlavor;

export interface IInstagram {
	thumb: string;
	link: string;
	type: string;
	title: string;
}

export interface IFormat {
	url: string;
	name: string;
	subName: string;
	extension: string;
	quality: string;
	qualityNumber: number;
	audio: boolean;
	itag: string;
	videoCodec: string;
	audioCodec: string;
	isBundle: boolean;
}

export interface IYoutube {
	resourceId: string;
	urls: IFormat[];
	meta: {
		title: "UHDTV TEST 8K VIDEO.mp4";
		sourceUrl: "https://www.youtube.com/watch?v=a9LDPn-MO4I";
		duration: "1:00";
		tags: "8K,VIDEO,UHD,SUPER,HI-VISION,ULTRA,HIGH,DEFINITION";
		pictureUrl: "https://i.ytimg.com/vi/a9LDPn-MO4I/hqdefault.jpg";
	};
	videoQuality: string[];
	service: string;
}
