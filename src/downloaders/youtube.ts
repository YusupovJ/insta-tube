import axios from "axios";
import dotenv from "dotenv";
import sendVideo from "../helpers/sendVideo";
import sendLink from "../helpers/sendLink";
import { IYoutube, MyContext } from "../types";

dotenv.config();

const apiKey = process.env.RAPIDAPI_KEY;

const youtube = async (ctx: MyContext, url: string) => {
	try {
		const options = {
			method: "POST",
			url: "https://youtube86.p.rapidapi.com/api/youtube/links",
			headers: {
				"content-type": "application/json",
				"X-Forwarded-For": "70.41.3.18",
				"X-RapidAPI-Key": apiKey,
				"X-RapidAPI-Host": "youtube86.p.rapidapi.com",
			},
			data: { url },
		};

		const response = await axios.request(options);
		const videoInfo = response.data[0] as IYoutube;

		const video = videoInfo.urls.find((video) => video.itag === "22" || video.itag === "18");
		const caption = `<b>${videoInfo.meta.title}</b>\n\n@insta_tube_save_bot`;
		const videoUrl = video?.url || "";

		try {
			await sendVideo(ctx, videoUrl, caption);
		} catch (error) {
			const preview = videoInfo.meta.pictureUrl;
			await sendLink(ctx, videoUrl, caption, preview);
		}
	} catch (error) {
		await ctx.reply("Something went wrong :(");
	}
};

export default youtube;
