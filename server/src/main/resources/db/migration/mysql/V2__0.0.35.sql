CREATE TABLE board_comment_count (
    board_pk BIGINT NOT NULL,
    count    BIGINT NOT NULL DEFAULT 0
);

ALTER TABLE board_comment_count ADD FOREIGN KEY (board_pk) REFERENCES board(id);
ALTER TABLE board_comment_count ADD PRIMARY KEY (board_pk);

CREATE TRIGGER board_comment_count_insert
    AFTER INSERT ON board_comment
    FOR EACH ROW
BEGIN
    INSERT INTO board_comment_count
           (board_pk, count)
    VALUES (new.board_pk, 1)
        ON DUPLICATE KEY
            UPDATE count = count + 1;
END ;

CREATE TRIGGER board_comment_count_delete
    AFTER DELETE ON board_comment
    FOR EACH ROW
BEGIN
    UPDATE board_comment_count
       SET count = count - 1
     WHERE board_pk = old.board_pk;
END ;

INSERT INTO board_comment_count (board_pk, count)
SELECT bc.board_pk, count(bc.id) as count from board_comment bc GROUP BY (bc.board_pk);
