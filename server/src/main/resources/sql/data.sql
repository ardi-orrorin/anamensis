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
