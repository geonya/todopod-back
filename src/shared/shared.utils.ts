import * as AWS from "aws-sdk";

AWS.config.update({
	credentials: {
		accessKeyId: process.env.AWS_KEY,
		secretAccessKey: process.env.AWS_SECRET,
	},
});

export const uploadToS3 = async (
	file: any,
	userId: number,
	folderName: string
) => {
	const { fileName, createReadStream } = await file;
	console.log(fileName, createReadStream);
};
