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
// ----------------------------------------------------------------------

export default function VineDetailsView() {

  const { id } = useParams();
  const [vine, setVine] = useState({});
  
  const [moistureData, setMoistureData] = useState(null);
  const [tempData, setTempData] = useState([]);

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
          }).sort((a, b) => Object.values(b)[0] - Object.values(a)[0]));

          
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
            const newTempData = [...tempData];
            newTempData.push({[JSON.parse(data.body).date]: JSON.parse(data.body).value});
            console.log("New temperature data: ", newTempData);
            setTempData(newTempData.sort((a, b) => Object.values(b)[0] - Object.values(a)[0]));
          }
          if (JSON.parse(data.body).sensor == "moisture") {
            const newMoistureData = [...moistureData];
            newMoistureData.shift();
            newMoistureData.push(JSON.parse(data.body).value);
            console.log("New moisture data: ", newMoistureData);
            setMoistureData(newMoistureData);
          }
          
        }
      });
    });
  }
  , [id, moistureData], [id, tempData]);

  console.log("Moisture", moistureData);
  console.log("Temperature", tempData);
  console.log("Latest value: ", latestValue);
  

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
