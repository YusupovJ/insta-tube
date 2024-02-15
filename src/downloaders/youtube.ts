import dotenv from "dotenv";
import { MyContext } from "../types";
import ytdl from "ytdl-core";
import qualityMenu from "../menus/qualityMenu";

dotenv.config();

const youtube = async (ctx: MyContext, url: string) => {
  try {
    const info = await ytdl.getInfo(url);

    const formats: any = {};

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
