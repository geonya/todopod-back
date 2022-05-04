import * as AWS from "aws-sdk";

AWS.config.update({
	credentials: {
		accessKeyId: process.env.AWS_KEY,
		secretAccessKey: process.env.AWS_SECRET,
	},
});

const AWS_S3 = new AWS.S3();
const Bucket = "todopod";
const ACL = "public-read";

export const uploadToS3 = async (
	file: any,
	userId: number,
	folderName: string
) => {
	const { filename, createReadStream } = await file;
	const readStream = createReadStream();
	const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
	const { Location } = await new AWS.S3()
		.upload({
			Bucket,
			Key: objectName,
			ACL,
			Body: readStream,
		})
		.promise();
	return Location;
};

export const deleteFromS3 = async (fileUrl: string, folderName: string) => {
	const decodeUrl = decodeURI(fileUrl);
	const fileName = decodeUrl.split(`/${folderName}/`)[1];
	const objectName = `${folderName}/${fileName}`;
	await AWS_S3.deleteObject({
		Bucket,
		Key: objectName,
	}).promise();
};

export const makeHashtags = (content: string) => {
	const foundHashtags = content.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w-]+/g);
	const cleanedHashtags = foundHashtags?.map((hashtag: string) =>
		hashtag.replace("#", "")
	);
	return cleanedHashtags?.map((hashtag: string) => ({
		where: { hashtag },
		create: { hashtag },
	}));
};
