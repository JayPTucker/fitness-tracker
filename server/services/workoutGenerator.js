export async function generateWorkout(profile) {

    let split = [];

    switch (profile.workout_days_per_week) {

        case 3:
            split = [
                "Push",
                "Pull",
                "Legs"
            ];
            break;

        case 4:
            split = [
                "Upper",
                "Lower",
                "Upper",
                "Lower"
            ];
            break;

        case 5:
            split = [
                "Push",
                "Pull",
                "Legs",
                "Upper",
                "Lower"
            ];
            break;

        case 6:
            split = [
                "Push",
                "Pull",
                "Legs",
                "Push",
                "Pull",
                "Legs"
            ];
            break;

        default:
            split = [
                "Full Body",
                "Full Body",
                "Full Body"
            ];

    }

    return split;

}