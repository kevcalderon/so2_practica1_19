package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"os/exec"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type RAM struct {
	TotalRam string `json:"totalram"`
	FreeRam  string `json:"freeram"`
}

var conn = MySQLConn()

func MySQLConn() *sql.DB {
	connString := "root:S^UkfC~}f8IZF{&$@tcp(34.125.133.162:3306)/practica2"
	conn, err := sql.Open("mysql", connString)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("Connection succesfull MySQL")
	}
	return conn
}

func main() {

	i := 0
	for i < 10 {
		cmd := exec.Command("sh", "-c", "cat /proc/ram_201902714")
		out, err := cmd.CombinedOutput()
		if err != nil {
			fmt.Println(err)
		}
		outputRam := string(out[:])
		var ram RAM
		json.Unmarshal([]byte(outputRam), &ram)
		fmt.Println(outputRam)

		cmd2 := exec.Command("sh", "-c", "cat /proc/cpu_201902714")
		out2, err2 := cmd2.CombinedOutput()
		if err2 != nil {
			fmt.Println(err2)
		}
		outputCpu := string(out2[:])
		//fmt.Println(output2)

		/*cmd3:=exec.Command("sh","-c"," top -bn1 | awk '/Cpu/ { cpu = 100 - $8 }; END { print cpu }'")
		      		out3,err3 := cmd3.CombinedOutput()
		  		if err3 != nil {
					fmt.Println(err3)
				}
				output3:= string(out3[:])
		                fmt.Println(output3)*/

		query := "update Dta SET ram='" + outputRam + "' ,cpu='" + outputCpu + "'  where  dta=1;"
		result, err := conn.Query(query)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(result)
		time.Sleep(1 * time.Second)
	}

}
