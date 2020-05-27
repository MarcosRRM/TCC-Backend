CREATE TABLE IF NOT EXISTS "DiariesDB"."user" (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	email varchar(64) NOT NULL,
	password_hash bpchar(128) NOT NULL,
	CONSTRAINT user_pk PRIMARY KEY (id)
);

commit;