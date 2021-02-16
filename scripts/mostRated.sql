.headers ON
--.mode column
--.width 13 7 30 80
.read "scripts/createFinal.sql"
SELECT
  finalAppStates.verdict as Verdict,
  printf("%7.2f",((max(appStates.ratings) - min(appStates.ratings)) / ((strftime('%s','now') - appStates.date) / 60.0 / 60 / 24))) as AverageRatingsPerDay,
  finalAppStates.stars as Stars,
  appStates.appId as ID,
  finalAppStates.title as Title
FROM appStates
INNER JOIN finalAppStates ON appStates.appId = finalAppStates.appId
GROUP BY appStates.appId
HAVING cast(AverageRatingsPerDay as float) > 0.005
ORDER BY finalAppStates.verdict, averageRatingsPerDay DESC;
