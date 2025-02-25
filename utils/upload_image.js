import { v2 as cloudinary } from 'cloudinary' 
import { configDotenv } from 'dotenv';

configDotenv()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// const image = './path/to/image.jpg'; // This can also be a remote URL or a base64 DataURI

export const upload_image = async (image) =>{    
    return await cloudinary.uploader.upload(image);
}