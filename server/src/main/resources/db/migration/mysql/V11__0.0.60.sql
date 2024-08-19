ALTER TABLE board_block_history add COLUMN result_status VARCHAR(20) NULL;
ALTER TABLE board ADD UNIQUE INDEX idx_id_desc (id DESC);