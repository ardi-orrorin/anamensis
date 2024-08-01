ALTER TABLE member DROP KEY email;

ALTER TABLE board ADD COLUMN is_blocked TINYINT(1) NOT NULL DEFAULT 0;

CREATE TABLE board_block_history (
    id         BIGINT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
    board_id   BIGINT          NOT NULL,
    member_id  BIGINT          NOT NULL,
    status     VARCHAR(32)     NOT NULL,
    reason     VARCHAR(512)    NOT NULL,
    answer     VARCHAR(512)    NULL ,
    result     VARCHAR(512)    NULL ,
    created_at TIMESTAMP(6)    NOT NULL,
    answer_at  TIMESTAMP(6)    NULL,
    result_at  TIMESTAMP(6)    NULL
);

ALTER TABLE board_block_history ADD FOREIGN KEY (board_id) REFERENCES board(id);
ALTER TABLE board_block_history ADD FOREIGN KEY (member_id) REFERENCES member(id);
ALTER TABLE board_block_history ADD INDEX idx_id_desc_boardId_member_Id(id DESC, board_id, member_id);

