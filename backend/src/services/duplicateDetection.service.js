import Complaint from "../models/complaint.model.js";

/**
 * Calculate text similarity
 */

const calculateSimilarity = (text1, text2) => {

    const words1 = text1
        .toLowerCase()
        .split(/\s+/);

    const words2 = text2
        .toLowerCase()
        .split(/\s+/);

    const commonWords = words1.filter(word =>
        words2.includes(word)
    );

    return commonWords.length / Math.max(words1.length, words2.length);

};

/**
 * Find Duplicate Complaint
 */

export const detectDuplicateComplaint = async ({
    title,
    description,
    category,
    latitude,
    longitude,
}) => {

    const nearbyComplaints = await Complaint.find({

        category,

        status: {
            $ne: "Resolved",
        },

        "location.coordinates": {

            $near: {

                $geometry: {
                    type: "Point",
                    coordinates: [
                        Number(longitude),
                        Number(latitude),
                    ],
                },

                $maxDistance: 300,

            },

        },

    });

    if (!nearbyComplaints.length) {

        return null;

    }

    let bestMatch = null;

    let highestSimilarity = 0;

    for (const complaint of nearbyComplaints) {

        const titleSimilarity =
            calculateSimilarity(
                title,
                complaint.title
            );

        const descriptionSimilarity =
            calculateSimilarity(
                description,
                complaint.description
            );

        const similarity =
            (titleSimilarity + descriptionSimilarity) / 2;

        if (similarity > highestSimilarity) {

            highestSimilarity = similarity;

            bestMatch = complaint;

        }

    }

    if (highestSimilarity >= 0.6) {

        return bestMatch;

    }

    return null;

};

/**
 * Get Nearby Complaints
 */

export const getNearbyComplaints = async ({
    latitude,
    longitude,
    radius = 1000,
}) => {

    return await Complaint.find({

        "location.coordinates": {

            $near: {

                $geometry: {

                    type: "Point",

                    coordinates: [
                        Number(longitude),
                        Number(latitude),
                    ],

                },

                $maxDistance: radius,

            },

        },

    });

};