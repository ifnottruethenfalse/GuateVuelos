/*Script*/

CREATE TABLE USUARIOS(
	nit varchar,
	usuario varchar,
	password varchar,
	nombre varchar,
	apellido varchar,
	numeropasaporte varchar,
	tarjetadecredito varchar,
	correoelectronico varchar,
	superuser boolean,
	PRIMARY KEY(usuario)
);
CREATE TABLE AEROLINEAS(
	codigo char(10),
	nombre varchar,
	host varchar,
	ext char(20),
	PRIMARY KEY(codigo)
);

CREATE TABLE VUELOS(
	codigo varchar,
	numerovuelo int,
	fecha varchar,
	origen varchar,
	destino varchar,
	hora varchar,
	precio float,
	status varchar,
	PRIMARY KEY(numerovuelo, codigo),
	FOREIGN KEY(codigo) REFERENCES AEROLINEAS 
	ON DELETE CASCADE
);

CREATE TABLE BOLETO(
	codigo varchar,
	numerovuelo int,
	fecha varchar,
	hora varchar,
	numeroboleto int,
	PRIMARY KEY(numeroboleto, codigo),
	FOREIGN KEY(codigo, numerovuelo) REFERENCES VUELOS(codigo, numerovuelo)
	ON DELETE CASCADE
);

CREATE TABLE COMPRAS(
	usuario varchar,
	numeroboleto int,
	codigo varchar,
	fecha varchar,
	PRIMARY KEY(numeroboleto, usuario),
	FOREIGN KEY(usuario) REFERENCES USUARIOS(usuario)
	ON DELETE CASCADE,
	FOREIGN KEY(numeroboleto, codigo) REFERENCES BOLETO(numeroboleto, codigo)
	ON DELETE CASCADE

);
CREATE TABLE AIRPORT(
	id char(3),
	place varchar,
	name varchar,
	PRIMARY KEY(id)
);
CREATE TABLE SUPPORT(
	name varchar,
	description varchar

);
CREATE TABLE RESERVACION(
	username varchar,
	description varchar,
	paquete varchar,
	precio varchar

);
INSERT INTO usuarios VALUES(0,'superuser','cris12345','cristhian','morales','1234567890','0123456789012345','cristhian@gmail.com',true) /* Para ingresar el superuser */