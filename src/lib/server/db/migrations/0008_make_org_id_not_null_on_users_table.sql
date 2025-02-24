DELETE FROM "user" WHERE organization_id IS NULL;

ALTER TABLE "user" ALTER COLUMN "organization_id" SET NOT NULL;