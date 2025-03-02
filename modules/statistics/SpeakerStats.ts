/**
 * A model for keeping track of each user's total
 * time as a dominant speaker. The model also
 * keeps track of the user's last known name
 * in case the user has left the meeting,
 * which is also tracked.
 */
class SpeakerStats {
    private _userId: string;
    private _isLocalStats: boolean;
    private _dominantSpeakerStart: number;
    private _hasLeft: boolean;
    private _faceExpressions: { [key in FacialExpressions]: number };
    totalDominantSpeakerTime: number;
    displayName: string;
    /**
     * Initializes a new SpeakerStats instance.
     *
     * @constructor
     * @param {string} userId - The id of the user being tracked.
     * @param {string} displayName - The name of the user being tracked.
     * @param {boolean} isLocalStats - True if the stats model tracks
     * the local user.
     * @returns {void}
     */
    constructor(userId, displayName, isLocalStats) {
        this._userId = userId;
        this.setDisplayName(displayName);
        this._isLocalStats = isLocalStats || false;
        this.setDominantSpeaker(false);
        this.totalDominantSpeakerTime = 0;
        this._dominantSpeakerStart = 0;
        this._hasLeft = false;
        this._faceExpressions = {
            happy: 0,
            neutral: 0,
            surprised: 0,
            angry: 0,
            fearful: 0,
            disgusted: 0,
            sad: 0
        };
    }

    /**
     * Get the user id being tracked.
     *
     * @returns {string} The user id.
     */
    getUserId() {
        return this._userId;
    }

    /**
     * Get the name of the user being tracked.
     *
     * @returns {string} The user name.
     */
    getDisplayName() {
        return this.displayName;
    }

    /**
     * Updates the last known name of the user being tracked.
     *
     * @param {string} - The user name.
     * @returns {void}
     */
    setDisplayName(newName) {
        this.displayName = newName;
    }

    /**
     * Returns true if the stats are tracking the local user.
     *
     * @returns {boolean}
     */
    isLocalStats() {
        return this._isLocalStats;
    }

    /**
     * Returns true if the tracked user is currently a dominant speaker.
     *
     * @returns {boolean}
     */
    isDominantSpeaker() {
        return this._dominantSpeakerStart > 0;
    }

    /**
     * Returns true if the tracked user is currently a dominant speaker.
     *
     * @param {boolean} - If true, the user will being accumulating time
     * as dominant speaker. If false, the user will not accumulate time
     * and will record any time accumulated since starting as dominant speaker.
     * @returns {void}
     */
    setDominantSpeaker(isNowDominantSpeaker) {
        if (!this.isDominantSpeaker() && isNowDominantSpeaker) {
            this._dominantSpeakerStart = Date.now();
        } else if (this.isDominantSpeaker() && !isNowDominantSpeaker) {
            const now = Date.now();
            const timeElapsed = now - this._dominantSpeakerStart;

            this.totalDominantSpeakerTime += timeElapsed;
            this._dominantSpeakerStart = 0;
        }
    }

    /**
     * Get how long the tracked user has been dominant speaker.
     *
     * @returns {number} - The speaker time in milliseconds.
     */
    getTotalDominantSpeakerTime() {
        let total = this.totalDominantSpeakerTime;

        if (this.isDominantSpeaker()) {
            total += Date.now() - this._dominantSpeakerStart;
        }

        return total;
    }

    /**
     * Get whether or not the user is still in the meeting.
     *
     * @returns {boolean} True if the user is no longer in the meeting.
     */
    hasLeft() {
        return this._hasLeft;
    }

    /**
     * Set the user as having left the meeting.
     *
     * @returns {void}
     */
    markAsHasLeft() {
        this._hasLeft = true;
        this.setDominantSpeaker(false);
    }

    /**
     * Gets the face expressions of the user.
     *
     * @returns {Object}
     */
    getFaceExpressions() {
        return this._faceExpressions;
    }

    /**
     * Sets the face expressions of the user.
     *
     * @param {Object} faceExpressions - object with face expressions.
     * @returns {void}
     */
    setFaceExpressions(faceExpressions) {
        this._faceExpressions = faceExpressions;
    }

    /**
     * Adds a new face expression to speaker stats.
     *
     * @param  {string} faceExpression
     * @param {number} duration
     */
    addFaceExpression(faceExpression, duration) {
        this._faceExpressions[faceExpression] += duration;
    }
}

export default SpeakerStats;

/**
 * FacialExpressions Enum
 */
export enum FacialExpressions {
    happy = 'happy',
    neutral = 'neutral',
    surprised = 'surprised',
    angry = 'angry',
    fearful = 'fearful',
    disgusted = 'disgusted',
    sad = 'sad',
};