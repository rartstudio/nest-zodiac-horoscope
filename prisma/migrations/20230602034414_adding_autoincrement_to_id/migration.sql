-- AlterTable
CREATE SEQUENCE postlike_id_seq;
ALTER TABLE "PostLike" ALTER COLUMN "id" SET DEFAULT nextval('postlike_id_seq');
ALTER SEQUENCE postlike_id_seq OWNED BY "PostLike"."id";
