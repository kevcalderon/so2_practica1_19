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
import axios from "axios";

function App() {
  const API_URL = "https://1f13-190-104-121-248.ngrok.io";
  const [dataRam, setDataRam] = useState();
  const [dataCpu, setDataCpu] = useState();
  const [loading, setLoading] = useState(false);

  const [vistaEspecifica, setVistaEspecifica] = useState(false);
  const [countSleeping, setCountSleeping] = useState(0);
  const [countRunning, setCountRunning] = useState(0);
  const [countZombie, setCountZombie] = useState(0);
  const [countStopped, setCountStopped] = useState(0);
  const [valuePid, setValuePid] = useState("");
  const [dataEspecific, setDataEspecific] = useState([]);
  const [total, setTotal] = useState(0);

  const [mem, setMem] = useState([]);

  const getData = async () => {
    await fetch(`${API_URL}/api/cpu`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // let temp1 = JSON.parse(data.ram);
        // let temp2 = JSON.parse(data);
        // setDataRam(temp1);

        setDataCpu(data);

        data.data.forEach((element) => {
          if (element.state === 1) {
            setCountSleeping((prevCount) => prevCount + 1);
            setTotal((prevCount) => prevCount + 1);
          } else if (element.state === 1026) {
            setCountSleeping((prevCount) => prevCount + 1);
            setTotal((prevCount) => prevCount + 1);
          } else if (element.state === 0) {
            setCountRunning((prevCount) => prevCount + 1);
            setTotal((prevCount) => prevCount + 1);
          } else if (element.state === 4) {
            setCountZombie((prevCount) => prevCount + 1);
            setTotal((prevCount) => prevCount + 1);
          } else if (element.state === 8) {
            setCountStopped((prevCount) => prevCount + 1);
            setTotal((prevCount) => prevCount + 1);
          }
        });

        // setMem((prevMem) => [
        //   ...prevMem,
        //   {
        //     label: "x",
        //     frequency:
        //       (parseInt(temp1.totalram) - parseInt(temp1.freeram)) /
        //       1024 /
        //       1024,
        //   },
        // ]);
      })
      .catch((err) => console.log(err));
  };

  const getMemory = async () => {
    const y = await fetch(`${API_URL}/api/ram`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Memory", data);
        setDataRam(data);
        // let temp1 = JSON.parse(data.ram);
        // let temp2 = JSON.parse(data);
        // setDataRam(temp1);
        setDataCpu(data);
        setMem((prevMem) => [
          ...prevMem,
          {
            label: "x",
            frequency:
              (parseInt(data.totalram) - parseInt(data.freeram)) / 1024 / 1024,
          },
        ]);
      })
      .catch((err) => console.log(err));

    // setMem((prevMem) => [
    //   ...prevMem,
    //   {
    //     label: "x",
    //     frequency:
    //       (parseInt(temp1.totalram) - parseInt(temp1.freeram)) /
    //       1024 /
    //       1024,
    //   },
    // ]);
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
          label: "Memoria",
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
    axios
      .get(`${API_URL}/api/kill/${pid}`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.error("Error al matar el proceso:", error);
      });
  };

  const viewProcess = async (pid, value) => {
    setVistaEspecifica(true);
    setValuePid(value);

    axios.get(`${API_URL}/api/memoria/${pid}`).then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        setDataEspecific(response.data);
      } else {
      }
    });
    // await fetch(`${API_URL}/api/memoria/${pid}`)
    //   .then((data) => {
    //     console.log(data);

    //
    //   })
    //   .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (vistaEspecifica === false) {
      setCountRunning(0);
      setCountSleeping(0);
      setCountStopped(0);
      setCountZombie(0);
      setTotal(0);

      const interval = setInterval(() => {
        getData();
      }, 20000);

      const interval2 = setInterval(() => {
        getData();
        getMemory();
      }, 5000);
      setLoading(true);
      return () => {
        clearInterval(interval);
        clearInterval(interval2);
      };
    }
  }, []);

  return (
    <Container>
      <h1>Practica 2 - Sistemas operativos 2</h1>

      {loading === false ? (
        <h1>loading...</h1>
      ) : (
        <Row>
          {vistaEspecifica === true ? (
            <div>
              <h1>Vista especifica de {valuePid}</h1>
              <Button
                variant="outline-info"
                onClick={() => {
                  setVistaEspecifica(false);
                }}
              >
                Regresa a vista general
              </Button>
              <br></br>
              {dataEspecific.length === 0 ? (
                "No hay informacion :("
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <td>Start Address</td>
                      <td>End Address</td>
                      <td>Size KB</td>
                      <td>Permissions</td>
                      <td>Device</td>
                    </tr>
                  </thead>
                  <tbody>
                    {dataEspecific.map((process, index) => {
                      return (
                        <tr key={process.index}>
                          <td>{process.start_address}</td>
                          <td>{process.end_address}</td>
                          <td>{process.size_kb}</td>
                          <td>
                            {process.permissions.includes("r")
                              ? ` lectura -`
                              : " "}

                            {process.permissions.includes("w")
                              ? ` escritura -`
                              : " "}
                            {process.permissions.includes("x")
                              ? ` ejecucion - `
                              : " "}
                            {process.permissions.includes("p")
                              ? ` private -`
                              : " "}
                            {` (${process.permissions}) `}
                          </td>
                          <td>{process.device}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </div>
          ) : (
            <Col>
              {" "}
              <div style={{ height: "600px", width: "900px" }}>
                <h3>Poligono de frecuencia</h3>
                <FrecuenciaChart data={data} />
              </div>
              <br></br>
              <br></br>
              <br></br>
              <div>
                <h5>
                  MEMORIA CONSUMIDA %:{" "}
                  <p>
                    {100 -
                      (parseInt(dataRam?.freeram) * 100) /
                        parseInt(dataRam?.totalram)}
                  </p>
                </h5>
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
                <h5>
                  TOTAL PROCESOS: <p>{total}</p>
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
                  {dataCpu?.data?.map((process) => {
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
                            <Button variant="outline-dark">Ver hijos</Button>
                          </OverlayTrigger>
                          <Button
                            variant="outline-danger"
                            style={{ margin: "1%" }}
                            onClick={() => killProcess(process.pid)}
                          >
                            Kill
                          </Button>
                          <Button
                            variant="outline-info"
                            style={{ margin: "1%" }}
                            onClick={() =>
                              viewProcess(
                                process.pid,
                                `${process.pid} - ${process.name}`
                              )
                            }
                          >
                            Ver
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
}

export default App;
