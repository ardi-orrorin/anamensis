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
VALUES (1, 'd-member-1', '$2a$10$aV9tKjhmnZhE4gLdtHRw3O2Xa3VWZmOeOuDpbkETFYOl0wYK4haD.', 'd-member-1'
       ,'d-member-1@gmail.com', '010-0000-0001', 0
       , current_timestamp, current_timestamp
       , FALSE, 'NONE')
     , (2, 'd-member-2', '$2a$10$AlFLBI5bS6lRsPwOLBYdzuU.PHM5QKUlEOaCkbVoVpoEOMYJ6nXla', 'd-member-2'
       ,'d-member-2@gmail.com', '010-0000-0002', 0
       , current_timestamp, current_timestamp
       , FALSE, 'OTP')
     , (3, 'd-member-3', '$2a$10$uDN4NtcVrIq8vemDJ2J.Ye7SM2gIsxLdkojVoQkGvrm6SbDCPxnOe', 'd-member-3'
       ,'d-member-3@gmail.com', '010-0000-0003', 0
       , current_timestamp, current_timestamp
       , FALSE, 'NONE')
     , (4, 'd-member-4', '$2a$10$VTQ8OrIMPEI5LHou7VK61u3olxdMy0BfBZpLIFue5vOuH2q8AC8RO', 'd-member-4'
       ,'d-member-4@gmail.com', '010-0000-0004', 100
       , current_timestamp, current_timestamp
       , FALSE, 'EMAIL')
     , (5, 'd-member-5', '$2a$10$4GXgtmbOk7QYiR8iI1NO0e2XmWpz7dAaAZHfwygg2ZnqVaQZlLX56', 'd-member-5'
       ,'d-member-5@gmail.com', '010-0000-0005', 0
       , current_timestamp, current_timestamp
       , FALSE, 'EMAIL');

INSERT INTO role (role, member_pk)
VALUES ('ADMIN', 1)
     , ('USER', 1)
     , ('MASTER', 1)
     , ('USER', 2)
     , ('ADMIN', 2)
     , ('GUEST', 3);


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
       , TRUE, FALSE)
     , (3, 1, 'smtp.gmail.com'
       , 587, 'username3', 'password3'
       , 'username1@gmail.com', 'username1', TRUE
       , TRUE, FALSE)
     , (4, 2, 'smtp.gmail.com'
       , 587, 'username4', 'password4'
       , 'username2@gmail.com', 'username2', TRUE
       , TRUE, TRUE)
     , (5, 2, 'smtp.gmail.com'
       , 587, 'username5', 'password5'
       , 'username3@gmail.com', 'username3', TRUE
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
     , (10, 1, 1, '테스트 제목10', '테스트 내용10', 'FAIL', '메세지10', current_timestamp);

INSERT INTO web_sys
       (code, name, description, permission)
VALUES ('001', '테스트1', '설명1', 'ADMIN')
     , ('002', '테스트2', '설명2', 'USER')
     , ('003', '테스트3', '설명3', 'MASTER')
     , ('004', '테스트4', '설명4', 'ADMIN');

INSERT INTO system_message
       (id, web_sys_pk, subject,
        content, create_at, update_at,
        is_use, extra1, extra2,
        extra3, extra4, extra5)
VALUES (1, '001', '제목1'
       ,'내용1', current_timestamp, current_timestamp
       ,TRUE, 'extra1', 'extra2'
       ,'extra3', 'extra4', 'extra5')
     , (2, '001', '제목2'
       ,'내용1', current_timestamp, current_timestamp
       ,TRUE, 'extra1', 'extra2'
       ,'extra3', 'extra4', 'extra5')
     , (3, '001', '제목3'
       ,'내용1', current_timestamp, current_timestamp
       ,TRUE, 'extra1', 'extra2'
       ,'extra3', 'extra4', 'extra5')
     , (4, '002', '제목4'
       ,'내용1', current_timestamp, current_timestamp
       ,TRUE, 'extra1', 'extra2'
       ,'extra3', 'extra4', 'extra5');

INSERT INTO otp
       (id, member_pk, hash, create_at, is_use)
VALUES (1, 1, 'hash1', current_timestamp, FALSE)
     , (2, 1, 'hash2', current_timestamp, FALSE)
     , (3, 1, 'hash3', current_timestamp, TRUE)
     , (4, 2, 'hash4', current_timestamp, TRUE)
     , (5, 3, 'hash5', current_timestamp, TRUE);


INSERT INTO login_history
       (id, member_pk, ip, location, device, create_at)
VALUES (1, 1, '127.0.0.1', 'Asis/Seoul', 'PC', current_timestamp)
     , (2, 1, '127.0.0.1', 'Asis/Seoul', 'PC', current_timestamp)
     , (3, 1, '127.0.0.1', 'Asis/Seoul', 'PC', current_timestamp)
     , (4, 1, '127.0.0.1', 'Asis/Seoul', 'PC', current_timestamp)
     , (5, 2, '127.0.0.1', 'Asis/Seoul', 'PC', current_timestamp)
     , (6, 2, '127.0.0.1', 'Asis/Seoul', 'PC', current_timestamp)
     , (7, 2, '127.0.0.1', 'Asis/Seoul', 'PC', current_timestamp)
     , (8, 3, '127.0.0.1', 'Asis/Seoul', 'PC', current_timestamp)
     , (9, 3, '127.0.0.1', 'Asis/Seoul', 'PC', current_timestamp)
     , (10, 4, '127.0.0.1', 'Asis/Seoul', 'PC', current_timestamp)
     , (11, 5, '127.0.0.1', 'Asis/Seoul', 'PC', current_timestamp);

INSERT INTO log_history
       (id, member_pk, method,
        path, query, body,
        uri, headers, session,
        local_address, remote_address, create_at)
VALUES (1, 1, 'GET'
       ,'/api/v1/member/1', 'select=1', ''
       ,'http://localhost:8080/api/v1/member/1', 'header1', 'session1'
       ,'127.0.0.1', '127.0.0.1', current_timestamp)
     , (2, 1, 'POST'
       ,'/api/v1/member', '', '{"id" : 1}'
       ,'http://localhost:8080/api/v1/member/1', 'header1', 'session1'
       ,'127.0.0.1', '127.0.0.1', current_timestamp);