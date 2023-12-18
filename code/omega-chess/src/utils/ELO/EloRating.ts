import * as Constants from '@/utils/ELO/Constants'

export const getExpectedScore = (ratingA: number, ratingB: number) => {
    return 1.0 / (1.0 + Math.pow(Constants.EXPONENT_BASE, (ratingB - ratingA) / Constants.SCALE_FACTOR));
}

export const getNextRating = (rating: number, expectedScore: number, actualScore: number) => {
    
    let kFactor;

    if (rating < Constants.MEDIUM_RATING) {
        kFactor = Constants.K_FACTOR_BASE;
    } else if (rating < Constants.PRO_RATING) {
        kFactor = Constants.K_FACTOR_MEDIUM;
    } else {
        kFactor = Constants.K_FACTOR_PRO;
    }
    
    return rating + kFactor * (actualScore - expectedScore);
}

export const getUpdatedRatings = (ratingA: number, ratingB: number, result: string) => {
    let expectedScoreA = getExpectedScore(ratingA, ratingB);
    let expectedScoreB = getExpectedScore(ratingB, ratingA);

    let actualScoreA, actualScoreB;

    if (result === Constants.WHITE_WIN) {
        actualScoreA = Constants.WIN_SCORE;
        actualScoreB = Constants.LOSS_SCORE;
    } else if (result === Constants.BLACK_WIN) {
        actualScoreA = Constants.LOSS_SCORE;
        actualScoreB = Constants.WIN_SCORE;
    } else {
        actualScoreA = Constants.DRAW_SCORE;
        actualScoreB = Constants.DRAW_SCORE;
    }

    let newRatingA = getNextRating(ratingA, expectedScoreA, actualScoreA);
    let newRatingB = getNextRating(ratingB, expectedScoreB, actualScoreB);

    return [newRatingA, newRatingB] as const;
}