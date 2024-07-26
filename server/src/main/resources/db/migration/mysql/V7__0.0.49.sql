CREATE TABLE board_template (
    id                BIGINT          PRIMARY KEY      AUTO_INCREMENT              COMMENT 'PK',
    name              VARCHAR(255)    NOT NULL                                     COMMENT '게시글 템플릿 이름',
    content           TEXT            NOT NULL                                     COMMENT '본문',
    create_at         TIMESTAMP(6)    NOT NULL                                     COMMENT '생성일자',
    update_at         TIMESTAMP(6)    NOT NULL                                     COMMENT '수정일자',
    member_pk         BIGINT(255)     NOT NULL                                     COMMENT '유저 아이디',
    is_public         TINYINT(1)      NOT NULL         DEFAULT             0       COMMENT '공개 여부 0:안함, 1:공개',
    members_only      TINYINT(1)      NOT NULL         DEFAULT             0       COMMENT '회원 전용 0:안함, 1:회원',
    is_use            TINYINT(1)      NOT NULL         DEFAULT             1       COMMENT '사용 여부 0:사용안함, 1:사용'
) COMMENT '게시글 템플릿';

ALTER TABLE board_template ADD INDEX idx_id_member_pk_use (id, member_pk, is_use);