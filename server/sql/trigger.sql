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
