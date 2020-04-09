/* eslint-disable no-param-reassign */
const infectedAtTime = (currentlyInfected, periodType, timeToElapse) => {
  if (periodType === 'months') {
    timeToElapse *= 30;
  } else if (periodType === 'weeks') {
    timeToElapse *= 7;
  }
  const factorDoubles = 2 ** Math.floor(timeToElapse / 3);
  return currentlyInfected * factorDoubles;
};

const estimatorHelper = (data, val) => {
  const infected = data.reportedCases * val;
  const infectionsByRequestedTime = infectedAtTime(
    infected,
    data.periodType,
    data.timeToElapse
  );
  const severeCasesByRequestedTime = Math.floor(
    0.15 * infectionsByRequestedTime
  );
  const hospitalBedsByRequestedTime = Math.floor(
    data.totalHospitalBeds * 0.35 - severeCasesByRequestedTime
  );
  const casesForICUByRequestedTime = Math.floor(
    severeCasesByRequestedTime * 0.05
  );

  const casesForVentilatorsByRequestedTime = Math.floor(
    severeCasesByRequestedTime * 0.02
  );

  const dollarsInFlight =
    infectionsByRequestedTime *
    data.region.avgDailyIncomeInUSD *
    data.region.avgDailyIncomePopulation *
    30;
  return {
    currentlyInfected: infected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
};

const covid19ImpactEstimator = (data) => ({
  data,
  impact: estimatorHelper(data, 10),
  severeImpact: estimatorHelper(data, 50)
});

export default covid19ImpactEstimator;
