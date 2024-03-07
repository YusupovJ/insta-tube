import dotenv from "dotenv";
import { MyContext } from "../types";
import ytdl from "ytdl-core";
import youtubeMenu from "../menus/youtubeMenu";

dotenv.config();

const youtube = async (ctx: MyContext, url: string) => {
	try {
		const info = await ytdl.getInfo(url);

		const preview = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1];

		ctx.session.url = url;

		await ctx.replyWithPhoto(preview.url, {
			caption: `<b>Please choose the format ⬇️</b>`,
			parse_mode: "HTML",
			reply_markup: youtubeMenu,
		});
	} catch (error) {
		console.log(error);
		await ctx.reply("Something went wrong :(");
	}
};

export default youtube;
