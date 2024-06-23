ALTER TABLE board ADD COLUMN members_only TINYINT(1) NOT NULL DEFAULT 0;

INSERT INTO category
(id, name, parent_pk, is_use)
VALUES (5, 'album' , NULL, 1);