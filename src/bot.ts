import { Bot, session, webhookCallback } from "grammy";
import { run, sequentialize } from "@grammyjs/runner";
import dotenv from "dotenv";
import commandsList from "./commands/commandsList";
import handleError from "./helpers/handleError";
import youtube from "./downloaders/youtube";
import instagram from "./downloaders/instagram";
import { autoChatAction } from "@grammyjs/auto-chat-action";
import { MyContext, SessionData } from "./types";
import express from "express";
import youtubeMenu from "./menus/youtubeMenu";
import { freeStorage } from "@grammyjs/storage-free";

dotenv.config();
const token = process.env.TELEGRAM_BOT_API as string;
const bot = new Bot<MyContext>(token);

function initial(): SessionData {
	return { url: "" };
}

bot.use(session({ initial, storage: freeStorage(bot.token) }));
bot.use(
	sequentialize((ctx: any) => {
		const chat = ctx.chat?.id.toString();
		const user = ctx.from?.id.toString();
		return [chat, user].filter((con) => con !== undefined);
	})
);
bot.use(autoChatAction());
bot.use(youtubeMenu);

const setCommands = async () => {
	await bot.api.setMyCommands(commandsList);
};

setCommands();
bot.catch(handleError);

bot.command("start", async (ctx) => {
	await ctx.reply("Please, send link of the video 🎥");
});

bot.command("help", async (ctx) => {
	await ctx.reply("First of all send a video from Youtube or Instagram");
	await ctx.reply("If you are using pc, just copy the link in browser 🖥");
	await ctx.reply("Or if you are using mobile phone and applications 📱,\n you can share⤵️ the link to this bot");
});

bot.on("message::url", async (ctx) => {
	const url = ctx.message.text as string;
	const parsedUrl = new URL(url);

	if (parsedUrl.hostname === "www.youtube.com" || parsedUrl.hostname === "youtu.be" || parsedUrl.hostname === "youtube.com") {
		ctx.chatAction = "upload_photo";
		await youtube(ctx, url);
	} else if (parsedUrl.hostname === "www.instagram.com") {
		ctx.chatAction = "upload_video";
		await instagram(ctx, url);
	}
});

if (process.env.NODE_ENV === "DEVELOPMENT") {
	bot.api.deleteWebhook();
	const runner = run(bot);

	if (runner.isRunning()) {
		console.log("Bot started");
	}
} else {
	const port = process.env.PORT || 3000;
	const app = express();
	app.use(express.json());
	app.use(`/${bot.token}`, webhookCallback(bot, "express"));
	app.listen(port, () => console.log(`listening on port ${port}`));
}
