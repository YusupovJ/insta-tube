import axios from "axios";
import dotenv from "dotenv";
import sendVideo from "../helpers/sendVideo";
import sendLink from "../helpers/sendLink";
import { IYoutube, MyContext } from "../types";

dotenv.config();

const apiKey = process.env.RAPIDAPI_KEY;

const youtube = async (ctx: MyContext, id: string) => {
    try {
        const options = {
            method: "GET",
            url: "https://ytstream-download-youtube-videos.p.rapidapi.com/dl",
            params: { id },
            headers: {
                "X-RapidAPI-Key": apiKey,
                "X-RapidAPI-Host": "ytstream-download-youtube-videos.p.rapidapi.com",
            },
        };

        const response = await axios.request(options);
        const videoInfo = response.data as IYoutube;

        const video = videoInfo.formats.find((video) => video.itag === 22 || video.itag === 18);
        const caption = `<b>${videoInfo.title}</b>\n\n@insta_tube_save_bot`;
        const videoUrl = video?.url || "";

        try {
            await sendVideo(ctx, videoUrl, caption);
        } catch (error) {
            const preview = videoInfo.thumbnail[videoInfo.thumbnail.length - 1];
            await sendLink(ctx, videoUrl, caption, preview.url);
        }
    } catch (error) {
        console.log(error);
        await ctx.reply("Something went wrong while downloading :(");
    }
};

export default youtube;
