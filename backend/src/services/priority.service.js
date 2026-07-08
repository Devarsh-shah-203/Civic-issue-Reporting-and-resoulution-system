/**
 * Calculate Complaint Priority
 */

export const calculatePriority = async ({
    category,
    duplicateComplaint = null,
    upvoteCount = 0,
}) => {

    let score = 0;

    /*
    |--------------------------------------------------------------------------
    | Category Weight
    |--------------------------------------------------------------------------
    */

    switch (category) {

        case "Water":
        case "Electricity":
            score += 5;
            break;

        case "Road":
        case "Drainage":
            score += 4;
            break;

        case "Street Light":
            score += 3;
            break;

        case "Garbage":
            score += 2;
            break;

        default:
            score += 1;

    }

    /*
    |--------------------------------------------------------------------------
    | Duplicate Complaints
    |--------------------------------------------------------------------------
    */

    if (duplicateComplaint) {
        score += 3;
    }

    /*
    |--------------------------------------------------------------------------
    | Community Support
    |--------------------------------------------------------------------------
    */

    score += Math.floor(upvoteCount / 10);

    /*
    |--------------------------------------------------------------------------
    | Final Priority
    |--------------------------------------------------------------------------
    */

    if (score >= 10) {
        return "Critical";
    }

    if (score >= 7) {
        return "High";
    }

    if (score >= 4) {
        return "Medium";
    }

    return "Low";
};

/**
 * Recalculate Priority
 */

export const recalculatePriority = async (complaint) => {

    return calculatePriority({

        category: complaint.category,

        duplicateComplaint: complaint.isDuplicate,

        upvoteCount: complaint.upvotes.length,

    });

};

