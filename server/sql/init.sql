INSERT INTO web_sys
       (code, name, description, permission)
VALUES ('001', 'default', '기본값', 'ADMIN');

INSERT INTO system_message
       (web_sys_pk, subject, content, create_at, update_at)
VALUES ('001', '시스템 메시지', '시스템 메시지입니다.', current_timestamp, current_timestamp);


INSERT INTO point_code
       (name, point)
VALUES ('attend-1', 10),
       ('attend-2', 15),
       ('attend-3', 15),
       ('attend-4', 30),
       ('attend-5', 30),
       ('attend-6', 50),
       ('attend-7', 50),
       ('attend-8', 50),
       ('attend-9', 50),
       ('attend-10', 100);


INSERT INTO table_code
         (id, table_name, is_use)
VALUES (1, 'member'  , 1),
       (2, 'board' , 1),
       (3, 'board_comment', 1);

