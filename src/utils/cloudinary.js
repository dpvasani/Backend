import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config(); // Ensure .env file is loaded
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.error("File path is invalid or file does not exist");
      return null;
    }

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Successfully uploaded, remove the file
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    try {
      // Ensure file deletion even if upload fails
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (unlinkError) {
      fs.unlinkSync(localFilePath);
      console.error("Error removing temporary file:", unlinkError);
    }

    return null;
  }
};

// Delete from Cloudinary
const deleteFromCloudinary = async (cloudinaryFilePath, path) => {
  try {
    if (!cloudinaryFilePath) return null;

    const avatarPublicId = cloudinaryFilePath.split("/").pop().split(".")[0];

    const response = await cloudinary.uploader.destroy(
      `${path}/${avatarPublicId}`
    );

    return response;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
