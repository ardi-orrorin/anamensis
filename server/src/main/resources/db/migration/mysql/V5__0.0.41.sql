CREATE INDEX idx_category_use_public_id_desc ON board (category_pk, is_use, is_public, id DESC );
CREATE INDEX idx_member_use_id_desc ON board (member_pk, is_use, id DESC);
CREATE INDEX idx_member_category_use_id_desc ON board (member_pk, category_pk, is_use, id DESC);
CREATE FULLTEXT INDEX idx_content ON board_index (content);
