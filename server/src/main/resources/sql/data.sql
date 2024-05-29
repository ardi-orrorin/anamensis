SET foreign_key_checks = 0;
DELETE from attendance;
DELETE from file;
DELETE from board_history;
DELETE from board_comment;
DELETE from board;
DELETE from point_history;
DELETE from change_code;
DELETE from email_verify;
DELETE from log_history;
DELETE from login_history;
DELETE from member_config_smtp;
DELETE from otp;
DELETE from share_link;
DELETE from smtp_push_history;
DELETE from smtp_push_history_count;
DELETE from system_message;
DELETE from web_sys;
DELETE from role;
DELETE from category;
DELETE from table_code;
DELETE from point_code;
DELETE from member;
SET foreign_key_checks = 1;

INSERT INTO member
(id, user_id, pwd, name
, email, phone, point
, create_at, update_at
, s_auth, s_auth_type)
VALUES (1, 'd-member-1', 'd-member-1', 'd-member-1'
       ,'d-member-1@gmail.com', '010-0000-0001', 0
       , current_timestamp, current_timestamp
       , FALSE, 'NONE')
     , (2, 'd-member-2', 'd-member-2', 'd-member-2'
       ,'d-member-2@gmail.com', '010-0000-0002', 0
       , current_timestamp, current_timestamp
       , FALSE, 'OTP')
     , (3, 'd-member-3', 'd-member-3', 'd-member-3'
       ,'d-member-3@gmail.com', '010-0000-0003', 0
       , current_timestamp, current_timestamp
       , FALSE, 'NONE')
     , (4, 'd-member-4', 'd-member-4', 'd-member-4'
       ,'d-member-4@gmail.com', '010-0000-0004', 0
       , current_timestamp, current_timestamp
       , FALSE, 'EMAIL')
     , (5, 'd-member-5', 'd-member-5', 'd-member-5'
       ,'d-member-5@gmail.com', '010-0000-0005', 0
       , current_timestamp, current_timestamp
       , FALSE, 'EMAIL');


INSERT INTO table_code
       (id, table_name, is_use)
VALUES (1, 'member', 1)
     , (2, 'board', 1)
     , (3, 'board_comment', 1);

INSERT INTO point_code
       (id, name, point)
VALUES (1, 'attend-1', 10)
     , (2, 'attend-2', 15)
     , (3, 'attend-3', 15)
     , (4, 'attend-4', 30)
     , (5, 'attend-5', 30)
     , (6, 'attend-6', 50)
     , (7, 'attend-7', 50)
     , (8, 'attend-8', 50)
     , (9, 'attend-9', 50)
     , (10, 'attend-10', 100);

INSERT INTO point_history
       (id, table_code_pk, table_ref_pk,
        member_pk, point_code_pk, create_at)
VALUES (1, 2, 1, 1, 1, current_timestamp)
     , (2, 2, 2, 1, 2, current_timestamp)
     , (3, 2, 3, 1, 3, current_timestamp)
     , (4, 3, 1, 2, 5, current_timestamp)
     , (5, 3, 2, 2, 3, current_timestamp)
     , (6, 3, 3, 3, 3, current_timestamp);

INSERT INTO email_verify
       (email, code, create_at, expire_at)
VALUES ('d-member-1@gmail.com', '123456', current_timestamp, current_timestamp + interval '5' MINUTE )
     , ('d-member-1@gmail.com', '011111', current_timestamp, current_timestamp + interval '5' MINUTE )
     , ('d-member-2@gmail.com', '003456', current_timestamp, current_timestamp + interval '5' MINUTE )
     , ('d-member-3@gmail.com', '000456', current_timestamp, current_timestamp + interval '5' MINUTE );


INSERT INTO category
       (id, name, parent_pk, is_use)
VALUES (1, 'category-1', NULL, 1)
     , (2, 'category-2', NULL, 1)
     , (3, 'category-3', NULL, 1)
     , (4, 'category-4', NULL, 1)
     , (5, 'category-5', 4, 1)
     , (6, 'category-6', 4, 0)
     , (7, 'category-7', 4, 1)
     , (8, 'category-8', 7, 1)
     , (9, 'category-9', 7, 0)
     , (10, 'category-10', 3, 1);

INSERT INTO board
       (id, category_pk, title, content, rate, view_count, create_at, member_pk, isAdsense, is_use)
VALUES (1, 1, '테스트 제목1', '{"content" : "테스트제목"}', 0, 0, current_timestamp, 1, FALSE, TRUE)
     , (2, 1, '테스트 제목2', '{"content" : "테스트제목"}', 0, 10, current_timestamp, 1, FALSE, TRUE)
     , (3, 1, '테스트 제목3', '{"content" : "테스트제목"}', 0, 0, current_timestamp, 1, FALSE, TRUE)
     , (4, 1, '테스트 제목4', '{"content" : "테스트제목"}', 0, 0, current_timestamp, 1, FALSE, TRUE)
     , (5, 1, '테스트 제목5', '{"content" : "테스트제목"}', 0, 0, current_timestamp, 2, FALSE, TRUE)
     , (6, 1, '테스트 제목6', '{"content" : "테스트제목"}', 0, 0, current_timestamp, 2, FALSE, TRUE)
     , (7, 1, '테스트 제목7', '{"content" : "테스트제목"}', 0, 0, current_timestamp, 2, FALSE, TRUE)
     , (8, 1, '테스트 제목8', '{"content" : "테스트제목"}', 0, 0, current_timestamp, 3, FALSE, TRUE)
     , (9, 1, '테스트 제목9', '{"content" : "테스트제목"}', 0, 0, current_timestamp, 3, FALSE, TRUE)
     , (10, 1, '테스트 제목10', '{"content" : "테스트제목"}', 0, 0, current_timestamp, 4, TRUE, TRUE);

INSERT INTO file
       (id, table_code_pk, table_ref_pk,
        org_file_name, file_name, file_path,
        create_at, is_use)
VALUES (1, 2, 1, 'default-orgFileName1.jpg', 'default-fileName1.jpg', '/default/2024/1', current_timestamp, TRUE)
     , (2, 2, 2, 'default-orgFileName2.jpg', 'default-fileName2.jpg', 'default/2024/2', current_timestamp, TRUE);

INSERT INTO member_config_smtp
            (id, member_pk, host,
             port, username, password,
             from_email, from_name, use_ssl,
             is_use, is_default)
VALUES (1, 1, 'smtp.gmail.com'
        , 587, 'username1', 'password1'
        ,'test1@gmail.com', 'test1', TRUE
        , TRUE, TRUE)
     , (2, 1, 'smtp.gmail.com'
       , 587, 'username2', 'password2'
       ,'test2@gmail.com', 'test2', TRUE
       , TRUE, FALSE);

INSERT INTO smtp_push_history
            (id, member_pk, member_config_smtp_pk,
             subject, content, status,
             message, create_at)
VALUES (1, 1, 1, '테스트 제목1', '테스트 내용1', 'SUCCESS', '메세지1', current_timestamp)
     , (2, 1, 1, '테스트 제목2', '테스트 내용2', 'SUCCESS', '메세지2', current_timestamp)
     , (3, 1, 1, '테스트 제목3', '테스트 내용3', 'SUCCESS', '메세지3', current_timestamp)
     , (4, 1, 1, '테스트 제목4', '테스트 내용4', 'SUCCESS', '메세지4', current_timestamp)
     , (5, 1, 1, '테스트 제목5', '테스트 내용5', 'SUCCESS', '메세지5', current_timestamp)
     , (6, 1, 1, '테스트 제목6', '테스트 내용6', 'SUCCESS', '메세지6', current_timestamp)
     , (7, 1, 1, '테스트 제목7', '테스트 내용7', 'SUCCESS', '메세지7', current_timestamp)
     , (8, 1, 1, '테스트 제목8', '테스트 내용8', 'SUCCESS', '메세지8', current_timestamp)
     , (9, 1, 1, '테스트 제목9', '테스트 내용9', 'SUCCESS', '메세지9', current_timestamp)
     , (10, 1, 1, '테스트 제목10', '테스트 내용10', 'SUCCESS', '메세지10', current_timestamp);

