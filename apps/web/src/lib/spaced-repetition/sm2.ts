export interface ReviewState {
  easiness: number
  interval: number
  repetitions: number
  nextReview: Date
}

const INITIAL_EASINESS = 2.5
const MIN_EASINESS = 1.3
const FIRST_INTERVAL = 1
const SECOND_INTERVAL = 6

export function getInitialReviewState(): ReviewState {
  return {
    easiness: INITIAL_EASINESS,
    interval: 0,
    repetitions: 0,
    nextReview: new Date(),
  }
}

export function calculateNextReview(
  quality: number,
  state: ReviewState
): ReviewState {
  if (quality < 0 || quality > 5) {
    throw new Error("Quality must be between 0 and 5")
  }

  let newEasiness = state.easiness
  let newInterval: number
  let newRepetitions: number

  if (quality < 3) {
    newRepetitions = 0
    newInterval = FIRST_INTERVAL
  } else {
    newRepetitions = state.repetitions + 1

    if (newRepetitions === 1) {
      newInterval = FIRST_INTERVAL
    } else if (newRepetitions === 2) {
      newInterval = SECOND_INTERVAL
    } else {
      newInterval = Math.ceil(state.interval * state.easiness)
    }

    newEasiness = calculateEasinessFactor(state.easiness, quality)
  }

  const nextReview = calculateNextReviewDate(newInterval)

  return {
    easiness: newEasiness,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview,
  }
}

function calculateEasinessFactor(currentEF: number, quality: number): number {
  const newEF =
    currentEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  return Math.max(newEF, MIN_EASINESS)
}

function calculateNextReviewDate(intervalDays: number): Date {
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + intervalDays)
  nextReview.setHours(0, 0, 0, 0)
  return nextReview
}
