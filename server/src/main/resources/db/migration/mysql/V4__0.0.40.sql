CREATE INDEX idx_id_desc_use ON board(id DESC , is_use);
CREATE INDEX idx_id_desc_use_title ON board(id DESC , is_use, title);
CREATE INDEX idx_id_desc_public_use ON board(id desc, is_use, is_public);
CREATE INDEX idx_board_pk_use ON board_comment(board_pk, is_use);