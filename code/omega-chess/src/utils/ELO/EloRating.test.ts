import { getUpdatedRatings } from "./EloRating";

describe("getUpdatedRatings", () => {
    it("should update ratings correctly when white wins", () => {
        const ratingA = 1500;
        const ratingB = 1600;
        const result = "1-0";

        const [newRatingA, newRatingB] = getUpdatedRatings(
            ratingA,
            ratingB,
            result
        );

        expect(newRatingA).toBeGreaterThan(ratingA);
        expect(newRatingB).toBeLessThan(ratingB);
    });

    it("should update ratings correctly when black wins", () => {
        const ratingA = 1500;
        const ratingB = 1600;
        const result = "0-1";

        const [newRatingA, newRatingB] = getUpdatedRatings(
            ratingA,
            ratingB,
            result
        );

        expect(newRatingA).toBeLessThan(ratingA);
        expect(newRatingB).toBeGreaterThan(ratingB);
    });

    it("should update ratings correctly when it is a draw", () => {
        const ratingA = 1500;
        const ratingB = 1600;
        const result = "1/2-1/2";

        const [newRatingA, newRatingB] = getUpdatedRatings(
            ratingA,
            ratingB,
            result
        );

        expect(newRatingA).toBeGreaterThan(ratingA);
        expect(newRatingB).toBeLessThan(ratingB);
    });

    it("should update ratings correctly when the first player is a medium", () => {
        const ratingA = 2100;
        const ratingB = 1600;
        const result = "1-0";

        const [newRatingA, newRatingB] = getUpdatedRatings(
            ratingA,
            ratingB,
            result
        );

        expect(newRatingA).toBeGreaterThan(ratingA);
        expect(newRatingB).toBeLessThan(ratingB);
    })

    it("should update ratings correctly when the first player is a pro", () => {
        const ratingA = 2500;
        const ratingB = 1600;
        const result = "1-0";

        const [newRatingA, newRatingB] = getUpdatedRatings(
            ratingA,
            ratingB,
            result
        );

        expect(newRatingA).toBeGreaterThan(ratingA);
        expect(newRatingB).toBeLessThan(ratingB);
    })

    it("should update ratings correctly when the players have the same rating", () => {
        const ratingA = 1500;
        const ratingB = 1500;
        const result = "1/2-1/2";

        const [newRatingA, newRatingB] = getUpdatedRatings(
            ratingA,
            ratingB,
            result
        );

        expect(newRatingA).toBe(ratingA);
        expect(newRatingB).toBe(ratingB);
    });
});
