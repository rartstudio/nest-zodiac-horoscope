export type FileUpload = {
  originalname: string;
  mimetype: string;
  key: string;
  size: number;
  location: string; //using s3
  filename: string; //disk storage
};
