import { Context } from "grammy";

const sendPhoto = async (ctx: Context, url: string, caption: string) => {
	await ctx.replyWithPhoto(url, {
		caption,
		parse_mode: "HTML",
	});
};

export default sendPhoto;
