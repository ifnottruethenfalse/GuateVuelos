/*Script*/

CREATE TABLE USUARIOS(
	nit char(20),
	usuario char(20),
	password char(20),
	nombre char(20),
	apellido char(20),
	numeropasaporte char(20),
	tarjetadecredito char(20),
	correoelectronico char(20),
	superuser boolean,
	PRIMARY KEY(usuario)
);
CREATE TABLE AEROLINEAS(
	codigo char(10),
	nombre char(20),
	host char(20),
	ext char(20),
	PRIMARY KEY(codigo)
);

CREATE TABLE VUELOS(
	codigo char(10),
	numerovuelo int,
	fecha char(20),
	origen char(20),
	destino char(20),
	hora char(20),
	precio float,
	status char(20),
	PRIMARY KEY(numerovuelo, codigo),
	FOREIGN KEY(codigo) REFERENCES AEROLINEAS 
	ON DELETE CASCADE
);

CREATE TABLE BOLETO(
	codigo char(10),
	numerovuelo int,
	fecha char(20),
	hora char(20),
	numeroboleto int,
	PRIMARY KEY(numeroboleto, codigo),
	FOREIGN KEY(codigo, numerovuelo) REFERENCES VUELOS(codigo, numerovuelo)
	ON DELETE CASCADE
);

CREATE TABLE COMPRAS(
	usuario char(20),
	numeroboleto int,
	codigo char(10),
	fecha char(20),
	PRIMARY KEY(numeroboleto, usuario),
	FOREIGN KEY(usuario) REFERENCES USUARIOS(usuario)
	ON DELETE CASCADE,
	FOREIGN KEY(numeroboleto, codigo) REFERENCES BOLETO(numeroboleto, codigo)
	ON DELETE CASCADE

);
CREATE TABLE AIRPORT(
	id char(3),
	place char(20),
	name char(20),
	PRIMARY KEY(id)
);
INSERT INTO usuarios VALUES(0,'superuser','cris12345','cristhian','morales','1234567890','0123456789012345','cristhian@gmail.com',true) /* Para ingresar el superuser*/