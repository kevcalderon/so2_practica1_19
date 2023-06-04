# MANUAL TECNICO :zap:

Se implemento un dashboard simple para obtener información sobre la memoria RAM y CPU
del sistema haciendo uso de módulos del kernel escritos en C para obtener la información y escribirla
en archivos dentro de la carpeta /proc para posteriormente leerlos con Golang.
Estos datos leídos deberán ser almacenados en una base de datos MySQL para luego ser obtenidos por una API desarrollada en NodeJS.
Y estos datos serán mostrados en una página web desarrollada con Reactjs.

## MÁQUINAS VIRTUALES :pushpin:

<p align="center">
  <img src="https://github.com/kevcalderon/SO1_201902714/blob/master/Practica2/img/vms.png" width="600">
</p>

### Modulos de kernel :bomb:

Para este caso se utlizó los modulos de kernel, para obtener distintos procesos tanto para la memoria ram y el cpu (procesos).

```
//STRUCTS UTILIZADOS PARA OBTENER LOS PROCESOS

struct task_struct * cpu;
struct task_struct * child;
struct list_head * nodo;

//STRUCTS UTLIZADOS PARA MEMORIA RAM
struct sysinfo si;
```

### Dockerfile para api en go. :bomb:

```
FROM golang:alpine

WORKDIR /backend_go

COPY . .


RUN go mod init backend
RUN go get -u github.com/go-sql-driver/mysql
RUN go get -u github.com/gorilla/mux


CMD ["go","run","server.go"]

EXPOSE 8080
```

### Docker-compose para frontend y api en nodejs :bomb:

```
version: "3"

services:
  backend:
    container_name: backend
    restart: always
    image: kevcalderon/backnode_practica2
    ports:
      - "5000:5000"

  frontend:
    container_name: frontend
    restart: always
    image: kevcalderon/front_practica2
    ports:
      - "3000:80"
    depends_on:
      - backend
    links:
      - backend
```

## BASE DE DATOS MYSQL :pushpin:

Se utilizó una base de datos MySql. Y se requirió solo una tabla para realizar este proyecto.

```
CREATE TABLE Dta (
  dta INTEGER PRIMARY KEY,
  ram TEXT NOT NULL,
  cpu TEXT NOT NULL
);
```

<p align="center">
  <img src="https://github.com/kevcalderon/SO1_201902714/blob/master/Practica2/img/bd.png" width="600">
</p>
