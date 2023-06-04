import "./App.css";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

function App() {
  const API_URL = "http://34.125.46.137:5000";
  const [dataRam, setDataRam] = useState();
  const [dataCpu, setDataCpu] = useState();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    await fetch(`${API_URL}/getData`)
      .then((response) => response.json())
      .then((data) => {
        let temp1 = JSON.parse(data.ram);
        let temp2 = JSON.parse(data.cpu);
        setDataRam(temp1);
        setDataCpu(temp2.data);
        console.log(temp1);
        console.log(temp2);

        setLoading(true);
      })
      .catch((err) => console.log(err));
  };

  const options = {
    title: {
      display: true,
      text: "Porcentaje de uso de la memoria RAM",
    },
  };

  const data = {
    labels: ["%libre", "%ocupado"],
    datasets: [
      {
        label: "My First Dataset",
        data: [
          (parseInt(dataRam?.freeram) * 100) / parseInt(dataRam?.totalram),
          100 -
            (parseInt(dataRam?.freeram) * 100) / parseInt(dataRam?.totalram),
        ],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const popOver = (Childrens) => {
    return (
      <Popover id="popover-basic">
        <Popover.Header as="h3">Información de procesos hijos</Popover.Header>
        <Popover.Body>
          {Childrens.map((children) => {
            return (
              <div>
                <li>{"Pid: " + children.pid + ", Nombre: " + children.name}</li>
              </div>
            );
          })}
        </Popover.Body>
      </Popover>
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <h1>Practica 1 - Sistemas operativos 2</h1>
      {loading === false ? (
        <h1>loading...</h1>
      ) : (
        <Row>
          {/* GRAFICA RAM */}
          <Col md="auto">
            <div style={{ height: "350px", width: "350px" }}>
              <h3>Porcentaje de Ram</h3>
              <Pie data={data} options={options} />
            </div>
            <br></br>
            <br></br>
          </Col>
          {/* TABLA DE PROCESOS */}
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <td>Pid</td>
                  <td>Name</td>
                  <td>User</td>
                  <td>State</td>
                  <td>Childs</td>
                </tr>
              </thead>
              <tbody>
                {dataCpu.map((process) => {
                  return (
                    <tr key={process.pid}>
                      <td>{process.pid}</td>
                      <td>{process.name}</td>
                      <td>{process.user}</td>
                      <td>
                        {process.state === 1
                          ? " (1) Sleeping"
                          : process.state === 1026
                          ? "(1026) Sleeping"
                          : process.state === 0
                          ? " (0) Running"
                          : process.state === 4
                          ? "(4) Zombie"
                          : process.state === 8
                          ? "(8) Stopped"
                          : ""}
                      </td>
                      <td>
                        <OverlayTrigger
                          trigger="click"
                          placement="bottom"
                          overlay={popOver(process.children)}
                        >
                          <Button variant="outline-dark">Ver</Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default App;
