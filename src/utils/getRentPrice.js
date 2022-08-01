function getPriceForDay(forPeriod) {
  if (forPeriod < 1) return 28
  let scopeForPeriod = forPeriod
  if (forPeriod % 1 === 0) {
    scopeForPeriod += 1
  }
  return Math.pow(1.15, Math.ceil(scopeForPeriod - 1)) * 28
}

function getPriceByDays(daysCount, startStreak = 0) {
  let startDaysPrice = 0
  let leftDays = daysCount
  const dayPriceForFirstStreak = getPriceForDay(startStreak / 7)

  if (startStreak % 7 !== 0) {
    const daysForFillStartStreak = 7 - (startStreak % 7)
    if (daysCount <= daysForFillStartStreak) {
      return Math.round(dayPriceForFirstStreak * daysCount)
    }

    startDaysPrice += daysForFillStartStreak * dayPriceForFirstStreak
    leftDays -= daysForFillStartStreak
  }

  const daysTail = leftDays % 7
  let daysTailPrice = 0
  if (daysTail !== 0) {
    daysTailPrice += daysTail * getPriceForDay((startStreak + daysCount) / 7)
    leftDays -= daysTail
  }

  if ((startStreak + leftDays) / 7 <= 1) {
    const weekPrice = leftDays * 28
    const finalPrice = startDaysPrice + weekPrice + daysTailPrice
    return Math.round(finalPrice)
  } else {
    let scopePrice = 0
    for (let i = leftDays / 7; i > 0; i--) {
      let scopePeriod = leftDays / 7 - i
      if (startStreak % 7 !== 0) {
        scopePeriod += 1
      }
      const curWeekPrice =
        Math.pow(1.15, Math.ceil(scopePeriod)) * dayPriceForFirstStreak * 7
      scopePrice += curWeekPrice
    }

    const finalPrice = startDaysPrice + scopePrice + daysTailPrice
    return Math.round(finalPrice)
  }
}

module.exports = getPriceByDays
