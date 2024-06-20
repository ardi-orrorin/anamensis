ALTER TABLE board CHANGE isPublic is_public TINYINT(1) DEFAULT 0 NULL;

CREATE TABLE board_index (
    board_id BIGINT PRIMARY KEY NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
) COMMENT 'Board content index 테이블';

ALTER TABLE board_index ADD FULLTEXT INDEX idx_content (content);
