import "./App.css";
import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
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
  const [countSleeping, setCountSleeping] = useState(0);
  const [countRunning, setCountRunning] = useState(0);
  const [countZombie, setCountZombie] = useState(0);
  const [countStopped, setCountStopped] = useState(0);

  const [mem, setMem] = useState([]);

  const getData = async () => {
    await fetch(`${API_URL}/getData`)
      .then((response) => response.json())
      .then((data) => {
        let temp1 = JSON.parse(data.ram);
        let temp2 = JSON.parse(data.cpu);
        setDataRam(temp1);

        setDataCpu(temp2.data);

        temp2.data.forEach((element) => {
          if (element.state === 1) {
            setCountSleeping((prevCount) => prevCount + 1);
          } else if (element.state === 1026) {
            setCountSleeping((prevCount) => prevCount + 1);
          } else if (element.state === 0) {
            setCountRunning((prevCount) => prevCount + 1);
          } else if (element.state === 4) {
            setCountZombie((prevCount) => prevCount + 1);
          } else if (element.state === 8) {
            setCountStopped((prevCount) => prevCount + 1);
          }
        });

        setMem((prevMem) => [
          ...prevMem,
          {
            label: "x",
            frequency:
              (parseInt(temp1.totalram) - parseInt(temp1.freeram)) /
              1024 /
              1024,
          },
        ]);

        setLoading(true);
      })
      .catch((err) => console.log(err));
  };

  const optionsPie = {
    title: {
      display: true,
      text: "Porcentaje de uso de la memoria RAM",
    },
  };

  const data2 = {
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

  const data = mem;

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

  const FrecuenciaChart = ({ data }) => {
    const chartData = {
      labels: data.map((item) => item.label),
      datasets: [
        {
          label: "Frecuencia",
          data: data.map((item) => item.frequency),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return <Line data={chartData} options={chartOptions} />;
  };

  const killProcess = async (pid) => {
    console.log("AGREGUE");
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
          <Col>
            {" "}
            <div style={{ height: "600px", width: "900px" }}>
              <h3>Poligono de frecuencia</h3>
              <FrecuenciaChart data={data} />
            </div>
            <div style={{ height: "350px", width: "350px" }}>
              <h3>Porcentaje de Ram</h3>
              <Pie data={data2} options={optionsPie} />
            </div>
            <br></br>
            <br></br>
            <br></br>
            <div>
              <h5>
                Sleeping: <p>{countSleeping}</p>
              </h5>
              <h5>
                Running: <p>{countRunning}</p>
              </h5>
              <h5>
                Stopped: <p>{countStopped}</p>
              </h5>
              <h5>
                Zombie: <p>{countZombie}</p>
              </h5>
            </div>
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
                        <Button
                          variant="outline-danger"
                          style={{ margin: "1%" }}
                          onClick={() => killProcess(process.pid)}
                        >
                          Kill
                        </Button>
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
