FROM golang:alpine

WORKDIR /backend_go

COPY . .


RUN go mod init backend
RUN go get -u github.com/go-sql-driver/mysql
RUN go get -u github.com/gorilla/mux


CMD ["go","run","server.go"]

EXPOSE 8080