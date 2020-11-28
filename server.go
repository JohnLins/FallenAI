package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/smtp"

	"github.com/gorilla/mux"
)

func main() {
	fmt.Println("Server started...")
	fmt.Println(" * Running on http://127.0.0.1:8080/")
	fmt.Println(" * IP: localhost")
	fmt.Println(" * Port: 8080")

	r := mux.NewRouter()

	r.HandleFunc("/sendEmail", sendEmail).Queries("email", "{email}", "msg", "{msg}").Methods("GET")
	

	path := "model"

	r.PathPrefix("/").Handler(http.FileServer(http.Dir(path)))
	http.ListenAndServe(":8080", r)

	
	fmt.Println("Server End")
}



func sendEmail(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	from := "johnlinstest@gmail.com"
	pass := "kqu3-b@vFu_/P4W7"
	to := params["email"]

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: emergency\n\n" +
		params["msg"]

	err := smtp.SendMail("smtp.gmail.com:587",
		smtp.PlainAuth("", from, pass, "smtp.gmail.com"),
		from, []string{to}, []byte(msg))

	if err != nil {
		log.Printf("smtp error: %s", err)
		return
	}

	json.NewEncoder(w).Encode("Message Sent!")
}


