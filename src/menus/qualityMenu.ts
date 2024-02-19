import { Menu } from "@grammyjs/menu";
import { MyContext } from "../types";
import path from "path";
import fs from "fs";
import ytdl, { videoFormat } from "ytdl-core";
import { InputFile } from "grammy";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import FileRepository from "../db/FileRepository";

const downloadAudio = async (output: string, url: string, audio: videoFormat, id: string) => {
	const audioOutput = path.join(output, `${id}-audio.m4a`);
	const audioStream = await ytdl(url, { quality: audio.itag }).pipe(fs.createWriteStream(audioOutput));

	return { audioOutput, audioStream };
};

const downloadVideo = async (output: string, url: string, video: videoFormat, id: string, quality: string) => {
	const videoOutput = path.join(output, `${id}-${quality}-video.mp4`);
	const videoStream = await ytdl(url, { quality: video.itag }).pipe(fs.createWriteStream(videoOutput));

	return { videoOutput, videoStream };
};

const mediaMerger = (audioInput: string, videoInput: string, ctx: MyContext, id: string, output: string, quality: string) => {
	ffmpeg.setFfmpegPath(ffmpegInstaller.path);

	const mergeFileName = `${id}-${quality}-merged.mp4`;
	const mergeOutput = path.join(output, mergeFileName);

	const mergeStream = ffmpeg()
		.addInput(videoInput)
		.addInput(audioInput)
		.format("mp4")
		.outputOptions("-movflags frag_keyframe+empty_moov")
		.on("end", () => {
			ctx.replyWithVideo(new InputFile(mergeOutput)).then(async (message) => {
				await FileRepository.add(message.video.file_id, mergeFileName);
			});
		})
		.on("error", (err) => {
			console.log(err);
		})
		.writeToStream(fs.createWriteStream(mergeOutput));

	return { mergeOutput, mergeStream };
};

const qualityMenu = new Menu<MyContext>("qualities").dynamic((ctx, range) => {
	const { audio, videos, url } = ctx.session;
	const id = ytdl.getURLVideoID(url);

	if (audio && videos) {
		const output = path.join(__dirname, "..", "uploads");

		Object.keys(videos).forEach((qualityLabel, index) => {
			const quality = qualityLabel.split(" ")[0];

			if (index % 3 === 0) {
				range.row();
			}

			range.text(qualityLabel, async () => {
				ctx.chatAction = "upload_video";
				const video = videos[qualityLabel];

				if (video.hasAudio) {
					const existVideo = path.join(output, `${id}-${quality}-video.mp4`);

					if (fs.existsSync(existVideo)) {
						ctx.replyWithVideo(new InputFile(existVideo));
						return;
					}

					const { videoOutput, videoStream } = await downloadVideo(output, url, video, id, quality);

					videoStream.on("close", () => {
						ctx.replyWithVideo(new InputFile(videoOutput));
					});
				} else {
					const mergeFileName = `${id}-${quality}-merged.mp4`;
					const audioFileName = `${id}-audio.m4a`;

					const existMerged = path.join(output, mergeFileName);
					const existAudio = path.join(output, audioFileName);

					if (fs.existsSync(existMerged)) {
						const file = await FileRepository.getByFileName(mergeFileName);
						await ctx.replyWithVideo(file.fileId);
					} else if (fs.existsSync(existAudio)) {
						const { videoOutput, videoStream } = await downloadVideo(output, url, video, id, quality);
						videoStream.on("close", () => {
							mediaMerger(existAudio, videoOutput, ctx, id, output, quality);
						});
					} else {
						const { videoOutput, videoStream } = await downloadVideo(output, url, video, id, quality);
						const { audioOutput, audioStream } = await downloadAudio(output, url, audio, id);

						audioStream.on("close", () => {
							videoStream.on("close", () => {
								mediaMerger(audioOutput, videoOutput, ctx, id, output, quality);
							});
						});
					}
				}
			});
		});

		range.row().text("Audio 🎧", async () => {
			ctx.chatAction = "upload_document";

			const audioFileName = `${id}-audio.m4a`;
			const existAudio = path.join(output, audioFileName);

			if (fs.existsSync(existAudio)) {
				const file = await FileRepository.getByFileName(audioFileName);
				await ctx.replyWithAudio(file.fileId);
				return;
			}

			const { audioOutput, audioStream } = await downloadAudio(output, url, audio, id);

			audioStream.on("close", async () => {
				const { audio } = await ctx.replyWithAudio(new InputFile(audioOutput));
				await FileRepository.add(audio.file_id, audioFileName);
			});
		});
	}
});

export default qualityMenu;
