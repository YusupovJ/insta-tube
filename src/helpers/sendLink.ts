import { Context, InlineKeyboard } from "grammy";

const sendLink = async (ctx: Context, url: string, caption: string, preview: string) => {
	const linkKeyboard = new InlineKeyboard().url("Download link", url);

	await ctx.replyWithPhoto(preview, {
		caption,
		parse_mode: "HTML",
		reply_markup: linkKeyboard,
	});
};

export default sendLink;
