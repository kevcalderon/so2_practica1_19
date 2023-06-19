FROM golang:alpine

WORKDIR /backend_go

COPY . .


RUN go mod init backend
RUN go get -u github.com/gorilla/mux
RUN go get -u github.com/gorilla/handlers


CMD ["go","run","server.go"]

EXPOSE 8080