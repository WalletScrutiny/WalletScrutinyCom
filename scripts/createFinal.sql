DROP TABLE IF EXISTS finalAppStates;
CREATE TABLE finalAppStates AS
SELECT a1.*, a1.rowid as old_rowid
FROM appStates as a1
INNER JOIN 
(
  SELECT appId, MAX(date) as date
  FROM appStates
  GROUP BY appId
) as a2 ON a1.appId = a2.appId and a1.date = a2.date;
SELECT "finalAppStates updated ...";