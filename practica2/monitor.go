package main

import(
	"fmt"
	"log"
	"net/http"
)

func endpointPrueba(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Request recibido en el endpoint /")
	fmt.Fprintf(w, "Hola desde la VM de ArchLinux Roshgard")
}

func main(){
	go fmt.Println("Servidor iniciado en el puerto 8080")
	http.HandleFunc("/", endpointPrueba)

	err:= http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Error al iniciar el servidor: ", err)
	}
}