CREATE TABLE member (
    id	        BIGSERIAL,
    user_id	    VARCHAR(50)	  NOT NULL UNIQUE,
    pwd	        VARCHAR(255)  NOT NULL UNIQUE,
    name	    VARCHAR(100)  NOT NULL,
    email	    VARCHAR(255)  NOT NULL,
    phone  	    VARCHAR(20)	  NULL,
    point       BIGINT                 DEFAULT      0,
    create_at	TIMESTAMP(6)  NOT NULL,
    update_at	TIMESTAMP(6)      NULL,
    is_use	    BOOLEAN	      NOT NULL DEFAULT      TRUE,
    s_auth      BOOLEAN       NOT NULL DEFAULT      FALSE,
    s_auth_type VARCHAR(10)   NOT NULL DEFAULT      'NONE',
    is_oauth    BOOLEAN       NOT NULL DEFAULT      FALSE
);

CREATE TABLE role (
    role         VARCHAR(20)      NOT NULL,
    member_pk    BIGINT           NOT NULL
);

CREATE TABLE otp (
    id           BIGSERIAL,
    member_pk    BIGINT           NOT NULL,
    hash         VARCHAR(255)     NOT NULL,
    create_at    TIMESTAMP(6)     NOT NULL,
    is_use       BOOLEAN          NOT NULL      DEFAULT  TRUE
);

CREATE TABLE login_history (
    id           BIGSERIAL        NOT NULL,
    member_pk    BIGINT	          NOT NULL,
    ip    	     VARCHAR(255)	  NOT NULL,
    location	 VARCHAR(255)	  NOT NULL,
    device	     VARCHAR(255)	  NOT NULL,
    create_at	 TIMESTAMP(6)	  NOT NULL
);

CREATE TABLE log_history (
    id             BIGSERIAL,
    member_pk      BIGINT                 NOT NULL,
    method         VARCHAR(10)            NOT NULL,
    path           VARCHAR(255)           NOT NULL,
    query          VARCHAR(500)           NOT NULL,
    body           TEXT,
    uri            VARCHAR(255)           NOT NULL,
    headers        TEXT                   NOT NULL,
    session        VARCHAR(500)           NOT NULL,
    local_address  VARCHAR(255)           NOT NULL,
    remote_address VARCHAR(255)           NOT NULL,
    create_at      TIMESTAMP(6)           NOT NULL
);

CREATE TABLE attendance (
    member_pk    BIGINT          NOT NULL,
    lastDate     DATE            NOT NULL,
    days         INTEGER         NOT NULL   DEFAULT 1,
    is_use       BOOLEAN         NOT NULL   DEFAULT TRUE
);

CREATE TABLE table_code (
    id           BIGSERIAL,
    table_name   VARCHAR(255)    NOT NULL,
    is_use       BOOLEAN         NOT NULL     DEFAULT   TRUE
);

CREATE TABLE file (
    id               BIGSERIAL,
    table_code_pk    BIGINT          NOT NULL,
    table_ref_pk     BIGINT          NOT NULL,
    org_file_name    VARCHAR(255)    NOT NULL,
    file_name        VARCHAR(255)    NOT NULL,
    file_path        VARCHAR(255)    NOT NULL,
    create_at        TIMESTAMP(6)    NOT NULL,
    is_use           BOOLEAN         NOT NULL    DEFAULT    TRUE,
    PRIMARY KEY (id)
);

CREATE TABLE category (
    id             BIGSERIAL,
    name           VARCHAR(255)    NOT NULL,
    parent_pk      BIGINT,
    is_use         BOOLEAN         NOT NULL       DEFAULT    TRUE
);

CREATE TABLE change_code(
    id           BIGSERIAL,
    change_name  VARCHAR(255)     NOT NULL
);

CREATE TABLE board (
    id                BIGSERIAL,
    category_pk       BIGINT          NOT NULL,
    title             VARCHAR(255)    NOT NULL,
    content           TEXT            NOT NULL,
    rate              BIGINT          NOT NULL         DEFAULT             0,
    view_count        BIGINT          NOT NULL         DEFAULT             0,
    create_at         TIMESTAMP(6)    NOT NULL,
    update_at         TIMESTAMP(6)    NOT NULL,
    member_pk         BIGINT          NOT NULL,
    isAdsense         BOOLEAN         NOT NULL         DEFAULT             FALSE,
    is_public         BOOLEAN         NOT NULL         DEFAULT             FALSE,
    members_only      BOOLEAN         NOT NULL         DEFAULT             FALSE,
    is_use            BOOLEAN         NOT NULL         DEFAULT             TRUE,
    is_blocked        BOOLEAN         NOT NULL         DEFAULT             FALSE
);

CREATE TABLE board_index (
    board_id   BIGINT    NOT NULL,
    content    TEXT      NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE board_comment (
    id             BIGSERIAL,
    board_pk       BIGINT          NOT NULL,
    blockSeq       VARCHAR(255),
    content        TEXT            NOT NULL,
    create_at      TIMESTAMP(6)    NOT NULL,
    user_id        VARCHAR(255)    NOT NULL,
    parent_pk      BIGINT,
    is_use         BOOLEAN         NOT NULL DEFAULT TRUE
);

CREATE TABLE board_history (
    id              BIGSERIAL,
    board_pk        BIGINT            NOT NULL,
    title           VARCHAR(255)      NOT NULL,
    content         TEXT              NOT NULL,
    change_code_pk  BIGINT            NOT NULL,
    create_at       TIMESTAMP(6)      NOT NULL
);

CREATE TABLE board_block_history (
    id              BIGSERIAL       NOT NULL,
    board_id        BIGINT          NOT NULL,
    member_id       BIGINT          NOT NULL,
    status          VARCHAR(32)     NOT NULL,
    reason          VARCHAR(512)    NOT NULL,
    answer          VARCHAR(512)    NULL ,
    result          VARCHAR(512)    NULL ,
    created_at      TIMESTAMP(6)    NOT NULL,
    answer_at       TIMESTAMP(6)    NULL,
    result_at       TIMESTAMP(6)    NULL,
    result_status   VARCHAR(20)     NULL
);

CREATE TABLE share_link (
    id             BIGSERIAL,
    org_link       VARCHAR(255)    NOT NULL,
    share_link     VARCHAR(255)    NOT NULL,
    create_at      TIMESTAMP(6)    NOT NULL,
    is_use         BOOLEAN         NOT NULL DEFAULT TRUE,
    member_pk      BIGINT          NOT NULL
);

CREATE TABLE point_code (
    id             BIGSERIAL,
    name           VARCHAR(255)    NOT NULL,
    point          BIGINT          NOT NULL,
    is_use         BOOLEAN         NOT NULL       DEFAULT   TRUE
);

CREATE TABLE point_history (
    id             BIGSERIAL,
    table_code_pk  BIGINT           NOT NULL,
    table_ref_pk   BIGINT           NOT NULL,
    member_pk      BIGINT           NOT NULL,
    point_code_pk  BIGINT           NOT NULL,
    value          BIGINT           NOT NULL,
    created_at     TIMESTAMP(6)     NOT NULL
);

CREATE TABLE email_verify (
    id              BIGSERIAL,
    email           VARCHAR(255)      NOT NULL,
    code            CHAR(6)           NOT NULL,
    create_at       TIMESTAMP(6)      NOT NULL,
    expire_at       TIMESTAMP(6)      NOT NULL,
    is_use          BOOLEAN           NOT NULL    DEFAULT    TRUE
);

CREATE TABLE member_config_smtp (
    id             BIGSERIAL,
    member_pk      BIGINT          NOT NULL,
    host           VARCHAR(255)    NOT NULL,
    port           CHAR(6)         NOT NULL,
    username       VARCHAR(255)    NOT NULL,
    password       VARCHAR(255)    NOT NULL,
    from_email     VARCHAR(255)    NOT NULL,
    from_name      VARCHAR(255)    NOT NULL,
    use_ssl        BOOLEAN         NOT NULL,
    is_use         BOOLEAN         NOT NULL    DEFAULT  TRUE,
    is_default     BOOLEAN         NOT NULL    DEFAULT  FALSE
);

CREATE TABLE smtp_push_history (
    id                    BIGSERIAL,
    member_pk             BIGINT             NOT NULL,
    member_config_smtp_pk BIGINT             NOT NULL,
    subject               VARCHAR(255)       NOT NULL,
    content               TEXT               NOT NULL,
    status                VARCHAR(20)        NOT NULL,
    message               VARCHAR(255)       NOT NULL,
    create_at             TIMESTAMP(6)       NOT NULL
);

CREATE TABLE web_sys (
    code        CHAR(4)      NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    permission  varchar(10)  NOT NULL
);

CREATE TABLE system_message (
    id          BIGSERIAL,
    web_sys_pk  CHAR(4)        NOT NULL,
    subject     VARCHAR(255)   NOT NULL,
    content     TEXT,
    create_at   TIMESTAMP(6)   NOT NULL,
    update_at   TIMESTAMP(6)   NOT NULL,
    is_use      BOOLEAN        NOT NULL DEFAULT TRUE,
    extra1      TEXT,
    extra2      TEXT,
    extra3      TEXT,
    extra4      TEXT,
    extra5      TEXT
);

CREATE TABLE smtp_push_history_count (
    member_pk              BIGINT      NOT NULL,
    member_config_smtp_pk  BIGINT      NOT NULL,
    count                  BIGINT      NOT NULL        DEFAULT      0
);

CREATE TABLE board_comment_count (
    board_pk BIGINT NOT NULL,
    count    BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE log_history_count (
    member_pk BIGINT NOT NULL,
    count     BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE point_history_count (
    member_pk BIGINT NOT NULL,
    count     BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE board_favorite (
    board_pk  BIGINT NOT NULL,
    member_pk BIGINT NOT NULL
);

CREATE TABLE board_template (
    id                BIGSERIAL,
    name              VARCHAR(255)    NOT NULL,
    content           TEXT            NOT NULL,
    create_at         TIMESTAMP(6)    NOT NULL,
    update_at         TIMESTAMP(6)    NOT NULL,
    member_pk         BIGINT          NOT NULL,
    is_public         BOOLEAN         NOT NULL      DEFAULT        FALSE,
    members_only      BOOLEAN         NOT NULL      DEFAULT        FALSE,
    is_use            BOOLEAN         NOT NULL      DEFAULT        TRUE
);

CREATE TABLE schedule_alert (
    id         BIGSERIAL,
    hash_id    VARCHAR(255)                  NOT NULL,
    board_id   BIGINT                        NOT NULL,
    user_id    VARCHAR(255)                  NOT NULL,
    title      VARCHAR(60)                   NOT NULL,
    alert_time TIMESTAMP                     NOT NULL,
    is_read    BOOLEAN        DEFAULT FALSE  NOT NULL
);

-- ADD PRIMARY KEY
ALTER TABLE attendance ADD PRIMARY KEY (member_pk);
ALTER TABLE board ADD PRIMARY KEY (id);
ALTER TABLE board_block_history ADD PRIMARY KEY (id);
ALTER TABLE board_comment ADD PRIMARY KEY (id);
ALTER TABLE board_comment_count ADD PRIMARY KEY (board_pk);
ALTER TABLE board_favorite ADD PRIMARY KEY (board_pk, member_pk);
ALTER TABLE board_history ADD PRIMARY KEY (id);
ALTER TABLE board_index ADD PRIMARY KEY (board_id);
ALTER TABLE board_template ADD PRIMARY KEY (id);
ALTER TABLE category ADD PRIMARY KEY (id);
ALTER TABLE change_code ADD PRIMARY KEY (id);
ALTER TABLE email_verify ADD PRIMARY KEY (id);
ALTER TABLE log_history ADD PRIMARY KEY (id);
ALTER TABLE log_history_count ADD PRIMARY KEY (member_pk);
ALTER TABLE login_history ADD PRIMARY KEY (id);
ALTER TABLE member ADD PRIMARY KEY (id);
ALTER TABLE member_config_smtp ADD PRIMARY KEY (id);
ALTER TABLE otp ADD PRIMARY KEY (id);
ALTER TABLE point_code ADD PRIMARY KEY (id);
ALTER TABLE point_history ADD PRIMARY KEY (id);
ALTER TABLE point_history_count ADD PRIMARY KEY (member_pk);
ALTER TABLE role ADD PRIMARY KEY (role, member_pk);
ALTER TABLE schedule_alert ADD PRIMARY KEY (id);
ALTER TABLE share_link ADD PRIMARY KEY (id);
ALTER TABLE smtp_push_history ADD PRIMARY KEY (id);
ALTER TABLE smtp_push_history_count ADD PRIMARY KEY (member_pk, member_config_smtp_pk);
ALTER TABLE system_message ADD PRIMARY KEY (id);
ALTER TABLE table_code ADD PRIMARY KEY (id);
ALTER TABLE web_sys ADD PRIMARY KEY (code);

-- FOREIGN KEY
ALTER TABLE attendance ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE board ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE board ADD FOREIGN KEY (category_pk) REFERENCES category(id);
ALTER TABLE board_block_history ADD FOREIGN KEY (board_id) REFERENCES board(id);
ALTER TABLE board_block_history ADD FOREIGN KEY (member_id) REFERENCES member(id);
ALTER TABLE board_comment ADD FOREIGN KEY (board_pk) REFERENCES board(id);
ALTER TABLE board_comment ADD FOREIGN KEY (user_id) REFERENCES member(user_id);
ALTER TABLE board_comment ADD FOREIGN KEY (parent_pk) REFERENCES board_comment(id);
ALTER TABLE board_comment_count ADD FOREIGN KEY (board_pk) REFERENCES board(id);
ALTER TABLE board_favorite ADD FOREIGN KEY (board_pk) REFERENCES board(id);
ALTER TABLE board_favorite ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE board_history ADD FOREIGN KEY (board_pk) REFERENCES board(id);
ALTER TABLE board_history ADD FOREIGN KEY (change_code_pk) REFERENCES change_code(id);
ALTER TABLE board_template ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE category ADD FOREIGN KEY (parent_pk) REFERENCES category(id);
ALTER TABLE file ADD FOREIGN KEY (table_code_pk) REFERENCES table_code(id);
ALTER TABLE log_history ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE log_history_count ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE login_history ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE member_config_smtp ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE otp ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE point_history ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE point_history ADD FOREIGN KEY (point_code_pk) REFERENCES point_code(id);
ALTER TABLE point_history ADD FOREIGN KEY (table_code_pk) REFERENCES table_code(id);
ALTER TABLE point_history_count ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE schedule_alert ADD FOREIGN KEY (board_id) REFERENCES board (id);
ALTER TABLE schedule_alert ADD FOREIGN KEY (user_id) REFERENCES member (user_id);
ALTER TABLE share_link ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE smtp_push_history ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE smtp_push_history ADD FOREIGN KEY (member_config_smtp_pk) REFERENCES member_config_smtp(id);
ALTER TABLE system_message ADD FOREIGN KEY (web_sys_pk) REFERENCES web_sys(code);

-- ADD OTHER KEY
ALTER TABLE attendance ADD CHECK ( days >= 1 );
ALTER TABLE category ADD UNIQUE (name);
ALTER TABLE file ADD UNIQUE (file_name, file_path);
ALTER TABLE member ADD UNIQUE (user_id);
ALTER TABLE point_code ADD UNIQUE (name);
ALTER TABLE schedule_alert ADD UNIQUE (hash_id, board_id);
ALTER TABLE table_code ADD UNIQUE (table_name);

-- ADD INDEX

CREATE UNIQUE INDEX idx_id_desc ON board (id DESC);
CREATE INDEX idx_use ON board (is_use);
CREATE INDEX idx_title ON board (title);
CREATE INDEX idx_public ON board (is_public);
CREATE INDEX idx_category_pk ON board (category_pk);
CREATE INDEX idx_member_pk ON board (member_pk);
CREATE INDEX idx_is_blocked ON board (is_blocked);
CREATE INDEX idx_content ON board_index (content);
CREATE INDEX idx_board_pk_use ON board_comment (board_pk, is_use);
CREATE INDEX idx_id_desc_member_pk ON point_history (id desc, member_pk);
CREATE INDEX idx_user_id_create_at_desc ON member (user_id, create_at DESC);
CREATE INDEX idx_id_member_pk_use ON board_template (id, member_pk, is_use);
CREATE INDEX idx_id_desc_boardId_member_Id ON board_block_history (id DESC, board_id, member_id);
CREATE INDEX idx_alert_time_user_id_board_id_read ON schedule_alert (alert_time, user_id, board_id, is_read);

-- ADD COMMENT
COMMENT ON TABLE member              IS '사용자 정보';
COMMENT ON COLUMN member.id          IS 'PK';
COMMENT ON COLUMN member.user_id     IS '계정 아이디';
COMMENT ON COLUMN member.pwd         IS '패스워드';
COMMENT ON COLUMN member.name        IS '이름';
COMMENT ON COLUMN member.email       IS '이메일';
COMMENT ON COLUMN member.phone       IS '핸드폰 번호';
COMMENT ON COLUMN member.point       IS '포인트';
COMMENT ON COLUMN member.create_at   IS '생성일자';
COMMENT ON COLUMN member.update_at   IS '정보 수정 일자';
COMMENT ON COLUMN member.is_use      IS '계정 사용여부 0:사용안함, 1:사용';
COMMENT ON COLUMN member.s_auth      IS '2차 인증 사용어부 0:사용안함, 1:사용';
COMMENT ON COLUMN member.s_auth_type IS '2차 인증 타입';
COMMENT ON COLUMN member.is_oauth    IS '사용 여부 0:사용안함, 1:사용';

COMMENT ON TABLE role                IS '권한 정보';
COMMENT ON COLUMN role.role          IS '권한 정보';
COMMENT ON COLUMN role.member_pk     IS '사용자 PK';

COMMENT ON TABLE otp                 IS 'OTP 정보';
COMMENT ON COLUMN otp.id             IS 'PK';
COMMENT ON COLUMN otp.member_pk      IS '사용자 PK';
COMMENT ON COLUMN otp.hash           IS 'OTP 코드';
COMMENT ON COLUMN otp.create_at      IS '생성일자';
COMMENT ON COLUMN otp.is_use         IS '사용여부 0:사용안함, 1:사용';

COMMENT ON TABLE login_history            IS '로그인 이력';
COMMENT ON COLUMN login_history.id        IS 'PK';
COMMENT ON COLUMN login_history.member_pk IS '사용자 PK';
COMMENT ON COLUMN login_history.ip        IS '접속 IP주소';
COMMENT ON COLUMN login_history.location  IS '접속장소';
COMMENT ON COLUMN login_history.device    IS '단말기정보';
COMMENT ON COLUMN login_history.create_at IS '생성일자';

COMMENT ON TABLE log_history                 IS 'API 호출 로그';
COMMENT ON COLUMN log_history.id             IS 'PK';
COMMENT ON COLUMN log_history.member_pk      IS '사용자 PK';
COMMENT ON COLUMN log_history.method         IS '호출 메소드';
COMMENT ON COLUMN log_history.path           IS '호출 경로';
COMMENT ON COLUMN log_history.query          IS '쿼리';
COMMENT ON COLUMN log_history.body           IS '내용';
COMMENT ON COLUMN log_history.uri            IS 'URI';
COMMENT ON COLUMN log_history.headers        IS '헤더';
COMMENT ON COLUMN log_history.session        IS '세션';
COMMENT ON COLUMN log_history.local_address  IS '로컬 주소';
COMMENT ON COLUMN log_history.remote_address IS '원격 주소';
COMMENT ON COLUMN log_history.create_at      IS '생성일자';

COMMENT ON TABLE attendance              IS '출석 정보';
COMMENT ON COLUMN attendance.member_pk   IS '사용자 PK';
COMMENT ON COLUMN attendance.lastDate    IS '마지막 출석일';
COMMENT ON COLUMN attendance.days        IS '출석일수';
COMMENT ON COLUMN attendance.is_use      IS '사용여부 0:사용안함, 1:사용';

COMMENT ON TABLE table_code             IS '테이블 코드';
COMMENT ON COLUMN table_code.id         IS 'PK';
COMMENT ON COLUMN table_code.table_name IS '테이블 이름';
COMMENT ON COLUMN table_code.is_use     IS '사용여부 0:사용안함, 1:사용';

COMMENT ON TABLE file                IS '파일 테이블';
COMMENT ON COLUMN file.id            IS 'PK';
COMMENT ON COLUMN file.table_code_pk IS '테이블 코드 PK';
COMMENT ON COLUMN file.table_ref_pk  IS '참고 테이블 PK';
COMMENT ON COLUMN file.org_file_name IS '원본 파일 이름';
COMMENT ON COLUMN file.file_name     IS '변경 파일 이름';
COMMENT ON COLUMN file.file_path     IS '하위 경로';
COMMENT ON COLUMN file.create_at     IS '생성일자';
COMMENT ON COLUMN file.is_use        IS '사용 여부 0:사용안함, 1:사용';

COMMENT ON TABLE category            IS '카테고리 테이블';
COMMENT ON COLUMN category.id        IS 'PK';
COMMENT ON COLUMN category.name      IS '카테고리 이름';
COMMENT ON COLUMN category.parent_pk IS '상위 카테고리 PK';
COMMENT ON COLUMN category.is_use    IS '사용 여부 false:사용안함, true:사용';

COMMENT ON TABLE change_code              IS '변경 코드 테이블';
COMMENT ON COLUMN change_code.id          IS 'PK';
COMMENT ON COLUMN change_code.change_name IS '변경 코드 이름';

COMMENT ON COLUMN board.id           IS 'PK';
COMMENT ON COLUMN board.category_pk  IS '카테고리 PK';
COMMENT ON COLUMN board.title        IS '제목';
COMMENT ON COLUMN board.content      IS '본문';
COMMENT ON COLUMN board.rate         IS '좋아요';
COMMENT ON COLUMN board.view_count   IS '조회수';
COMMENT ON COLUMN board.create_at    IS '생성일자';
COMMENT ON COLUMN board.update_at    IS '수정일자';
COMMENT ON COLUMN board.member_pk    IS '유저 아이디';
COMMENT ON COLUMN board.isAdsense    IS '광고 여부 0:안함, 1:광고';
COMMENT ON COLUMN board.is_public    IS '공개 여부 0:안함, 1:공개';
COMMENT ON COLUMN board.members_only IS '회원 전용 0:안함, 1:회원';
COMMENT ON COLUMN board.is_use       IS '사용 여부 0:사용안함, 1:사용';

COMMENT ON TABLE board_index             IS '게시글 콘텐츠 인덱스 테이블';
COMMENT ON COLUMN board_index.board_id   IS '게시글 PK';
COMMENT ON COLUMN board_index.content    IS '인덱스용 게시글 내용';
COMMENT ON COLUMN board_index.created_at IS '생성일자';
COMMENT ON COLUMN board_index.updated_at IS '수정일자';

COMMENT ON COLUMN board_comment.id         IS 'PK';
COMMENT ON COLUMN board_comment.board_pk   IS '게시글 PK';
COMMENT ON COLUMN board_comment.blockSeq   IS '블록 시퀀스';
COMMENT ON COLUMN board_comment.content    IS '댓글 내용';
COMMENT ON COLUMN board_comment.create_at  IS '생성일자';
COMMENT ON COLUMN board_comment.user_id    IS '유저 아이디';
COMMENT ON COLUMN board_comment.parent_pk  IS '부모 댓글 PK';
COMMENT ON COLUMN board_comment.is_use     IS '사용 여부 0:사용안함, 1:사용';

COMMENT ON TABLE board_history                 IS '게시글 변경 이력';
COMMENT ON COLUMN board_history.id             IS 'PK';
COMMENT ON COLUMN board_history.board_pk       IS '게시글 PK';
COMMENT ON COLUMN board_history.title          IS '제목';
COMMENT ON COLUMN board_history.content        IS '본문';
COMMENT ON COLUMN board_history.change_code_pk IS '변경 코드 PK';
COMMENT ON COLUMN board_history.create_at      IS '생성일자';

COMMENT ON TABLE share_link             IS '링크 공유';
COMMENT ON COLUMN share_link.id         IS 'PK';
COMMENT ON COLUMN share_link.org_link   IS '원본 링크';
COMMENT ON COLUMN share_link.share_link IS '공유 링크';
COMMENT ON COLUMN share_link.create_at  IS '생성 일자';
COMMENT ON COLUMN share_link.is_use     IS '사용 여부 0:사용안함, 1:사용';
COMMENT ON COLUMN share_link.member_pk  IS '유저 PK';

COMMENT ON TABLE point_code         IS '포인트 코드';
COMMENT ON COLUMN point_code.id     IS 'PK';
COMMENT ON COLUMN point_code.name   IS '포인트 코드 이름';
COMMENT ON COLUMN point_code.point  IS '포인트 값';
COMMENT ON COLUMN point_code.is_use IS '사용 여부 0:사용안함, 1:사용';

COMMENT ON TABLE point_history                 IS '포인트 이력';
COMMENT ON COLUMN point_history.id             IS 'PK';
COMMENT ON COLUMN point_history.table_code_pk  IS '테이블 코드 PK';
COMMENT ON COLUMN point_history.table_ref_pk   IS '참조된 테이블 PK';
COMMENT ON COLUMN point_history.member_pk      IS '유저 PK';
COMMENT ON COLUMN point_history.point_code_pk  IS '포인트 코드 PK';
COMMENT ON COLUMN point_history.value          IS '포인트 값';
COMMENT ON COLUMN point_history.create_at      IS '생성일자';

COMMENT ON TABLE email_verify              IS '이메일 인증';
COMMENT ON COLUMN email_verify.id          IS 'PK';
COMMENT ON COLUMN email_verify.email       IS '이메일';
COMMENT ON COLUMN email_verify.code        IS '인증 코드';
COMMENT ON COLUMN email_verify.create_at   IS '생성일자';
COMMENT ON COLUMN email_verify.expire_at   IS '만료일자';
COMMENT ON COLUMN email_verify.is_use      IS '사용 여부 0:사용안함, 1:사용';

COMMENT ON TABLE member_config_smtp             IS '사용자 SMTP 설정';
COMMENT ON COLUMN member_config_smtp.id         IS 'PK';
COMMENT ON COLUMN member_config_smtp.member_pk  IS '사용자 PK';
COMMENT ON COLUMN member_config_smtp.host       IS 'SMTP 서버 주소';
COMMENT ON COLUMN member_config_smtp.port       IS 'SMTP 포트';
COMMENT ON COLUMN member_config_smtp.username   IS 'SMTP 사용자 아이디';
COMMENT ON COLUMN member_config_smtp.password   IS 'SMTP 사용자 비밀번호';
COMMENT ON COLUMN member_config_smtp.from_email IS 'SMTP 발신자 주소';
COMMENT ON COLUMN member_config_smtp.from_name  IS 'SMTP 발신자 이름';
COMMENT ON COLUMN member_config_smtp.use_ssl    IS 'SMTP SSL 사용 여부';
COMMENT ON COLUMN member_config_smtp.is_use     IS '사용 여부 0:사용안함, 1:사용';
COMMENT ON COLUMN member_config_smtp.is_default IS '기본 설정 여부 0:기본설정아님, 1:기본설정';

COMMENT ON TABLE smtp_push_history                          IS '사용자 PUSH 이력';
COMMENT ON COLUMN smtp_push_history.id                      IS 'PK';
COMMENT ON COLUMN smtp_push_history.member_pk               IS '사용자 PK';
COMMENT ON COLUMN smtp_push_history.member_config_smtp_pk   IS '사용자 SMTP 설정 PK';
COMMENT ON COLUMN smtp_push_history.subject                 IS '제목';
COMMENT ON COLUMN smtp_push_history.content                 IS '내용';
COMMENT ON COLUMN smtp_push_history.status                  IS '상태';
COMMENT ON COLUMN smtp_push_history.message                 IS '메시지';
COMMENT ON COLUMN smtp_push_history.create_at               IS '생성일자';

COMMENT ON TABLE web_sys                IS '시스템 정보';
COMMENT ON COLUMN web_sys.code          IS '시스템 코드';
COMMENT ON COLUMN web_sys.name          IS '이름';
COMMENT ON COLUMN web_sys.description   IS '설명';
COMMENT ON COLUMN web_sys.permission    IS '접근 권한';

COMMENT ON TABLE system_message             IS '시스템 메시지';
COMMENT ON COLUMN system_message.id         IS 'PK';
COMMENT ON COLUMN system_message.web_sys_pk IS '시스템 코드';
COMMENT ON COLUMN system_message.subject    IS '제목';
COMMENT ON COLUMN system_message.content    IS '내용';
COMMENT ON COLUMN system_message.create_at  IS '생성일';
COMMENT ON COLUMN system_message.update_at  IS '수정일';
COMMENT ON COLUMN system_message.is_use     IS '사용여부';
COMMENT ON COLUMN system_message.extra1     IS '추가1';
COMMENT ON COLUMN system_message.extra2     IS '추가2';
COMMENT ON COLUMN system_message.extra3     IS '추가3';
COMMENT ON COLUMN system_message.extra4     IS '추가4';
COMMENT ON COLUMN system_message.extra5     IS '추가5';

COMMENT ON TABLE smtp_push_history_count                        IS '사용자 PUSH 이력 카운트';
COMMENT ON COLUMN smtp_push_history_count.member_pk             IS '사용자 PK';
COMMENT ON COLUMN smtp_push_history_count.member_config_smtp_pk IS '사용자 SMTP 설정 PK';
COMMENT ON COLUMN smtp_push_history_count.count                 IS '카운트';

COMMENT ON TABLE board_template             IS '게시글 템플릿';
COMMENT ON COLUMN board_template.id         IS 'PK';
COMMENT ON COLUMN board_template.name       IS '게시글 템플릿 이름';
COMMENT ON COLUMN board_template.content    IS '본문';
COMMENT ON COLUMN board_template.create_at  IS '생성일자';
COMMENT ON COLUMN board_template.update_at  IS '수정일자';
COMMENT ON COLUMN board_template.member_pk  IS '유저 아이디';
COMMENT ON COLUMN board_template.is_public  IS '공개 여부 0:안함, 1:공개';

COMMENT ON TABLE schedule_alert             IS '일정 알림';
COMMENT ON COLUMN schedule_alert.id         IS 'PK';
COMMENT ON COLUMN schedule_alert.hash_id    IS '게시글 Hash ID';
COMMENT ON COLUMN schedule_alert.board_id   IS '게시판 ID';
COMMENT ON COLUMN schedule_alert.user_id    IS '유저 ID';
COMMENT ON COLUMN schedule_alert.title      IS '제목';
COMMENT ON COLUMN schedule_alert.alert_time IS '알림 시간';
COMMENT ON COLUMN schedule_alert.is_read    IS '읽음 여부';

-- ADD TRIGGER
CREATE OR REPLACE FUNCTION smtp_push_history_insert()
    RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO smtp_push_history_count
    (member_pk, member_config_smtp_pk, count)
    VALUES (NEW.member_pk, NEW.member_config_smtp_pk, 1)
        ON CONFLICT (member_pk, member_config_smtp_pk)
            DO UPDATE SET count = smtp_push_history_count.count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER smtp_push_history_insert
    AFTER INSERT ON smtp_push_history
    FOR EACH ROW EXECUTE FUNCTION smtp_push_history_insert();

CREATE OR REPLACE FUNCTION smtp_push_history_delete()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE smtp_push_history_count
       SET count = count - 1
     WHERE member_config_smtp_pk = OLD.member_pk
       AND member_pk = OLD.member_config_smtp_pk;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER smtp_push_history_delete
    AFTER DELETE ON smtp_push_history
    FOR EACH ROW EXECUTE FUNCTION smtp_push_history_delete();

CREATE OR REPLACE FUNCTION board_comment_count_insert()
    RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO board_comment_count (board_pk, count)
    VALUES (NEW.board_pk, 1)
        ON CONFLICT (board_pk)
            DO UPDATE SET count = board_comment_count.count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER board_comment_count_insert
    AFTER INSERT ON board_comment
    FOR EACH ROW EXECUTE FUNCTION board_comment_count_insert();

CREATE OR REPLACE FUNCTION board_comment_count_delete()
    RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_use = FALSE THEN
        UPDATE board_comment_count
           SET count = count - 1
         WHERE board_pk = OLD.board_pk;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER board_comment_count_delete
    AFTER UPDATE ON board_comment
    FOR EACH ROW EXECUTE FUNCTION board_comment_count_delete();

CREATE OR REPLACE FUNCTION log_history_count_insert()
    RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO log_history_count (member_pk, count)
    VALUES (NEW.member_pk, 1)
        ON CONFLICT (member_pk)
            DO UPDATE SET count = log_history_count.count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_history_count_insert
    AFTER INSERT ON log_history
    FOR EACH ROW EXECUTE FUNCTION log_history_count_insert();

CREATE OR REPLACE FUNCTION log_history_count_delete()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE log_history_count
       SET count = count - 1
     WHERE member_pk = OLD.member_pk;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_history_count_delete
    AFTER DELETE ON log_history
    FOR EACH ROW EXECUTE FUNCTION log_history_count_delete();

CREATE OR REPLACE FUNCTION point_history_count_insert()
    RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO point_history_count (member_pk, count)
    VALUES (NEW.member_pk, 1)
        ON CONFLICT (member_pk)
            DO UPDATE SET count = point_history_count.count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER point_history_count_insert
    AFTER INSERT ON point_history
    FOR EACH ROW EXECUTE FUNCTION point_history_count_insert();

CREATE OR REPLACE FUNCTION point_history_count_delete()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE point_history_count
       SET count = count - 1
     WHERE member_pk = OLD.member_pk;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER point_history_count_delete
    AFTER DELETE ON point_history
    FOR EACH ROW EXECUTE FUNCTION point_history_count_delete();


-- ADD DEFAULT DATA
INSERT INTO web_sys
       (code, name, description, permission)
VALUES ('001', 'default', '기본값', 'ADMIN')
     , ('002', 'auth', '2차 인증 변경알림', 'ADMIN')
     , ('003', 'confirmLogin', '로그인 위치 확인', 'ADMIN');

INSERT INTO system_message
       (id, web_sys_pk, subject, content, create_at, update_at)
VALUES (1, '001', '시스템 메시지', '시스템 메시지입니다.', current_timestamp, now())
     , (2, '002','2차 인증 비활성화', '%s님의 2차 인증 설정이 변경되었습니다.', now(), now())
     , (3, '002','2차 인증 활성화', '%s님의 2차 인증 설정이 변경되었습니다.', now(), now())
     , (4, '003','새로운 장소에서 로그인이 발생했습니다.', ' ip : %s </br> device : %s </br> location : %s </br> 에서 로그인이 발생했습니다.', now(), now());

INSERT INTO point_code
(id, name, point)
VALUES (1,  'attend-1',      10)
     , (2,  'attend-2',      15)
     , (3,  'attend-3',      15)
     , (4,  'attend-4',      30)
     , (5,  'attend-5',      30)
     , (6,  'attend-6',      50)
     , (7,  'attend-7',      50)
     , (8,  'attend-8',      50)
     , (9,  'attend-9',      50)
     , (10, 'attend-10',     100)
     , (11, 'board',         15)
     , (12, 'board_comment', 5)
     , (13, 'q&a',           0);


INSERT INTO table_code
(id, table_name)
VALUES (1, 'member')
     , (2, 'board')
     , (3, 'board_comment')
     , (4, 'attendance');

INSERT INTO category
(id, name, parent_pk)
VALUES (1, 'notice'  , NULL)
     , (2, 'free'    , NULL)
     , (3, 'qna'     , NULL)
     , (4, 'alttuel' , NULL)
     , (5, 'album'   , NULL)
     , (6, 'schedule', NULL);

INSERT INTO board_comment_count (board_pk, count)
SELECT bc.board_pk, count(bc.id) as count from board_comment bc GROUP BY (bc.board_pk);

INSERT INTO log_history_count (member_pk, count)
SELECT lh.member_pk, count(lh.id) as count from log_history lh GROUP BY (lh.member_pk);

INSERT INTO point_history_count (member_pk, count)
SELECT lh.member_pk, count(lh.id) as count from point_history lh GROUP BY (lh.member_pk);


INSERT INTO member (id, user_id, pwd, name, email, phone, create_at, update_at)
VALUES (1, 'master', '$2a$10$2duD9QVPe4rtDFbAQO7kK.sV8csuKvKx97AlPP.decA9.4.whTRiq', 'master', '', '', now(), now());

INSERT INTO role (role, member_pk)
VALUES ('ADMIN', 1),
       ('MASTER', 1),
       ('USER', 1),
       ('GUEST', 1);