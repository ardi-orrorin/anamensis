DROP TABLE anamensis.login_history;
DROP TABLE anamensis.role;
DROP TABLE anamensis.user;


CREATE TABLE anamensis.user (
	`id`	    bigint	      NOT NULL PRIMARY KEY  AUTO_INCREMENT    COMMENT    'PK'          ,
	`user_id`	varchar(50)	  NOT NULL UNIQUE     	                  COMMENT    '계정 아이디',
	`pwd`	    varchar(255)  NOT NULL UNIQUE    	                  COMMENT    '패스워드',
    `name`	    varchar(100)  NOT NULL UNIQUE    	                  COMMENT    '이름',
	`email`	    varchar(255)  NOT NULL UNIQUE    	                  COMMENT    '이메일',
    `phone`  	varchar(20)	  NOT NULL UNIQUE    	                  COMMENT    '핸드폰 번호',
	`create_at`	datetime	  NOT NULL DEFAULT      CURRENT_TIMESTAMP COMMENT '생성일자',
	`update_at`	datetime          NULL ON UPDATE    CURRENT_TIMESTAMP COMMENT '정보 수정 일자',
	`is_use`	tinyInt	      NOT NULL DEFAULT      1	              COMMENT '계정 사용여부',
    PRIMARY KEY (`id`)
);

CREATE TABLE anamensis.role (
	`id`	    bigint	      NOT NULL PRIMARY KEY 	COMMENT 'PK' AUTO_INCREMENT,
	`role`   	varchar(20)	  NOT NULL              COMMENT '권한 정보',
	`user_pk`	bigint	      NOT NULL ,
    PRIMARY KEY (`id`)
);

CREATE TABLE anamensis.login_history (
	`id`	    bigint	        NOT NULL	COMMENT 'PK'        PRIMARY KEY AUTO_INCREMENT,
	`user_pk`	bigint	        NOT NULL,
	`ip`    	varchar(255)	NOT NULL	COMMENT '접속 IP주소',
	`location`	varchar(255)	NOT NULL	COMMENT '접속장소',
	`device`	varchar(255)	NOT NULL	COMMENT '단말기정보',
	`create_at`	datetime	    NOT NULL    COMMENT '생성일자'     DEFAULT current_timestamp,
    FOREIGN KEY (user_pk)       REFERENCES  anamensis.user(id)
);