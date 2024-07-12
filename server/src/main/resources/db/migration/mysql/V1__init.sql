CREATE TABLE member (
    id	        BIGINT	      NOT NULL PRIMARY KEY  AUTO_INCREMENT     COMMENT 'PK'          ,
    user_id	    VARCHAR(50)	  NOT NULL UNIQUE     	                   COMMENT '계정 아이디',
    pwd	        VARCHAR(255)  NOT NULL UNIQUE    	                   COMMENT '패스워드',
    name	    VARCHAR(100)  NOT NULL          	                   COMMENT '이름',
    email	    VARCHAR(255)  NOT NULL UNIQUE    	                   COMMENT '이메일',
    phone  	    VARCHAR(20)	  NULL              	                   COMMENT '핸드폰 번호',
    point       BIGINT                 DEFAULT      0                  COMMENT '포인트',
    create_at	TIMESTAMP(6)  NOT NULL                                 COMMENT '생성일자',
    update_at	TIMESTAMP(6)      NULL                                 COMMENT '정보 수정 일자',
    is_use	    TINYINT	      NOT NULL DEFAULT      1	               COMMENT '계정 사용여부 0:사용안함, 1:사용',
    s_auth      TINYINT       NOT NULL DEFAULT      0                  COMMENT '2차 인증 사용어부 0:사용안함, 1:사용',
    s_auth_type VARCHAR(10)   NOT NULL DEFAULT      'NONE'             COMMENT '2차 인증 타입'
) COMMENT '사용자 정보';

CREATE TABLE role (
    role         VARCHAR(20)      NOT NULL                             COMMENT '권한 정보',
    member_pk    BIGINT	          NOT NULL                             COMMENT '사용자 PK'
) COMMENT '권한 정보';

CREATE TABLE otp (
    id           BIGINT           PRIMARY KEY   AUTO_INCREMENT       COMMENT 'PK',
    member_pk    BIGINT           NOT NULL                           COMMENT '사용자 PK',
    hash         VARCHAR(255)     NOT NULL                           COMMENT 'OTP 코드',
    create_at    TIMESTAMP(6)     NOT NULL                           COMMENT '생성일자',
    is_use       TINYINT(1)       NOT NULL      DEFAULT 1            COMMENT '사용여부 0:사용안함, 1:사용'
) COMMENT 'OTP 정보';

CREATE TABLE login_history (
    id           BIGINT	          NOT NULL    PRIMARY KEY       AUTO_INCREMENT       COMMENT 'PK',
    member_pk    BIGINT	          NOT NULL                                           COMMENT '사용자 PK',
    ip    	     VARCHAR(255)	  NOT NULL	                                         COMMENT '접속 IP주소',
    location	 VARCHAR(255)	  NOT NULL	                                         COMMENT '접속장소',
    device	     VARCHAR(255)	  NOT NULL	                                         COMMENT '단말기정보',
    create_at	 TIMESTAMP(6)	  NOT NULL                                           COMMENT '생성일자'
) COMMENT '로그인 이력';

CREATE TABLE log_history (
    id             BIGINT                 AUTO_INCREMENT     PRIMARY KEY,
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
) COMMENT 'api 호출 로그 테이블';

CREATE TABLE attendance (
    member_pk    BIGINT          NOT NULL   PRIMARY KEY,
    lastDate     DATE            NOT NULL,
    days         INT NOT         NULL       DEFAULT 1,
    is_use       TINYINT         NOT NULL   DEFAULT 1
) COMMENT '출석 정보';

CREATE TABLE table_code (
    id           BIGINT          PRIMARY KEY  AUTO_INCREMENT    COMMENT 'PK',
    table_name   VARCHAR(255)    NOT NULL     UNIQUE            COMMENT '테이블 이름',
    is_use       TINYINT(1)      NOT NULL     DEFAULT 1         COMMENT '사용여부 0:사용안함, 1:사용'
) COMMENT '테이블 코드';

CREATE TABLE file (
    id               BIGINT          PRIMARY KEY            AUTO_INCREMENT                                  COMMENT 'PK',
    table_code_pk    BIGINT          NOT NULL                                                               COMMENT '테이블 코드 PK',
    table_ref_pk     BIGINT          NOT NULL                                                               COMMENT '참고 테이블 Pk',
    org_file_name    VARCHAR(255)    NOT NULL                                                               COMMENT '원본 파일 이름',
    file_name        VARCHAR(255)    NOT NULL                                                               COMMENT '변경 파일 이름',
    file_path        VARCHAR(255)    NOT NULL                                                               COMMENT '하위 경로',
    create_at        TIMESTAMP(6)    NOT NULL                                                               COMMENT '생성일자',
    is_use           TINYINT(1)      NOT NULL               DEFAULT                     1                   COMMENT '사영 여부 0:사용안함, 1:사용'
) COMMENT '파일 테이블';

CREATE TABLE category (
    id             BIGINT          PRIMARY KEY    AUTO_INCREMENT           COMMENT 'PK',
    name           VARCHAR(255)    NOT NULL       UNIQUE                   COMMENT '카테고리 이름',
    parent_pk      BIGINT                                                  COMMENT '카테고리 PK',
    is_use         TINYINT(1)      NOT NULL       DEFAULT               1  COMMENT '사용여부 0:사용안함, 1:사용'
) COMMENT '카테고리';

CREATE TABLE change_code(
    id           BIGINT           PRIMARY KEY    AUTO_INCREMENT  COMMENT 'PK',
    change_name  VARCHAR(255)     NOT NULL                       COMMENT '변경 코드 이름'
) COMMENT '변경 코드';

CREATE TABLE board (
    id                BIGINT          PRIMARY KEY      AUTO_INCREMENT              COMMENT 'PK',
    category_pk       BIGINT          NOT NULL                                     COMMENT '카테고리 PK',
    title             VARCHAR(255)    NOT NULL                                     COMMENT '제목',
    content           TEXT            NOT NULL                                     COMMENT '본문',
    rate              BIGINT          NOT NULL         DEFAULT             0       COMMENT '좋아요',
    view_count        BIGINT          NOT NULL         DEFAULT             0       COMMENT '조회수',
    create_at         TIMESTAMP(6)    NOT NULL                                     COMMENT '생성일자',
    update_at         TIMESTAMP(6)    NOT NULL                                     COMMENT '수정일자',
    member_pk         BIGINT(255)     NOT NULL                                     COMMENT '유저 아이디',
    isAdsense         TINYINT(1)      NOT NULL         DEFAULT             0       COMMENT '광고 여부 0:안함, 1:광고',
    is_public         TINYINT(1)      NOT NULL         DEFAULT             0       COMMENT '공개 여부 0:안함, 1:공개',
    members_only      TINYINT(1)      NOT NULL         DEFAULT             0       COMMENT '회원 전용 0:안함, 1:회원',
    is_use            TINYINT(1)      NOT NULL         DEFAULT             1       COMMENT '사용 여부 0:사용안함, 1:사용'
) COMMENT '게시글';

CREATE TABLE board_index (
    board_id BIGINT PRIMARY KEY NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
) COMMENT 'Board content index 테이블';

CREATE TABLE board_comment (
    id             BIGINT          PRIMARY KEY    AUTO_INCREMENT                     COMMENT 'PK',
    board_pk       BIGINT          NOT NULL                                          COMMENT '게시글 PK',
    blockSeq       VARCHAR(255)                                                      COMMENT '블록 시퀀스',
    content        TEXT            NOT NULL                                          COMMENT '댓글 내용',
    create_at      TIMESTAMP(6)    NOT NULL                                          COMMENT '생성일자',
    user_id        VARCHAR(255)    NOT NULL                                          COMMENT '유저 아이디',
    parent_pk      BIGINT                                                            COMMENT '댓글 PK',
    is_use         TINYINT(1)      NOT NULL       DEFAULT          1                 COMMENT '사용 여부 0:사용안함, 1:사용'
) COMMENT '게시글 댓글';

CREATE TABLE board_history (
    id              BIGINT            PRIMARY KEY         AUTO_INCREMENT       COMMENT 'PK',
    board_pk        BIGINT            NOT NULL                                 COMMENT '게시글 PK',
    title           VARCHAR(255)      NOT NULL                                 COMMENT '제목',
    content         TEXT              NOT NULL                                 COMMENT '본문',
    change_code_pk  BIGINT            NOT NULL                                 COMMENT '변경코드 PK',
    create_at       TIMESTAMP(6)      NOT NULL                                 COMMENT '생성일자'
) COMMENT '게시글 변경 이력';

CREATE TABLE share_link (
    id             BIGINT          PRIMARY KEY    AUTO_INCREMENT                        COMMENT 'PK',
    org_link       VARCHAR(255)    NOT NULL                                             COMMENT '원본 링크',
    share_link     VARCHAR(255)    NOT NULL                                             COMMENT '공유 링크',
    create_at      TIMESTAMP(6)    NOT NULL                                             COMMENT '생성 일자',
    is_use         TINYINT(1)      NOT NULL       DEFAULT            1                  COMMENT '사용 여부 0:사용안함, 1:사용',
    member_pk      BIGINT          NOT NULL                                             COMMENT '유저 PK'
) COMMENT '링크 공유';

CREATE TABLE point_code (
    id             BIGINT          PRIMARY KEY    AUTO_INCREMENT    COMMENT 'PK',
    name           VARCHAR(255)    NOT NULL       UNIQUE            COMMENT '포인트 적립 이름',
    point          BIGINT          NOT NULL                         COMMENT '포인트 값',
    is_use         TINYINT(1)      NOT NULL       DEFAULT 1         COMMENT '사용여부 0:사용안함, 1:사용'
) COMMENT '포인트 코드';

CREATE TABLE point_history (
    id             BIGINT          PRIMARY KEY    AUTO_INCREMENT    COMMENT 'PK',
    table_code_pk  BIGINT          NOT NULL                         COMMENT '테이블 이름',
    table_ref_pk   BIGINT          NOT NULL                         COMMENT '참조된 테이블 PK',
    member_pk      BIGINT          NOT NULL                         COMMENT '유저 PK',
    point_code_pk  BIGINT          NOT NULL                         COMMENT '포인트 코드 PK',
    value          INT             NOT NULL                         COMMENT '포인트 값',
    create_at      TIMESTAMP(6)    NOT NULL                         COMMENT '생성일자'
) COMMENT '포인트 이력';

CREATE TABLE email_verify (
    id              BIGINT            PRIMARY KEY         AUTO_INCREMENT            COMMENT 'PK',
    email           VARCHAR(255)      NOT NULL                                      COMMENT '이메일',
    code            CHAR(6)           NOT NULL                                      COMMENT '인증 코드',
    create_at       TIMESTAMP(6)      NOT NULL                                      COMMENT '생성일자',
    expire_at       TIMESTAMP(6)      NOT NULL                                      COMMENT '만료일자',
    is_use          TINYINT(1)        NOT NULL            DEFAULT           1       COMMENT '사용 여부 0:사용안함, 1:사용'
) COMMENT '이메일 인증';

CREATE TABLE member_config_smtp (
    id             BIGINT          AUTO_INCREMENT    PRIMARY KEY ,
    member_pk      BIGINT          NOT NULL,
    host           VARCHAR(255)    NOT NULL                         COMMENT  'SMTP 서버 주소',
    port           CHAR(6)         NOT NULL                         COMMENT  'SMTP 포트',
    username       VARCHAR(255)    NOT NULL                         COMMENT  'SMTP 사용자 아이디',
    password       VARCHAR(255)    NOT NULL                         COMMENT  'SMTP 사용자 비밀번호',
    from_email     VARCHAR(255)    NOT NULL                         COMMENT  'SMTP 발신자 주소',
    from_name      VARCHAR(255)    NOT NULL                         COMMENT  'SMTP 발신자 이름',
    use_ssl        TINYINT(1)      NOT NULL                         COMMENT  'SMTP SSL 사용 여부',
    is_use         TINYINT(1)      NOT NULL          DEFAULT  1     COMMENT  '사용 여부 0:사용안함, 1:사용',
    is_default     TINYINT(1)      NOT NULL          DEFAULT  0     COMMENT  '기본 설정 여부 0:기본설정아님, 1:기본설정'
) COMMENT '사용자 SMTP 설정';

CREATE TABLE smtp_push_history (
    id                    BIGINT                      AUTO_INCREMENT PRIMARY KEY,
    member_pk             BIGINT                      NOT NULL                           COMMENT '사용자 PK',
    member_config_smtp_pk BIGINT                      NOT NULL                           COMMENT '사용자 SMTP 설정 PK',
    subject               VARCHAR(255)                NOT NULL                           COMMENT '제목',
    content               TEXT                        NOT NULL                           COMMENT '내용',
    status                VARCHAR(20)                 NOT NULL                           COMMENT '상태',
    message               VARCHAR(255)                NOT NULL                           COMMENT '메시지',
    create_at             TIMESTAMP(6)                NOT NULL                           COMMENT '생성일자'
) COMMENT '사용자 PUSH 설정';

CREATE TABLE web_sys (
    code        CHAR(4)      NOT NULL PRIMARY KEY COMMENT '시스템 코드',
    name        VARCHAR(100) NOT NULL             COMMENT '이름',
    description TEXT                              COMMENT '시스템 설명',
    permission  varchar(10)  NOT NULL             COMMENT '접근 권한'
) COMMENT '시스템 정보';

CREATE TABLE system_message (
    id          INT            PRIMARY KEY           AUTO_INCREMENT,
    web_sys_pk  CHAR(4)        NOT NULL              COMMENT '시스템 코드',
    subject     VARCHAR(255)   NOT NULL              COMMENT '제목',
    content     TEXT                                 COMMENT '내용',
    create_at   TIMESTAMP(6)   NOT NULL              COMMENT '생성일',
    update_at   TIMESTAMP(6)   NOT NULL              COMMENT '수정일',
    is_use      TINYINT(1)     NOT NULL DEFAULT 1    COMMENT '사용여부',
    extra1      TEXT                                 COMMENT '추가1',
    extra2      TEXT                                 COMMENT '추가2',
    extra3      TEXT                                 COMMENT '추가3',
    extra4      TEXT                                 COMMENT '추가4',
    extra5      TEXT                                 COMMENT '추가5'
) COMMENT '시스템 메시지';

CREATE TABLE smtp_push_history_count (
    member_pk              INT      NOT NULL,
    member_config_smtp_pk  INT      NOT NULL,
    count                  INT      NOT NULL        DEFAULT      0
) COMMENT 'smtp_push_history 카운트';

ALTER TABLE smtp_push_history_count ADD PRIMARY KEY (member_pk, member_config_smtp_pk);

ALTER TABLE system_message ADD FOREIGN KEY (web_sys_pk) REFERENCES web_sys(code);

ALTER TABLE smtp_push_history ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE smtp_push_history ADD FOREIGN KEY (member_config_smtp_pk) REFERENCES member_config_smtp(id);

ALTER TABLE member_config_smtp ADD FOREIGN KEY (member_pk) REFERENCES member(id);

ALTER TABLE point_history ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE point_history ADD FOREIGN KEY (point_code_pk) REFERENCES point_code(id);
ALTER TABLE point_history ADD FOREIGN KEY (table_code_pk) REFERENCES table_code(id);

ALTER TABLE share_link ADD FOREIGN KEY (member_pk) REFERENCES member(id);

ALTER TABLE board_history ADD FOREIGN KEY (board_pk) REFERENCES board(id);
ALTER TABLE board_history ADD FOREIGN KEY (change_code_pk) REFERENCES change_code(id);

ALTER TABLE board_comment ADD FOREIGN KEY (board_pk) REFERENCES board(id);
ALTER TABLE board_comment ADD FOREIGN KEY (user_id) REFERENCES member(user_id);
ALTER TABLE board_comment ADD FOREIGN KEY (parent_pk) REFERENCES board_comment(id);

ALTER TABLE board ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE board ADD FOREIGN KEY (category_pk) REFERENCES category(id);

ALTER TABLE category ADD FOREIGN KEY (parent_pk) REFERENCES category(id);

ALTER TABLE file ADD UNIQUE (file_name, file_path);
ALTER TABLE file ADD FOREIGN KEY (table_code_pk) REFERENCES table_code(id);

ALTER TABLE attendance ADD CHECK ( days >= 1 );
ALTER TABLE attendance ADD FOREIGN KEY (member_pk) REFERENCES member(id);

ALTER TABLE log_history ADD FOREIGN KEY (member_pk) REFERENCES member(id);

ALTER TABLE login_history ADD FOREIGN KEY (member_pk) REFERENCES member(id);

ALTER TABLE otp ADD FOREIGN KEY (member_pk) REFERENCES member(id);
ALTER TABLE role ADD PRIMARY KEY (role, member_pk);

CREATE TRIGGER smtp_push_history_insert
    AFTER INSERT ON smtp_push_history
    FOR EACH ROW
BEGIN
    INSERT INTO smtp_push_history_count
    (member_pk, member_config_smtp_pk, count)
    VALUES (new.member_pk, new.member_config_smtp_pk, 1)
        ON DUPLICATE KEY
            UPDATE count = count + 1;
END ;

CREATE TRIGGER smtp_push_history_delete
    AFTER DELETE ON smtp_push_history
    FOR EACH ROW
BEGIN
    UPDATE smtp_push_history_count
       SET count = count - 1
     WHERE member_config_smtp_pk = old.member_pk
       AND member_pk = old.member_config_smtp_pk;
END ;


INSERT INTO web_sys
       (code, name, description, permission)
VALUES ('001', 'default', '기본값', 'ADMIN')
     , ('002', 'auth', '2차 인증 변경알림', 'ADMIN')
     , ('003', 'confirmLogin', '로그인 위치 확인', 'ADMIN');

INSERT INTO system_message
       (id, web_sys_pk, subject, content, create_at, update_at, is_use)
VALUES (1, '001', '시스템 메시지', '시스템 메시지입니다.', current_timestamp, current_timestamp, 1)
     , (2, '002','2차 인증 비활성화', '%s님의 2차 인증 설정이 변경되었습니다.', now(), now(), 1)
     , (3, '002','2차 인증 활성화', '%s님의 2차 인증 설정이 변경되었습니다.', now(), now(), 1)
     , (4, '003','새로운 장소에서 로그인이 발생했습니다.', ' ip : %s </br> device : %s </br> location : %s </br> 에서 로그인이 발생했습니다.', now(), now(), 1);


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
(id, table_name, is_use)
VALUES (1, 'member'  , 1)
     , (2, 'board' , 1)
     , (3, 'board_comment', 1)
     , (4, 'attendance', 1);

INSERT INTO category
(id, name, parent_pk, is_use)
VALUES (1, 'notice'  , NULL, 1)
     , (2, 'free'    , NULL, 1)
     , (3, 'qna'     , NULL, 1)
     , (4, 'alttuel' , NULL, 1)
     , (5, 'album'   , NULL, 1);

