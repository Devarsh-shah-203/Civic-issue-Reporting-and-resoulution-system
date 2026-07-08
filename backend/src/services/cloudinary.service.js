import fs from "fs/promises";

import cloudinary from "../config/cloudinary.js";

import ApiError from "../utils/ApiError.js";

/*
|--------------------------------------------------------------------------
| Upload Single Image
|--------------------------------------------------------------------------
*/

export const uploadImage = async (file) => {

    if (!file) {
        throw new ApiError(400, "Image file is required.");
    }

    try {

        const result = await cloudinary.uploader.upload(
            file.path,
            {
                folder: "civic-issues/complaints",
                resource_type: "image",
            }
        );

        // Remove local multer file
        await fs.unlink(file.path);

        return {
            public_id: result.public_id,
            url: result.secure_url,
        };

    } catch (error) {

        try {
            await fs.unlink(file.path);
        } catch {}

        throw new ApiError(
            500,
            "Failed to upload image."
        );
    }
};

/*
|--------------------------------------------------------------------------
| Upload Multiple Images
|--------------------------------------------------------------------------
*/

export const uploadMultipleImages = async (files = []) => {

    if (!files.length) return [];

    const uploadedImages = [];

    for (const file of files) {

        const image = await uploadImage(file);

        uploadedImages.push(image);

    }

    return uploadedImages;
};

/*
|--------------------------------------------------------------------------
| Delete Single Image
|--------------------------------------------------------------------------
*/

export const deleteImage = async (public_id) => {

    if (!public_id) return;

    await cloudinary.uploader.destroy(public_id);

};

/*
|--------------------------------------------------------------------------
| Delete Multiple Images
|--------------------------------------------------------------------------
*/

export const deleteMultipleImages = async (images = []) => {

    for (const image of images) {

        await deleteImage(image.public_id);

    }

};