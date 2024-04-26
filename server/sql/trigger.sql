CREATE TRIGGER smtp_push_history_insert
 AFTER INSERT ON smtp_push_history
   FOR EACH ROW
 BEGIN
       INSERT INTO smtp_push_history_count
              (user_pk, user_config_smtp_pk, count)
       VALUES (new.user_pk, new.user_config_smtp_pk, 1)
           ON DUPLICATE KEY
              UPDATE count = count + 1;
   END ;

CREATE TRIGGER smtp_push_history_delete
 AFTER DELETE ON smtp_push_history
   FOR EACH ROW
 BEGIN
       UPDATE smtp_push_history_count
          SET count = count - 1
        WHERE user_pk = old.user_pk
          AND user_config_smtp_pk = old.user_config_smtp_pk;
   END ;
