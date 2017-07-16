DROP DATABASE IF EXISTS budggest;

CREATE DATABASE budggest;
USE budggest;

create table PERSONNES (
    NOM VARCHAR(30) NOT NULL primary key,
    PASS VARCHAR(30) NOT NULL,
    ROLE INT NOT NULL,
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
    MONTANT DECIMAL(10,2) NOT NULL,
    DATE_DEP DATE NOT NULL,
	POSTE_ID INT NOT NULL,
    PERSONNE VARCHAR(30) NOT NULL,
    foreign key (POSTE_ID) REFERENCES POSTES(ID_POST),
    foreign key (PERSONNE) REFERENCES PERSONNES(NOM)
)engine=innodb;

create table RENTREES (
    ID_RENT INT NOT NULL auto_increment primary key,
    NOM VARCHAR(50),
    MONTANT DECIMAL(10,2) NOT NULL,
    DATE_RENT DATE NOT NULL,
    ORIGINE_ID INT NOT NULL,
    PERSONNE VARCHAR(30) NOT NULL,    
	foreign key (ORIGINE_ID) REFERENCES ORIGINES(ID_ORIG),
    foreign key (PERSONNE) REFERENCES PERSONNES(NOM)
)engine=innodb;

create table VIREMENTS (
    ID_VIR INT NOT NULL auto_increment primary key,
    NOM VARCHAR(50),
    MONTANT DECIMAL(10,2) NOT NULL,
    DATE_VIR DATE NOT NULL,
    BENEFICIAIRE VARCHAR(30) NOT NULL,
    PERSONNE VARCHAR(30) NOT NULL,    
	foreign key (BENEFICIAIRE) REFERENCES PERSONNES(NOM),
    foreign key (PERSONNE) REFERENCES PERSONNES(NOM)
)engine=innodb;

insert into personnes (nom, pass, role, avatar) values 
    ('Arthur', 'saucisse', 0, 1), 
    ('Juliette', '1919', 0, 3), 
    ('Marmaduke', 'bababab', 1, 5);

insert into POSTES (nom) values ('Supermarché'), ('Bar'), ('Restau'), ('Beaugrenelle'), ('Jeux');
insert into ORIGINES (nom) values ('RSA'), ('Vie de voyou'), ('Cordonnerie');

insert into depenses (nom, montant, date_dep, poste_id, personne) values 
('courses carrouf', 75.24, '2017-07-02', 1, 'Arthur'),
('caisses overwatch', 39.99, '2017-05-01', 5, 'Arthur'),
('cadeau marie', 48.99, '2017-04-30', 4, 'Marmaduke'),
('Sortie avec Gabrielle -apero-', 32.00, '2017-07-03', 2, 'Arthur'),
('Sortie avec Gabrielle -repas-', 42.15, '2017-07-03', 3, 'Arthur'),
('Soldes Steam', 68.88, '2017-06-29', 5, 'Arthur'),
('courses raclette démente', 82.79, '2017-04-18', 1, 'Juliette'),
('billets Ultra-Vomit', 72.00, '2017-05-27', 4, 'Juliette'),
('Shopping parce qu\'il fait chaud', 59.99, '2017-06-22', 4, 'Juliette');

insert into rentrees (nom, montant, date_rent, origine_id, personne) values 
('braquage foireux', 450, '2017-06-05', 2, 'Arthur'),
('rsa juin', 355, '2017-06-07', 1, 'Arthur'),
('vente du rein de Marmaduke', 1200, '2017-04-28', 2, 'Juliette'),
('salaire juin', 1342.18, '2017-07-01', 3, 'Juliette');

insert into virements (nom, montant, date_vir, beneficiaire, personne) values
('argent pour anniv pote marmaduke', 50, '2017-04-26', 'Marmaduke', 'Arthur');