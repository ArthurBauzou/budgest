DROP DATABASE IF EXISTS budggest;

CREATE DATABASE budggest;
USE budggest;

create table PERSONNES (
    NOM VARCHAR(30) NOT NULL primary key,
    PASS VARCHAR(30) NOT NULL,
    AVATAR INT
)engine=innodb;

create table POSTES (
	ID_POST INT NOT NULL auto_increment primary key,
    NOM VARCHAR(50) NOT NULL
)engine=innodb;

create table ORIGINES (
	ID_ORIG INT NOT NULL auto_increment primary key,
    NOM VARCHAR(50) NOT NULL
)engine=innodb;

create table DEPENSES (
    ID_DEP INT NOT NULL auto_increment primary key,
    NOM VARCHAR(50),
    MONTANT FLOAT NOT NULL,
    DATE_DEP DATE NOT NULL,
	POSTE_ID INT NOT NULL,
    PERSONNE VARCHAR(30) NOT NULL,
    foreign key (POSTE_ID) REFERENCES POSTES(ID_POST),
    foreign key (PERSONNE) REFERENCES PERSONNES(NOM)
)engine=innodb;

create table RENTREES (
    ID_RENT INT NOT NULL auto_increment primary key,
    NOM VARCHAR(50),
    MONTANT FLOAT NOT NULL,
    DATE_RENT DATE NOT NULL,
    PERSONNE VARCHAR(30) NOT NULL,
    ORIGINE_ID INT NOT NULL,
	foreign key (ORIGINE_ID) REFERENCES ORIGINES(ID_ORIG),
    foreign key (PERSONNE) REFERENCES PERSONNES(NOM)
)engine=innodb;

insert into personnes (nom, pass, avatar) values ('arthur', 'saucisse', 8), ('juliette', '1919', 4);

insert into POSTES (nom) values ('Supermarché'), ('Bar'), ('Restau');
insert into ORIGINES (nom) values ('RSA'), ('Detournements de fonds');