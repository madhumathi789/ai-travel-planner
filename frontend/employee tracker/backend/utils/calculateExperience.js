const moment = require('moment');

function calculateExperienceAndAge(data) {
  const dob = moment(data.dob);
  const joiningDate = moment(data.joiningDate);
  const today = moment();

  const ageDuration = moment.duration(today.diff(dob));
  const currentExpDuration = moment.duration(today.diff(joiningDate));

  const previous = {
    years: parseInt(data.prevExpYears || 0),
    months: parseInt(data.prevExpMonths || 0),
    days: parseInt(data.prevExpDays || 0),
  };

  const total = moment.duration(currentExpDuration);
  total.add(previous.years, 'years');
  total.add(previous.months, 'months');
  total.add(previous.days, 'days');

  return {
    ...data,
    age: {
      years: ageDuration.years(),
      months: ageDuration.months(),
      days: ageDuration.days(),
    },
    currentExperience: {
      years: currentExpDuration.years(),
      months: currentExpDuration.months(),
      days: currentExpDuration.days(),
    },
    totalExperience: {
      years: total.years(),
      months: total.months(),
      days: total.days(),
    },
    previousExperience: previous,
  };
}

module.exports = { calculateExperienceAndAge };
