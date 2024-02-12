import { Context } from "grammy";
import { IInstagram } from "../types";
import axios from "axios";
import dotenv from "dotenv";
import sendVideo from "../helpers/sendVideo";
import sendLink from "../helpers/sendLink";
import sendPhoto from "../helpers/sendPhoto";

dotenv.config();

const apiKey = process.env.RAPIDAPI_KEY;

const instagram = async (ctx: Context, url: string) => {
	try {
		const options = {
			method: "GET",
			url: "https://instagram-post-and-reels-downloader.p.rapidapi.com/",
			params: { url },
			headers: {
				"X-RapidAPI-Key": apiKey,
				"X-RapidAPI-Host": "instagram-post-and-reels-downloader.p.rapidapi.com",
			},
		};

		const response = await axios.request(options);
		const post = response?.data[0] as IInstagram;

		if (!post) {
			await instagram(ctx, url);
			return;
		}

		const caption = `<b>${post.title}</b>\n\n@insta_tube_save_bot`;

		try {
			if (post.type === "mp4") {
				await sendVideo(ctx, post.link, caption);
			} else {
				await sendPhoto(ctx, post.link, caption);
			}
		} catch (error) {
			await sendLink(ctx, post.link, caption, post.thumb);
		}
	} catch (error) {
		console.log(error);
		await ctx.reply("Something went wrong while downloading :(");
	}
};

export default instagram;
