INSERT INTO web_sys
       (code, name, description, permission)
VALUES ('002', 'auth', '2차 인증 변경알림', 'ADMIN');

INSERT INTO system_message
       (id, web_sys_pk, subject, content, create_at, update_at, is_use)
VALUES (2, '002','2차 인증 비활성화', '%s님의 2차 인증 설정이 변경되었습니다.', now(), now(), 1);

INSERT INTO system_message
       (id, web_sys_pk, subject, content, create_at, update_at, is_use)
VALUES (3, '002','2차 인증 활성화', '%s님의 2차 인증 설정이 변경되었습니다.', now(), now(), 1);


INSERT INTO web_sys
(code, name, description, permission)
VALUES ('003', 'confirmLogin', '로그인 위치 확인', 'ADMIN');

INSERT INTO system_message
(id, web_sys_pk, subject, content, create_at, update_at, is_use)
VALUES (4, '003','새로운 장소에서 로그인이 발생했습니다.', ' ip : %s </br> device : %s </br> location : %s </br> 에서 로그인이 발생했습니다.', now(), now(), 1);

