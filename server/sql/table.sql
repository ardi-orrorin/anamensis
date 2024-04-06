DROP TABLE anamensis.login_history;
DROP TABLE anamensis.role;
DROP TABLE anamensis.user;
DROP TABLE anamensis.board;
DROP TABLE anamensis.table_code;
DROP TABLE anamensis.file;
DROP TABLE anamensis.board_history;
DROP TABLE anamensis.change_code;
DROP TABLE anamensis.board_comment;
DROP TABLE anamensis.share_link;
DROP TABLE anamensis.point_code;
DROP TABLE anamensis.point_history;
DROP TABLE anamensis.category;
DROP TABLE anamensis.email_verify;
DROP TABLE anamensis.otp;


CREATE TABLE anamensis.user (
	id	        BIGINT	      NOT NULL PRIMARY KEY  AUTO_INCREMENT     COMMENT 'PK'          ,
	user_id	    VARCHAR(50)	  NOT NULL UNIQUE     	                   COMMENT '계정 아이디',
	pwd	        VARCHAR(255)  NOT NULL UNIQUE    	                   COMMENT '패스워드',
    name	    VARCHAR(100)  NOT NULL UNIQUE    	                   COMMENT '이름',
	email	    VARCHAR(255)  NOT NULL UNIQUE    	                   COMMENT '이메일',
    phone  	    VARCHAR(20)	  NOT NULL UNIQUE    	                   COMMENT '핸드폰 번호',
    point       BIGINT                 DEFAULT      0                  COMMENT '포인트',
	create_at	DATETIME	  NOT NULL                                 COMMENT '생성일자',
	update_at	DATETIME          NULL                                 COMMENT '정보 수정 일자',
	is_use	    TINYINT	      NOT NULL DEFAULT      1	               COMMENT '계정 사용여부 0:사용안함, 1:사용',
	INDEX       user_id_idx  (user_id),
    INDEX       is_use_idx   (is_use)
) COMMENT '사용자 정보';

CREATE TABLE anamensis.role (
# 	id	        BIGINT	      NOT NULL PRIMARY KEY 	AUTO_INCREMENT     COMMENT 'PK' ,
	role        VARCHAR(20)	  NOT NULL                                 COMMENT '권한 정보',
	user_pk     BIGINT	      NOT NULL                                 COMMENT '사용자 PK',
    PRIMARY KEY (role, user_pk)
) COMMENT '권한 정보';

CREATE TABLE anamensis.otp (
    id           BIGINT          PRIMARY KEY   AUTO_INCREMENT       COMMENT 'PK',
    user_pk      BIGINT          NOT NULL                           COMMENT '사용자 PK',
    hash         VARCHAR(255)    NOT NULL                           COMMENT 'OTP 코드',
    create_at    DATETIME        NOT NULL                           COMMENT '생성일자',
    is_use       TINYINT(1)      NOT NULL      DEFAULT 1            COMMENT '사용여부 0:사용안함, 1:사용',
    FOREIGN KEY  (user_pk)       REFERENCES    anamensis.user(id),
    INDEX        user_pk_idx     (user_pk),
    INDEX        is_use_idx      (is_use)
) COMMENT 'OTP 정보';

CREATE TABLE anamensis.login_history (
	id           BIGINT	        NOT NULL    PRIMARY KEY AUTO_INCREMENT       COMMENT 'PK',
	user_pk	     BIGINT	        NOT NULL                                     COMMENT '사용자 PK',
	ip    	     VARCHAR(255)	NOT NULL	                                 COMMENT '접속 IP주소',
	location	 VARCHAR(255)	NOT NULL	                                 COMMENT '접속장소',
	device	     VARCHAR(255)	NOT NULL	                                 COMMENT '단말기정보',
	create_at	 datetime	    NOT NULL                                     COMMENT '생성일자',
    FOREIGN KEY  (user_pk)      REFERENCES  anamensis.user(id),
    INDEX        user_pk_idx    (user_pk),
    INDEX        create_at_idx  (create_at),
    INDEX        ip_idx         (ip),
    INDEX        location_idx   (location),
    INDEX        device_idx     (device)
) COMMENT '로그인 이력';

CREATE TABLE anamensis.table_code (
    id           BIGINT          PRIMARY KEY  AUTO_INCREMENT    COMMENT 'PK',
    table_name   VARCHAR(255)    NOT NULL                       COMMENT '테이블 이름',
    is_use       TINYINT(1)      NOT NULL     DEFAULT 1         COMMENT '사용여부 0:사용안함, 1:사용',
    INDEX        table_name_idx  (table_name),
    INDEX        is_use_idx      (is_use)
) COMMENT '테이블 코드';

CREATE TABLE anamensis.file (
    id            BIGINT          PRIMARY KEY            AUTO_INCREMENT                                  COMMENT 'PK',
    table_code_pk INT             NOT NULL                                                               COMMENT '테이블 코드 PK',
    table_ref_pk  BIGINT          NOT NULL                                                               COMMENT '참고 테이블 Pk',
    org_file_name VARCHAR(255)    NOT NULL                                                               COMMENT '원본 파일 이름',
    file_name     VARCHAR(255)    NOT NULL                                                               COMMENT '변경 파일 이름',
    file_path     VARCHAR(255)    NOT NULL                                                               COMMENT '하위 경로',
    create_at     DATETIME        NOT NULL                                                               COMMENT '생성일자',
    is_use        TINYINT(1)      NOT NULL               DEFAULT                     1                   COMMENT '사영 여부 0:사용안함, 1:사용',
    FOREIGN KEY   (table_code_pk) REFERENCES             anamensis.table_code(id),
    FULLTEXT      INDEX           file_name_idx          (file_name)                 WITH PARSER ngram,
    FULLTEXT      INDEX           org_file_name_idx      (org_file_name)             WITH PARSER ngram,
    FULLTEXT      INDEX           org_and_file_name_idx  (file_name, org_file_name)  WITH PARSER ngram,
                  INDEX           create_at_idx          (create_at),
                  INDEX           table_code_idx         (table_code_pk),
                  INDEX           table_ref_pk_idx       (table_ref_pk)
) COMMENT '파일 테이블';

CREATE TABLE anamensis.category (
    id             BIGINT          PRIMARY KEY    AUTO_INCREMENT           COMMENT 'PK',
    name           VARCHAR(255)    NOT NULL                                COMMENT '카테고리 이름',
    parent_pk      BIGINT                                                  COMMENT '카테고리 PK',
    is_use         TINYINT(1)      NOT NULL       DEFAULT               1  COMMENT '사용여부 0:사용안함, 1:사용',
    FOREIGN KEY    (parent_pk)     REFERENCES     anamensis.category(id),
    INDEX          name_idx        (name),
    INDEX          parent_pk_idx   (parent_pk),
    INDEX          is_use_idx      (is_use)
) COMMENT '카테고리';

CREATE TABLE anamensis.change_code(
    id           BIGINT           PRIMARY KEY    AUTO_INCREMENT  COMMENT 'PK',
    change_name  VARCHAR(255)     NOT NULL                       COMMENT '변경 코드 이름',
    INDEX        change_name_idx  (change_name)
) COMMENT '변경 코드';

CREATE TABLE anamensis.board (
     id           BIGINT          PRIMARY KEY             AUTO_INCREMENT                           COMMENT 'PK',
     category_pk  BIGINT          NOT NULL                                                         COMMENT '카테고리 PK',
     title        VARCHAR(255)    NOT NULL                                                         COMMENT '제목',
     content      TEXT            NOT NULL                                                         COMMENT '본문',
     rate         BIGINT          NOT NULL                DEFAULT             0                    COMMENT '좋아요',
     view_count   BIGINT          NOT NULL                DEFAULT             0                    COMMENT '조회수',
     create_at    DATETIME        NOT NULL                                                         COMMENT '생성일자',
     user_id      VARCHAR(255)    NOT NULL                                                         COMMENT '유저 아이디',
     isAdsense    TINYINT(1)      NOT NULL                DEFAULT             0                    COMMENT '광고 여부 0:안함, 1:광고',
     is_use       TINYINT(1)      NOT NULL                DEFAULT             1                    COMMENT '사용 여부 0:사용안함, 1:사용',
     FOREIGN KEY  (user_id)       REFERENCES              anamensis.user(user_id),
     FOREIGN KEY  (category_pk)   REFERENCES              anamensis.category(id),
     FULLTEXT     INDEX           title_idx               (title)             WITH PARSER ngram,
     FULLTEXT     INDEX           content_idx             (content)           WITH PARSER ngram,
     FULLTEXT     INDEX           title_and_content_idx   (title, content)    WITH PARSER ngram,
                  INDEX           is_use_idx              (is_use),
                  INDEX           create_at_idx           (create_at)
) COMMENT '게시글';

CREATE TABLE anamensis.board_comment (
    id             BIGINT          PRIMARY KEY    AUTO_INCREMENT                                      COMMENT 'PK',
    board_pk       BIGINT          NOT NULL                                                           COMMENT '게시글 PK',
    content        TEXT            NOT NULL                                                           COMMENT '댓글 내용',
    create_at      DATETIME        NOT NULL                                                           COMMENT '생성일자',
    user_id        VARCHAR(255)    NOT NULL                                                           COMMENT '유저 아이디',
    parent_pk      BIGINT                                                                             COMMENT '댓글 PK',
    is_use         TINYINT(1)      NOT NULL       DEFAULT          1                                  COMMENT '사용 여부 0:사용안함, 1:사용',
    FOREIGN KEY                    (board_pk)     REFERENCES       anamensis.board(id),
    FOREIGN KEY                    (user_id)      REFERENCES       anamensis.user(user_id),
    FOREIGN KEY                    (parent_pk)    REFERENCES       anamensis.board_comment(id),
    INDEX          create_at_idx   (create_at),
    INDEX          is_use_idx      (is_use),
    INDEX          parent_pk_idx   (parent_pk),
    FULLTEXT       INDEX           content_idx    (content)        WITH PARSER ngram
) COMMENT '게시글 댓글';

CREATE TABLE anamensis.share_link (
    id             BIGINT          PRIMARY KEY    AUTO_INCREMENT                        COMMENT 'PK',
    org_link       VARCHAR(255)    NOT NULL                                             COMMENT '원본 링크',
    share_link     VARCHAR(255)    NOT NULL                                             COMMENT '공유 링크',
    create_at      DATETIME        NOT NULL                                             COMMENT '생성 일자',
    is_use         TINYINT(1)      NOT NULL       DEFAULT            1                  COMMENT '사용 여부 0:사용안함, 1:사용',
    user_pk        BIGINT          NOT NULL                                             COMMENT '유저 PK',
    FOREIGN KEY    (user_pk)       REFERENCES     anamensis.user(id),
    INDEX          org_link_idx    (org_link),
    INDEX          create_at_idx   (create_at),
    INDEX          is_use_idx      (is_use)
) COMMENT '링크 공유';

CREATE TABLE anamensis.point_code (
    id             BIGINT          PRIMARY KEY    AUTO_INCREMENT    COMMENT 'PK',
    name           VARCHAR(255)    NOT NULL                         COMMENT '포인트 적립 이름',
    value          BIGINT          NOT NULL                         COMMENT '포인트 값',
    is_use         TINYINT(1)      NOT NULL       DEFAULT 1         COMMENT '사용여부 0:사용안함, 1:사용',
    INDEX          point_name_idx  (name),
    INDEX          is_use_idx      (is_use)
) COMMENT '포인트 코드';

CREATE TABLE anamensis.point_history (
    id             BIGINT          PRIMARY KEY    AUTO_INCREMENT                              COMMENT 'PK',
    table_name     VARCHAR(255)    NOT NULL                                                   COMMENT '테이블 이름',
    table_pk       BIGINT          NOT NULL                                                   COMMENT '참조된 테이블 PK',
    user_pk        BIGINT          NOT NULL                                                   COMMENT '유저 PK',
    point_code_pk  BIGINT          NOT NULL                                                   COMMENT '포인트 코드 PK',
    create_at      DATETIME        NOT NULL                                                   COMMENT '생성일자',
    FOREIGN KEY    (user_pk)       REFERENCES     anamensis.user(id),
#     FOREIGN KEY    (table_code_pk) REFERENCES     anamensis.table_code(id),
    FOREIGN KEY    (point_code_pk) REFERENCES     anamensis.point_code(id),
    INDEX          create_at_idx   (create_at)
) COMMENT '포인트 이력';


CREATE TABLE anamensis.board_history (
    id              BIGINT            PRIMARY KEY         AUTO_INCREMENT                           COMMENT 'PK',
    board_pk        BIGINT            NOT NULL                                                     COMMENT '게시글 PK',
    title           VARCHAR(255)      NOT NULL                                                     COMMENT '제목',
    content         TEXT              NOT NULL                                                     COMMENT '본문',
    change_code_pk  BIGINT            NOT NULL                                                     COMMENT '변경코드 PK',
    create_at       DATETIME          NOT NULL                                                     COMMENT '생성일자',
    FOREIGN KEY     (board_pk)        REFERENCES          anamensis.board(id),
    FOREIGN KEY     (change_code_pk)  REFERENCES          anamensis.change_code(id),
    INDEX           create_at_idx     (create_at DESC),
    INDEX           change_code_idx   (change_code_pk)
) COMMENT '게시글 변경 이력';


CREATE TABLE anamensis.email_verify (
    id              BIGINT            PRIMARY KEY         AUTO_INCREMENT                           COMMENT 'PK',
    email           VARCHAR(255)      NOT NULL                                                     COMMENT '이메일',
    code            VARCHAR(255)      NOT NULL                                                     COMMENT '인증 코드',
    create_at       DATETIME          NOT NULL                                                     COMMENT '생성일자',
    expire_at       DATETIME          NOT NULL                                                     COMMENT '만료일자',
    is_use          TINYINT(1)        NOT NULL            DEFAULT               1                  COMMENT '사용 여부 0:사용안함, 1:사용',
    INDEX           email_idx         (email),
    INDEX           code_idx          (code),
    INDEX           create_at_idx     (create_at),
    INDEX           expire_at_idx     (expire_at),
    INDEX           is_use_idx        (is_use)
) COMMENT '이메일 인증';


