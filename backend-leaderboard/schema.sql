BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "leaderboard" (
	"username"	TEXT NOT NULL UNIQUE COLLATE NOCASE,
	"score"	INTEGER NOT NULL,
	PRIMARY KEY("username")
);
COMMIT;
