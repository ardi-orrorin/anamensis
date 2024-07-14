DROP TABLE IF EXISTS board_comment_count;
DROP TABLE IF EXISTS log_history_count;
DROP TABLE IF EXISTS point_history_count;
DROP TRIGGER IF EXISTS board_comment_count_insert;
DROP TRIGGER IF EXISTS board_comment_count_delete;
DROP TRIGGER IF EXISTS log_history_count_insert;
DROP TRIGGER IF EXISTS log_history_count_delete;
DROP TRIGGER IF EXISTS point_history_count_insert;
DROP TRIGGER IF EXISTS point_history_count_delete;

CREATE TABLE board_comment_count (
    board_pk BIGINT NOT NULL,
    count    BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE log_history_count (
    member_pk BIGINT NOT NULL,
    count    BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE point_history_count (
    member_pk BIGINT NOT NULL,
    count     BIGINT NOT NULL DEFAULT 0
);

ALTER TABLE board_comment_count ADD FOREIGN KEY (board_pk) REFERENCES board(id);
ALTER TABLE board_comment_count ADD PRIMARY KEY (board_pk);
ALTER TABLE log_history_count ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE log_history_count ADD PRIMARY KEY (member_pk);
ALTER TABLE point_history_count ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE point_history_count ADD PRIMARY KEY (member_pk);

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

CREATE TRIGGER log_history_count_insert
    AFTER INSERT ON log_history
    FOR EACH ROW
BEGIN
    INSERT INTO log_history_count
    (member_pk, count)
    VALUES (new.member_pk, 1)
        ON DUPLICATE KEY
            UPDATE count = count + 1;
END ;

CREATE TRIGGER log_history_count_delete
    AFTER DELETE ON log_history
    FOR EACH ROW
BEGIN
    UPDATE log_history_count
       SET count = count - 1
     WHERE member_pk = old.member_pk;
END ;

CREATE TRIGGER point_history_count_insert
    AFTER INSERT ON point_history
    FOR EACH ROW
BEGIN
    INSERT INTO point_history_count
    (member_pk, count)
    VALUES (new.member_pk, 1)
        ON DUPLICATE KEY
            UPDATE count = count + 1;
END ;

CREATE TRIGGER point_history_count_delete
    AFTER DELETE ON point_history
    FOR EACH ROW
BEGIN
    UPDATE point_history_count
       SET count = count - 1
     WHERE member_pk = old.member_pk;
END ;


INSERT INTO board_comment_count (board_pk, count)
SELECT bc.board_pk, count(bc.id) as count from board_comment bc GROUP BY (bc.board_pk);

INSERT INTO log_history_count (member_pk, count)
SELECT lh.member_pk, count(lh.id) as count from log_history lh GROUP BY (lh.member_pk);

INSERT INTO point_history_count (member_pk, count)
SELECT lh.member_pk, count(lh.id) as count from point_history lh GROUP BY (lh.member_pk);