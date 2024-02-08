import { Context } from "grammy";

const sendVideo = async (ctx: Context, url: string, caption: string) => {
	await ctx.replyWithVideo(url, {
		caption,
		parse_mode: "HTML",
	});
};

export default sendVideo;
