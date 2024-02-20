import path from "path";
import fs from "fs/promises";

class FileRepository {
	fileUrl: string;

	constructor() {
		this.fileUrl = path.resolve("public", "files.json");
	}

	async getByFileName(fileName: string) {
		const files = await this.getAll();

		return files.find((file: any) => file.fileName === fileName);
	}

	async getAll() {
		const content = await fs.readFile(this.fileUrl, { encoding: "utf-8" });
		const files = JSON.parse(content);

		return files;
	}

	async add(fileId: string, fileName: string) {
		const newFile = {
			fileId,
			fileName,
		};

		const files = await this.getAll();
		files.push(newFile);

		await fs.writeFile(this.fileUrl, JSON.stringify(files), { encoding: "utf-8" });
	}
}

export default new FileRepository();
