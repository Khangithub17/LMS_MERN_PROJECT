
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload media to Cloudinary
export const uploadMedia = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'mern_lms',
    });
    return result;
  } catch (error) {
    throw new Error('Failed to upload media');
  }
};

// Function to delete media from Cloudinary
export const deleteMedia = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error('Failed to delete media');
  }
};