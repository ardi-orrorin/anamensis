CREATE TABLE schedule_alert (
    id         BIGINT        AUTO_INCREMENT  PRIMARY KEY  COMMENT 'PK',
    hash_id    VARCHAR(255)                  NOT NULL     COMMENT '게시글 Hash ID',
    board_id   BIGINT                        NOT NULL     COMMENT '게시판 ID',
    user_id    VARCHAR(255)                  NOT NULL     COMMENT '유저 ID',
    title      VARCHAR(60)                   NOT NULL     COMMENT '제목',
    alert_time TIMESTAMP                     NOT NULL     COMMENT '알림 시간',
    is_read    TINYINT(1)    DEFAULT 0       NOT NULL     COMMENT '읽음 여부'
);

ALTER TABLE schedule_alert ADD UNIQUE (hash_id, board_id);
ALTER TABLE schedule_alert ADD FOREIGN KEY (board_id) REFERENCES board (id);
ALTER TABLE schedule_alert ADD FOREIGN KEY (user_id) REFERENCES member (user_id);
ALTER TABLE schedule_alert ADD INDEX idx_alert_time_user_id_board_id_read (alert_time, user_id, board_id, is_read);