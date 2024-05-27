CREATE TABLE users (
	id	        BIGINT	      NOT NULL PRIMARY KEY  AUTO_INCREMENT     COMMENT 'PK'          ,
	user_id	    VARCHAR(50)	  NOT NULL UNIQUE     	                   COMMENT '계정 아이디',
	pwd	        VARCHAR(255)  NOT NULL UNIQUE    	                   COMMENT '패스워드',
    name	    VARCHAR(100)  NOT NULL          	                   COMMENT '이름',
	email	    VARCHAR(255)  NOT NULL UNIQUE    	                   COMMENT '이메일',
    phone  	    VARCHAR(20)	  NOT NULL UNIQUE    	                   COMMENT '핸드폰 번호',
    point       BIGINT                 DEFAULT      0                  COMMENT '포인트',
	create_at	DATETIME	  NOT NULL                                 COMMENT '생성일자',
	update_at	DATETIME          NULL                                 COMMENT '정보 수정 일자',
	is_use	    TINYINT	      NOT NULL DEFAULT      1	               COMMENT '계정 사용여부 0:사용안함, 1:사용',
	s_auth      TINYINT       NOT NULL DEFAULT      0                  COMMENT '2차 인증 사용어부 0:사용안함, 1:사용',
    s_auth_type VARCHAR(10)   NOT NULL DEFAULT      'NONE'             COMMENT '2차 인증 타입',
	INDEX       users_user_id_idx  (user_id),
    INDEX       users_is_use_idx   (is_use)
) COMMENT '사용자 정보';

CREATE TABLE role (
	role        VARCHAR(20)	  NOT NULL                                 COMMENT '권한 정보',
	user_pk     BIGINT	      NOT NULL                                 COMMENT '사용자 PK',
    PRIMARY KEY (role, user_pk)
) COMMENT '권한 정보';

CREATE TABLE otp (
    id           BIGINT          PRIMARY KEY   AUTO_INCREMENT       COMMENT 'PK',
    user_pk      BIGINT          NOT NULL                           COMMENT '사용자 PK',
    hash         VARCHAR(255)    NOT NULL                           COMMENT 'OTP 코드',
    create_at    DATETIME        NOT NULL                           COMMENT '생성일자',
    is_use       TINYINT(1)      NOT NULL      DEFAULT 1            COMMENT '사용여부 0:사용안함, 1:사용',
    FOREIGN KEY  (user_pk)       REFERENCES    users(id),
    INDEX        user_pk_idx     (user_pk),
    INDEX        otp_is_use_idx      (is_use)
) COMMENT 'OTP 정보';

CREATE TABLE login_history (
	id           BIGINT	        NOT NULL    PRIMARY KEY AUTO_INCREMENT       COMMENT 'PK',
	user_pk	     BIGINT	        NOT NULL                                     COMMENT '사용자 PK',
	ip    	     VARCHAR(255)	NOT NULL	                                 COMMENT '접속 IP주소',
	location	 VARCHAR(255)	NOT NULL	                                 COMMENT '접속장소',
	device	     VARCHAR(255)	NOT NULL	                                 COMMENT '단말기정보',
	create_at	 datetime	    NOT NULL                                     COMMENT '생성일자',
    FOREIGN KEY  (user_pk)      REFERENCES  users(id),
    INDEX        login_history_user_pk_idx    (user_pk),
    INDEX        login_history_create_at_idx  (create_at),
    INDEX        login_history_ip_idx         (ip),
    INDEX        login_history_location_idx   (location),
    INDEX        login_history_device_idx     (device)
) COMMENT '로그인 이력';

CREATE TABLE log_history (
     id             BIGINT        AUTO_INCREMENT  PRIMARY KEY,
     user_pk        BIGINT        NOT NULL,
     method         VARCHAR(10)   NOT NULL,
     path           VARCHAR(255)  NOT NULL,
     query          VARCHAR(500)  NOT NULL,
     body           TEXT,
     uri            VARCHAR(255)  NOT NULL,
     headers        TEXT          NOT NULL,
     session        VARCHAR(500)  NOT NULL,
     local_address  VARCHAR(255)  NOT NULL,
     remote_address VARCHAR(255)  NOT NULL,
     create_at      TIMESTAMP     NOT NULL,
     FOREIGN KEY    (user_pk)     REFERENCES users (id),
     INDEX          log_history_idx_user_pk                   (user_pk),
     INDEX          log_history_idx_method                    (method),
     INDEX          log_history_idx_path                      (path),
     INDEX          log_history_idx_query                     (query),
     INDEX          log_history_idx_uri                       (uri),
     INDEX          log_history_idx_create_at                 (create_at),
     INDEX          log_history_idx_remote_address            (remote_address),
     INDEX          log_history_idx_local_address             (local_address),
     INDEX          log_history_idx_session                   (session)
) COMMENT 'api 호출 로그 테이블';

CREATE TABLE attendance (
    user_pk BIGINT NOT NULL PRIMARY KEY,
    lastDate DATE NOT NULL,
    days INT NOT NULL DEFAULT 1,
    is_use TINYINT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_pk) REFERENCES users(id),
    INDEX attendance_idx_lastDate (lastDate),
    CHECK ( days >= 1 )
) COMMENT '출석 정보';

CREATE TABLE table_code (
    id           BIGINT          PRIMARY KEY  AUTO_INCREMENT    COMMENT 'PK',
    table_name   VARCHAR(255)    NOT NULL                       COMMENT '테이블 이름',
    is_use       TINYINT(1)      NOT NULL     DEFAULT 1         COMMENT '사용여부 0:사용안함, 1:사용',
    INDEX        table_code_table_name_idx  (table_name),
    INDEX        table_code_is_use_idx      (is_use)
) COMMENT '테이블 코드';

CREATE TABLE file (
    id            BIGINT          PRIMARY KEY            AUTO_INCREMENT                                  COMMENT 'PK',
    table_code_pk BIGINT          NOT NULL                                                               COMMENT '테이블 코드 PK',
    table_ref_pk  BIGINT          NOT NULL                                                               COMMENT '참고 테이블 Pk',
    org_file_name VARCHAR(255)    NOT NULL                                                               COMMENT '원본 파일 이름',
    file_name     VARCHAR(255)    NOT NULL                                                               COMMENT '변경 파일 이름',
    file_path     VARCHAR(255)    NOT NULL                                                               COMMENT '하위 경로',
    create_at     DATETIME        NOT NULL                                                               COMMENT '생성일자',
    is_use        TINYINT(1)      NOT NULL               DEFAULT                     1                   COMMENT '사영 여부 0:사용안함, 1:사용',
    FOREIGN KEY   (table_code_pk) REFERENCES             table_code(id),
          INDEX           file_file_name_idx          (file_name)                 ,
          INDEX           file_org_and_file_name_idx  (file_name, org_file_name)  ,
          INDEX           file_org_file_name_idx      (org_file_name)             ,
                  INDEX           file_create_at_idx          (create_at),
                  INDEX           file_table_code_idx         (table_code_pk),
                  INDEX           file_table_ref_pk_idx       (table_ref_pk)
) COMMENT '파일 테이블';

CREATE TABLE category (
    id             BIGINT          PRIMARY KEY    AUTO_INCREMENT           COMMENT 'PK',
    name           VARCHAR(255)    NOT NULL                                COMMENT '카테고리 이름',
    parent_pk      BIGINT                                                  COMMENT '카테고리 PK',
    is_use         TINYINT(1)      NOT NULL       DEFAULT               1  COMMENT '사용여부 0:사용안함, 1:사용',
    FOREIGN KEY    (parent_pk)     REFERENCES     category(id),
    INDEX          category_name_idx        (name),
    INDEX          category_parent_pk_idx   (parent_pk),
    INDEX          category_is_use_idx      (is_use)
) COMMENT '카테고리';

CREATE TABLE change_code(
    id           BIGINT           PRIMARY KEY    AUTO_INCREMENT  COMMENT 'PK',
    change_name  VARCHAR(255)     NOT NULL                       COMMENT '변경 코드 이름',
    INDEX        change_code_change_name_idx  (change_name)
) COMMENT '변경 코드';

CREATE TABLE board (
     id           BIGINT          PRIMARY KEY             AUTO_INCREMENT                           COMMENT 'PK',
     category_pk  BIGINT          NOT NULL                                                         COMMENT '카테고리 PK',
     title        VARCHAR(255)    NOT NULL                                                         COMMENT '제목',
     content      TEXT            NOT NULL                                                         COMMENT '본문',
     rate         BIGINT          NOT NULL                DEFAULT             0                    COMMENT '좋아요',
     view_count   BIGINT          NOT NULL                DEFAULT             0                    COMMENT '조회수',
     create_at    DATETIME        NOT NULL                                                         COMMENT '생성일자',
     user_pk      BIGINT(255)    NOT NULL                                                         COMMENT '유저 아이디',
     isAdsense    TINYINT(1)      NOT NULL                DEFAULT             0                    COMMENT '광고 여부 0:안함, 1:광고',
     is_use       TINYINT(1)      NOT NULL                DEFAULT             1                    COMMENT '사용 여부 0:사용안함, 1:사용',
     FOREIGN KEY  (user_pk)       REFERENCES              users(id),
     FOREIGN KEY  (category_pk)   REFERENCES              category(id),
          INDEX           board_title_idx               (title)             ,
          INDEX           board_content_idx             (content)           ,
          INDEX           board_title_and_content_idx   (title, content)    ,
                  INDEX           board_is_use_idx              (is_use),
                  INDEX           board_create_at_idx           (create_at)
) COMMENT '게시글';

CREATE TABLE board_comment (
    id             BIGINT          PRIMARY KEY    AUTO_INCREMENT                                      COMMENT 'PK',
    board_pk       BIGINT          NOT NULL                                                           COMMENT '게시글 PK',
    content        TEXT            NOT NULL                                                           COMMENT '댓글 내용',
    create_at      DATETIME        NOT NULL                                                           COMMENT '생성일자',
    user_id        VARCHAR(255)    NOT NULL                                                           COMMENT '유저 아이디',
    parent_pk      BIGINT                                                                             COMMENT '댓글 PK',
    is_use         TINYINT(1)      NOT NULL       DEFAULT          1                                  COMMENT '사용 여부 0:사용안함, 1:사용',
    FOREIGN KEY                    (board_pk)     REFERENCES       board(id),
    FOREIGN KEY                    (user_id)      REFERENCES       users(user_id),
    FOREIGN KEY                    (parent_pk)    REFERENCES       board_comment(id),
    INDEX          board_comment_create_at_idx   (create_at),
    INDEX          board_comment_is_use_idx      (is_use),
    INDEX          board_comment_parent_pk_idx   (parent_pk),
           INDEX           board_comment_content_idx    (content)        
) COMMENT '게시글 댓글';

CREATE TABLE share_link (
    id             BIGINT          PRIMARY KEY    AUTO_INCREMENT                        COMMENT 'PK',
    org_link       VARCHAR(255)    NOT NULL                                             COMMENT '원본 링크',
    share_link     VARCHAR(255)    NOT NULL                                             COMMENT '공유 링크',
    create_at      DATETIME        NOT NULL                                             COMMENT '생성 일자',
    is_use         TINYINT(1)      NOT NULL       DEFAULT            1                  COMMENT '사용 여부 0:사용안함, 1:사용',
    user_pk        BIGINT          NOT NULL                                             COMMENT '유저 PK',
    FOREIGN KEY    (user_pk)       REFERENCES     users(id),
    INDEX          share_link_org_link_idx    (org_link),
    INDEX          share_link_create_at_idx   (create_at),
    INDEX          share_link_is_use_idx      (is_use)
) COMMENT '링크 공유';

CREATE TABLE point_code (
    id             BIGINT          PRIMARY KEY    AUTO_INCREMENT        COMMENT 'PK',
    name           VARCHAR(255)    NOT NULL                             COMMENT '포인트 적립 이름',
    point          BIGINT          NOT NULL                             COMMENT '포인트 값',
    is_use         TINYINT(1)      NOT NULL       DEFAULT 1             COMMENT '사용여부 0:사용안함, 1:사용',
    INDEX          point_code_name_idx        (name),
    INDEX          point_code_is_use_idx      (is_use)
) COMMENT '포인트 코드';

CREATE TABLE point_history (
    id             BIGINT          PRIMARY KEY    AUTO_INCREMENT                              COMMENT 'PK',
    table_name     VARCHAR(255)    NOT NULL                                                   COMMENT '테이블 이름',
    table_pk       BIGINT          NOT NULL                                                   COMMENT '참조된 테이블 PK',
    user_pk        BIGINT          NOT NULL                                                   COMMENT '유저 PK',
    point_code_pk  BIGINT          NOT NULL                                                   COMMENT '포인트 코드 PK',
    create_at      DATETIME        NOT NULL                                                   COMMENT '생성일자',
    FOREIGN KEY    (user_pk)       REFERENCES     users(id),
    FOREIGN KEY    (point_code_pk) REFERENCES     point_code(id),
    INDEX          point_history_create_at_idx   (create_at)
) COMMENT '포인트 이력';


CREATE TABLE board_history (
    id              BIGINT            PRIMARY KEY         AUTO_INCREMENT                           COMMENT 'PK',
    board_pk        BIGINT            NOT NULL                                                     COMMENT '게시글 PK',
    title           VARCHAR(255)      NOT NULL                                                     COMMENT '제목',
    content         TEXT              NOT NULL                                                     COMMENT '본문',
    change_code_pk  BIGINT            NOT NULL                                                     COMMENT '변경코드 PK',
    create_at       DATETIME          NOT NULL                                                     COMMENT '생성일자',
    FOREIGN KEY     (board_pk)        REFERENCES          board(id),
    FOREIGN KEY     (change_code_pk)  REFERENCES          change_code(id),
    INDEX           board_history_create_at_idx     (create_at DESC),
    INDEX           board_history_change_code_idx   (change_code_pk)
) COMMENT '게시글 변경 이력';


CREATE TABLE email_verify (
    id              BIGINT            PRIMARY KEY         AUTO_INCREMENT                           COMMENT 'PK',
    email           VARCHAR(255)      NOT NULL                                                     COMMENT '이메일',
    code            VARCHAR(255)      NOT NULL                                                     COMMENT '인증 코드',
    create_at       DATETIME          NOT NULL                                                     COMMENT '생성일자',
    expire_at       DATETIME          NOT NULL                                                     COMMENT '만료일자',
    is_use          TINYINT(1)        NOT NULL            DEFAULT               1                  COMMENT '사용 여부 0:사용안함, 1:사용',
    INDEX           email_verify_email_idx         (email),
    INDEX           email_verify_code_idx          (code),
    INDEX           email_verify_create_at_idx     (create_at),
    INDEX           email_verify_expire_at_idx     (expire_at),
    INDEX           email_verify_is_use_idx        (is_use)
) COMMENT '이메일 인증';

CREATE TABLE user_config_smtp (
    id             BIGINT        AUTO_INCREMENT    PRIMARY KEY ,
    user_pk        BIGINT        NOT NULL,
    host           VARCHAR(255)  NOT NULL                         COMMENT  'SMTP 서버 주소',
    port           CHAR(6)       NOT NULL                         COMMENT  'SMTP 포트',
    username       VARCHAR(255)  NOT NULL                         COMMENT  'SMTP 사용자 아이디',
    password       VARCHAR(255)  NOT NULL                         COMMENT  'SMTP 사용자 비밀번호',
    from_email     VARCHAR(255)  NOT NULL                         COMMENT  'SMTP 발신자 주소',
    from_name      VARCHAR(255)  NOT NULL                         COMMENT  'SMTP 발신자 이름',
    use_ssl        TINYINT(1)    NOT NULL                         COMMENT  'SMTP SSL 사용 여부',
    is_use         TINYINT(1)    NOT NULL DEFAULT  1              COMMENT  '사용 여부 0:사용안함, 1:사용',
    is_default     TINYINT(1)    NOT NULL DEFAULT  0              COMMENT  '기본 설정 여부 0:기본설정아님, 1:기본설정',
    FOREIGN KEY    (user_pk)     REFERENCES        users (id),
    INDEX          user_config_smtpidx_user_pk   (user_pk)
) COMMENT '사용자 SMTP 설정';

CREATE TABLE smtp_push_history (
    id                  BIGINT                  AUTO_INCREMENT PRIMARY KEY,
    user_pk             BIGINT                  NOT NULL                           COMMENT '사용자 PK',
    user_config_smtp_pk BIGINT                  NOT NULL                           COMMENT '사용자 SMTP 설정 PK',
    subject             VARCHAR(255)            NOT NULL                           COMMENT '제목',
    content             TEXT                    NOT NULL                           COMMENT '내용',
    status              VARCHAR(20)             NOT NULL                           COMMENT '상태',
    message             VARCHAR(255)            NOT NULL                           COMMENT '메시지',
    create_at           TIMESTAMP               NOT NULL                           COMMENT '생성일자',
    FOREIGN KEY         (user_pk)               REFERENCES users (id),
    FOREIGN KEY         (user_config_smtp_pk)   REFERENCES user_config_smtp (id),
    INDEX               smtp_push_history_idx_user_pk             (user_pk),
    INDEX               smtp_push_history_idx_user_config_smtp_pk (user_config_smtp_pk),
    INDEX               smtp_push_history_idx_create_at           (create_at)
) COMMENT '사용자 PUSH 설정';

CREATE TABLE web_sys (
    code        CHAR(4)      NOT NULL PRIMARY KEY COMMENT '시스템 코드',
    name        VARCHAR(100) NOT NULL             COMMENT '이름',
    description TEXT                              COMMENT '시스템 설명',
    permission  varchar(10)  NOT NULL              COMMENT '접근 권한',
    INDEX web_sys_idx_web_sys_access_permission (permission),
    INDEX web_sys_idx_web_sys_name              (name),
    INDEX web_sys_idx_web_sys_code              (code)
) COMMENT '시스템 정보';

CREATE TABLE system_message (
    id          INT          PRIMARY KEY           AUTO_INCREMENT,
    web_sys_pk  CHAR(4)      NOT NULL              COMMENT '시스템 코드',
    subject     VARCHAR(255) NOT NULL              COMMENT '제목',
    content     TEXT                               COMMENT '내용',
    create_at   TIMESTAMP    NOT NULL              COMMENT '생성일',
    update_at   TIMESTAMP    NOT NULL              COMMENT '수정일',
    is_use      TINYINT(1)   NOT NULL DEFAULT 1    COMMENT '사용여부',
    extra1      TEXT                               COMMENT '추가1',
    extra2      TEXT                               COMMENT '추가2',
    extra3      TEXT                               COMMENT '추가3',
    extra4      TEXT                               COMMENT '추가4',
    extra5      TEXT                               COMMENT '추가5',
    FOREIGN KEY (web_sys_pk)   REFERENCES web_sys(code),
    INDEX       system_message_web_sys_pk_idx (web_sys_pk),
    INDEX       system_message_is_use_idx     (is_use),
    INDEX       system_message_create_at_idx  (create_at),
    INDEX       system_message_update_at_idx  (update_at),
    INDEX       system_message_id_idx         (id),
    INDEX       system_message_subject_idx    (subject)
) COMMENT '시스템 메시지';


CREATE TABLE smtp_push_history_count (
    user_pk              INT NOT NULL,
    user_config_smtp_pk  INT NOT NULL,
    count                INT NOT NULL DEFAULT 0,
    PRIMARY KEY          (user_pk, user_config_smtp_pk)
) COMMENT 'smtp_push_history 카운트';

