import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

import AppNutritionChart from "../app-nutrition-chart";
import AppHumidityChart from "../app-humidity-chart";
import AppTemperatureChart from "../app-temperature-chart";
import AppEnvironmentalImpactChart from "../app-environmentalimpact-chart";

import { fetchData } from "src/utils";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { Box, Card, CardHeader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import Iconify from "src/components/iconify";
// ----------------------------------------------------------------------

export default function VineDetailsView() {

  const { id } = useParams();
  const [vine, setVine] = useState({});
  
  const [moistureData, setMoistureData] = useState(null);
  const [tempData, setTempData] = useState([]);
  const [weatherAlertsData, setWeatherAlertsData] = useState([]);
  const [weatherAlertsNotification, setWeatherAlertsNotification] = useState([]);

  const [currentDay, setCurrentDay] = useState(new Date().getDate());

  useEffect(() => {
    const initialize = async () => {
      const res = fetchData(`vines/${id}`);

      res.then((data) => {
        setVine(data);
      });
    }

    initialize();
  }, []);


  useEffect(() => {
    const res = fetchData(`vines/moisture/${id}`);
    res.then((response) => {
      if (response) {
        console.log("Moisture data fetched");
        
        // moisture is a list of doubles
        const moisture = response;
        const moistureData = moisture.map((value, index) => {
          return value;
        });
        setMoistureData(moistureData);
      } else {
        console.log("Moisture data failed");
      }
    });
  }
  , [id]);

  useEffect(() => {
    fetchData(`vines/temperature/${id}`)
      .then(response => {
        if (response) {
          console.log("Temperature data fetched");
          
          const labels = Object.keys(response);
          const values = Object.values(response);

          setTempData(labels.map((value, index) => {
            return {[value]: values[index]};
          }).sort((a, b) => Object.keys(b)[0] - Object.keys(a)[0]));

          
        } else {
          console.log("Temperature data failed");
        }
      });
  }, [id]);

  useEffect(() => {
    fetchData(`vines/weatherAlerts/${id}`)
      .then(response => {
        if (response) {
          console.log("Weather Alerts data fetched");
        
          const labels = Object.keys(response);
          const values = Object.values(response);

          setWeatherAlertsData(labels.map((value, index) => {
            return {
              type: value,
              level: values[index][2],
              startTime: values[index][0],
              endTime: values[index][1]
            };
          }));

          setWeatherAlertsNotification(labels.map((value, index) => {
            return {
              type: value,
              level: values[index][2],
              startTime: values[index][0],
              endTime: values[index][1],
              text: values[index][3]

            };
          }).filter((value, index) => { return value.level != "green" ; }));
          
        } else {
          console.log("Temperature data failed");
        }
      });
  }, [id]);


  useEffect(() => {
    const today = new Date().getDate();
    if (today !== currentDay) {
      setTempData([]);
      setCurrentDay(today);
    }
  }, [currentDay]);

  // websocket
  const [latestValue, setLatestValue] = useState(null);
  useEffect(() => {
    const today = new Date().getDate();
    if (today !== currentDay) {
      setTempData([]);
      setCurrentDay(today);
    }
    const ws = new SockJS("http://localhost:8080/vt_ws");
    const client = Stomp.over(ws);
    client.connect({}, function () {
      client.subscribe('/topic/update', function (data) {
        if (JSON.parse(data.body).id == id) {
          setLatestValue(JSON.parse(data.body).value);
          if (JSON.parse(data.body).sensor == "temperature") {
            const newtempData = [...tempData];

            if (!newtempData.map((value, index) => {return Object.keys(value)[0]}).includes(JSON.parse(data.body).date)) {
              newtempData.push({[JSON.parse(data.body).date]: JSON.parse(data.body).value});
              setTempData(newtempData.sort((a, b) => Object.keys(b)[0] - Object.keys(a)[0]));
            }

            console.log("New temperature data: ", newtempData);
            
          }
          if (JSON.parse(data.body).sensor == "moisture") {
            const newMoistureData = [...moistureData];
            newMoistureData.shift();
            newMoistureData.push(JSON.parse(data.body).value);
            console.log("New moisture data: ", newMoistureData);
            setMoistureData(newMoistureData);
          }
          if (JSON.parse(data.body).sensor == "weatherAlerts") {
            console.log("New weather alert: ", JSON.parse(data.body).value);
            
            const obj =  JSON.parse(data.body).value;
            const json = obj.replace(/'/g, '"');
            const obj2 = JSON.parse(json);

            const labels = Object.keys(obj2);
            const values = Object.values(obj2);

            setWeatherAlertsData(labels.map((value, index) => {
              return {
                type: value,
                level: values[index][2],
                startTime: values[index][0],
                endTime: values[index][1]
              };
            }));

            setWeatherAlertsNotification(labels.map((value, index) => {
              return {
                type: value,
                level: values[index][2],
                startTime: values[index][0],
                endTime: values[index][1],
                text: values[index][3]
  
              };
            }).filter((value, index) => { return value.level != "green" ; }));
          }
          
        }
      });
    });
  }
  , [id, moistureData], [id, tempData], [id, weatherAlertsData]);

  console.log("Moisture", moistureData);
  console.log("Temperature", tempData);
  console.log("Latest value: ", latestValue);
  console.log("Weather Alerts: ", weatherAlertsData);
  console.log("Weather Alerts Notification: ", weatherAlertsNotification);
  

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Overview of {vine.name}
      </Typography>

      <Typography variant="h5" sx={{ mb: 5 }}>
        Sensor Data
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={8}>
          <AppHumidityChart
            title="Humidity"
            subheader=" in Percentage (%)"
            chart={{
              labels: [
                "9h ago",
                "8h ago",
                "7h ago",
                "6h ago",
                "5h ago",
                "4h ago",
                "3h ago",
                "2h ago",
                "1h ago",
                "NOW",
              ],
              series: [
                {
                  name: "Humidity",
                  type: "line",
                  fill: "solid",
                  data: moistureData,
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppNutritionChart
            title="Nutrition Values"
            chart={{
              series: [
                { label: "Nitrogen (N)", value: 48.0 },
                { label: "Phosphorus (P)", value: 11.3 },
                { label: "Potassium (K)", value: 21.3 },
                { label: "Magnesium (Mg)", value: 19.5 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppTemperatureChart
            title="Temperature"
            subheader=" in Celsius (°C)"
            chart={{
              labels: tempData.map((value, index) => {return Object.keys(value)[0]}),
              series: [
                {
                  name: "Temperature",
                  type: "line",
                  color: "#FF0000",
                  fill: "solid",
                  data: tempData.map((value, index) => { return Object.values(value)[0]})
                },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <Card>
              <CardHeader title='Weather Alerts'  />
              <Box sx={{ p: 3, pb: 1 }}>
                {weatherAlertsData && 
                  <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Alert Type</TableCell>
                        <TableCell align="right">Level</TableCell>
                        <TableCell align="right">Start Time</TableCell>
                        <TableCell align="right">End Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {weatherAlertsData.map((row) => (
                        <TableRow
                          key={row.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {row.type}
                          </TableCell>
                          <TableCell align="right">{row.level}</TableCell>
                          <TableCell align="right">{row.startTime}</TableCell>
                          <TableCell align="right">{row.endTime}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                }
                {!weatherAlertsData && <Typography variant="body2" sx={{ mb: 1 }}>No weather alerts</Typography>}
              </Box>
          </Card>
        </Grid>
      </Grid>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <Typography variant="h5" sx={{ mb: 5 }}>
        Environmental Impact
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={8}>
          <AppEnvironmentalImpactChart
            title="Environmental Impact"
            subheader={`By Usage per Month`}
            chart={{
              labels: [
                "01/01/2023",
                "02/01/2023",
                "03/01/2023",
                "04/01/2023",
                "05/01/2023",
                "06/01/2023",
                "07/01/2023",
                "08/01/2023",
                "09/01/2023",
                "10/01/2023",
                "11/01/2023",
              ],
              series: [
                {
                  name: "Water",
                  type: "bar",
                  color: "#0000FF",
                  fill: "solid",
                  unit: "L",
                  data: [18, 19, 20, 22, 24, 28, 30, 31, 28, 24, 22],
                },
                {
                  name: "Fertilizer",
                  type: "bar",
                  color: "#00FF00",
                  fill: "solid",
                  unit: "kg",
                  data: [10, 10, 11, 11, 10, 8, 8, 9, 11, 12, 13],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <Card>

              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <CardHeader title='PH Values' />
                </Grid>
                <Grid item sx={{pt: 4, pr: 3}}>
                  <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                  >
                    Add New Value
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ p: 3, pb: 1 }}>
                {weatherAlertsData && 
                  <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">PH Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {weatherAlertsData.map((row) => (
                        <TableRow
                          key={row.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {row.type}
                          </TableCell>
                          <TableCell align="right">{row.level}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                }
                {!weatherAlertsData && <Typography variant="body2" sx={{ mb: 1 }}>No weather alerts</Typography>}
              </Box>

          </Card>
        </Grid>
      </Grid>

      {/* BOM PARA USAR NOUTRO SITIO
        <Grid xs={12} md={6} lg={8}>
          <AppTasks
            title="Tasks"
            list={[
              { id: '1', name: 'Create FireStone Logo' },
              { id: '2', name: 'Add SCSS and JS files if required' },
              { id: '3', name: 'Stakeholder Meeting' },
              { id: '4', name: 'Scoping & Estimations' },
              { id: '5', name: 'Sprint Showcase' },
            ]}
          />
        </Grid>
            */}
    </Container>
  );
}
