CREATE TABLE IF NOT EXISTS "DiariesDB".rdt (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	tittle varchar(32) NULL,
	datetime timestamp not null,
	situation varchar(255) NULL,
	auto_thoughts varchar(255) NULL,
	emotion varchar(255) NULL,
	response varchar(255) NULL,
	outcome varchar(255) NULL,
	CONSTRAINT "RDT_PK" PRIMARY KEY (id)
);

commit;