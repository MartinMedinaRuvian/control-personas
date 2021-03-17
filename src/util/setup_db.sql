CREATE DATABASE IF NOT EXISTS control_personas;

USE control_personas;

CREATE TABLE IF NOT EXISTS cuenta(
   id INT(50) NOT NULL AUTO_INCREMENT PRIMARY KEY,
   nombre CHAR(255),
   usuario CHAR(100),
   password CHAR(100)
);

CREATE TABLE IF NOT EXISTS persona(
    id INT(50) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre CHAR(100) NOT NULL,
    identificacion CHAR(100),
    telefono CHAR(100),
    ciudad_residencia CHAR(100),
    cuenta_id INT(50),
    CONSTRAINT llave_cuenta FOREIGN KEY (cuenta_id) REFERENCES cuenta(id)
);


CREATE TABLE IF NOT EXISTS control(
   id INT(50) NOT NULL AUTO_INCREMENT PRIMARY KEY,
   origen CHAR(255),
   destino CHAR(255),
   temperatura double,
   fecha CHAR(100),
   hora CHAR(25),
   placa_vehiculo CHAR(50),
   observacion CHAR(255),
   persona_id INT(50),
   CONSTRAINT llave_persona FOREIGN KEY (persona_id) REFERENCES persona(id) 
);


CREATE TABLE IF NOT EXISTS control_cedula(
   id INT(50) NOT NULL AUTO_INCREMENT PRIMARY KEY,
   digitos CHAR(10),
   cuenta_id INT(50),
   CONSTRAINT llave_cuenta_cedula FOREIGN KEY (cuenta_id) REFERENCES cuenta(id) 
);
