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



  // websocket
  const [latestValue, setLatestValue] = useState(null);
  useEffect(() => {
    const ws = new SockJS("http://localhost:8080/vt_ws");
    const client = Stomp.over(ws);
    client.connect({}, function () {
      client.subscribe('/topic/update', function (data) {
        if (JSON.parse(data.body).id == id) {
          setLatestValue(JSON.parse(data.body).value);
          const newMoistureData = [...moistureData];
          newMoistureData.shift();
          newMoistureData.push(JSON.parse(data.body).value);
          console.log("New moisture data: ", newMoistureData);
          setMoistureData(newMoistureData);
        }
      });
    });
  }
  , [id, moistureData]);

  console.log("Moisture", moistureData);
  console.log("Latest value: ", latestValue);
  
  // console.log("Nutrients", NutrientData);
  // console.log("Latest value: ", latestNutrientValue);

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
                "1h 30min ago",
                "1h 20min ago",
                "1h 10min ago",
                "1h ago",
                "50min ago",
                "40min ago",
                "30min ago",
                "20min ago",
                "10min ago",
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
                  name: "Temperature",
                  type: "line",
                  color: "#FF0000",
                  fill: "solid",
                  data: [18, 19, 20, 22, 24, 28, 30, 31, 28, 24, 22],
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
