import dotenv from "dotenv";
import { IVideos, MyContext } from "../types";
import ytdl, { VideoFormatQuality, videoFormat } from "ytdl-core";
import qualityMenu from "../menus/qualityMenu";

dotenv.config();

const qualities = {
	tiny: "144p 📟",
	small: "240p 📹",
	medium: "360p 📺",
	large: "480p 🎥",
	hd720: "720p 📸",
	hd1080: "1080p 💻",
	hd1440: "1440p 🖥",
	hd2160: "2160p 💎",
	highres: "highres",
};

const youtube = async (ctx: MyContext, url: string) => {
	try {
		const info = await ytdl.getInfo(url);

		const videos: IVideos = {};
		const audio = info.formats.find((format) => format.mimeType?.includes("audio/mp4"));

		info.formats.forEach((format) => {
			if (format.mimeType?.includes("video/mp4")) {
				const index = format.quality as VideoFormatQuality;
				const quality = qualities[index];

				videos[quality] = format;
			}
		});

		ctx.session = { videos, audio, url };

		const preview = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1];

		await ctx.replyWithPhoto(preview.url, {
			caption: `<b>${info.videoDetails.title}</b>\n\n@insta_tube_save_bot`,
			parse_mode: "HTML",
			reply_markup: qualityMenu,
		});
	} catch (error) {
		console.log(error);
		await ctx.reply("Something went wrong :(");
	}
};

export default youtube;
