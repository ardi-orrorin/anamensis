ALTER TABLE member ADD COLUMN is_oauth TINYINT(1) NOT NULL DEFAULT 0 COMMENT '사용 여부 0:사용안함, 1:사용';
ALTER TABLE member DROP KEY email;
ALTER TABLE member ADD UNIQUE KEY email (email, is_oauth);

