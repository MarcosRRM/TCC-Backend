CREATE TABLE IF NOT EXISTS "DiariesDB".person (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	full_name varchar(64) NOT NULL DEFAULT 'No Name'::character varying,
	user_id int4 NOT NULL,
	CONSTRAINT person_pk PRIMARY KEY (id),
	CONSTRAINT user_fk
      FOREIGN KEY(user_id) 
	  REFERENCES "DiariesDB"."user"(id)
);

commit;