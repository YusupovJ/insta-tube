import { Context } from "grammy";
import axios from "axios";
import dotenv from "dotenv";
import sendVideo from "../helpers/sendVideo";
import sendLink from "../helpers/sendLink";
import { IInstagram } from "../types";

dotenv.config();

const apiKey = process.env.RAPIDAPI_KEY;

const instagram = async (ctx: Context, url: string) => {
    try {
        const options = {
            method: "GET",
            url: "https://instagram-post-and-reels-downloader.p.rapidapi.com/insta/",
            params: { url },
            headers: {
                "X-RapidAPI-Key": apiKey,
                "X-RapidAPI-Host": "instagram-post-and-reels-downloader.p.rapidapi.com",
            },
        };

        const response = await axios.request(options);
        const videoInfo = response?.data?.detail?.data?.items[0] as IInstagram;

        const preview = videoInfo?.pictureUrl;
        const videoUrl = videoInfo.urls[0].url;
        const caption = `<b>${videoInfo.meta.title}</b>\n\n@insta_tube_save_bot`;

        try {
            await sendVideo(ctx, videoUrl, caption);
        } catch (error) {
            await sendLink(ctx, videoUrl, caption, preview);
        }
    } catch (error) {
        console.log(error);
        await ctx.reply("Something went wrong while downloading :(");
    }
};

export default instagram;
