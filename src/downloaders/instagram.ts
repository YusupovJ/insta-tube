import { Context, InputMediaBuilder } from "grammy";
import { IInstagram } from "../types";
import axios from "axios";
import dotenv from "dotenv";

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
		const posts = response?.data as IInstagram[];

		const medias = posts.map((post, index) => {
			const method = post.type === "mp4" ? "video" : "photo";

			if (!index) {
				return InputMediaBuilder[method](post.link, {
					caption: `<b>${post.title}</b>\n\n@insta_tube_save_bot`,
					parse_mode: "HTML",
				});
			}

			return InputMediaBuilder[method](post.link);
		});

		await ctx.replyWithMediaGroup(medias);
	} catch (error) {
		console.log(error);
		await ctx.reply("Something went wrong while downloading :(");
	}
};

export default instagram;
