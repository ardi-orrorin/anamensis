INSERT INTO web_sys
       (code, name, description, permission)
VALUES ('001', 'default', '기본값', 'ADMIN');

INSERT INTO system_message
       (web_sys_pk, subject, content, create_at, update_at)
VALUES ('001', '시스템 메시지', '시스템 메시지입니다.', current_timestamp, current_timestamp);


INSERT INTO point_code
       (name, point)
VALUES ('attend-1', 10)
     , ('attend-2', 15)
     , ('attend-3', 15)
     , ('attend-4', 30)
     , ('attend-5', 30)
     , ('attend-6', 50)
     , ('attend-7', 50)
     , ('attend-8', 50)
     , ('attend-9', 50)
     , ('attend-10', 100)
     , ('board', 15)
     , ('board_comment', 5);


INSERT INTO table_code
         (id, table_name, is_use)
VALUES (1, 'member'  , 1)
     ,  (2, 'board' , 1)
     ,  (3, 'board_comment', 1)
     ,  (4, 'attendance', 1);


INSERT INTO category
       (id, name, parent_pk, is_use)
VALUES (1, 'notice'  , NULL, 1)
     , (2, 'free'    , NULL, 1)
     , (3, 'qna'     , NULL, 1)
     , (4, 'alttuel' , NULL, 1);


