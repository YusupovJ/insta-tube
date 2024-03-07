import { Menu } from "@grammyjs/menu";
import { MyContext } from "../types";
import ytdl from "ytdl-core";
import { InlineKeyboard } from "grammy";

const youtubeMenu = new Menu<MyContext>("qualities").dynamic(async (ctx, range) => {
	const info = await ytdl.getInfo(ctx.session.url);

	range.text("Video 🎬", async (ctx) => {
		ctx.chatAction = "upload_video";

		const video = await ytdl.chooseFormat(info.formats, {
			quality: "highestvideo",
			filter(format) {
				return format.hasAudio;
			},
		});

		try {
			await ctx.replyWithVideo(video.url, {
				caption: `<b>${info.videoDetails.title}</b>\n\n@insta_tube_save_bot`,
				parse_mode: "HTML",
			});
		} catch (error) {
			const preview = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1];

			await ctx.replyWithPhoto(preview.url, {
				reply_markup: new InlineKeyboard().url("Download link ⤵️", video.url),
			});
		}
	});

	range.text("Audio 🎧", async (ctx) => {
		ctx.chatAction = "upload_document";

		const audio = await ytdl.chooseFormat(info.formats, {
			quality: "highestaudio",
			filter(format) {
				return !format.hasVideo;
			},
		});

		try {
			await ctx.replyWithAudio(audio.url, {
				caption: `<b>${info.videoDetails.title}</b>\n\n@insta_tube_save_bot`,
				parse_mode: "HTML",
			});
		} catch (error) {
			const preview = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1];

			await ctx.replyWithPhoto(preview.url, {
				caption: `<b>${info.videoDetails.title}</b>\n\n@insta_tube_save_bot`,
				parse_mode: "HTML",
				reply_markup: new InlineKeyboard().url("Download link ⤵️", audio.url),
			});
		}
	});
});

export default youtubeMenu;
