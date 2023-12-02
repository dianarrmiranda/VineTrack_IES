import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

import AppNutritionChart from "../app-typeOfGrapes-chart";
import AppHumidityChart from "../app-production-chart";
import AppEnvironmentalImpactChart from "../app-environmentalimpact-chart";
import { useEffect, useState } from "react";
import { fetchData } from "src/utils";
// ----------------------------------------------------------------------


export default function AppView() {

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const initialize =  async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      user &&
        fetchData(`users/${user.id}`).then((res) => {
          const { id, name, role } = res;
          setUserInfo({ id, name, role });
        });
    };
    initialize();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Your Farm Overview
      </Typography>

      <Typography variant="h5" sx={{ mb: 5 }}>
        Sensor Data
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={8}>
          <AppHumidityChart
            title="Production Volume"
            subheader=" in Liters (L)"
            chart={{
              labels: [
                "09/30/2019",
                "09/30/2020",
                "09/30/2021",
                "09/30/2022",
                "09/30/2023",
              ],
              series: [
                {
                  name: "vine1",
                  type: "line",
                  fill: "solid",
                  data: [70, 78, 68, 50, 45],
                },
                {
                  name: "vine2",
                  type: "line",
                  fill: "solid",
                  data: [20, 59, 30, 14, 70],
                },
                {
                  name: "vine3",
                  type: "line",
                  fill: "solid",
                  data: [54, 80, 70, 90, 73],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppNutritionChart
            title="Types of Grapes"
            subheader=" in Percentage (%)"
            chart={{
              series: [
                { label: "Concord", value: 10.7 },
                { label: "Chardonnay", value: 15.3 },
                { label: "Cabernet Sauvignon", value: 30.0 },
                { label: "Pinot Noir", value: 24.5 },
                { label: "Shiraz/Syrah", value: 19.5 },
              ],
            }}
          />
        </Grid>
      </Grid>

      {/* Consumo de agua */}

      <Typography variant="h5" sx={{ mb: 5 }}>
        Water Consumption
      </Typography>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid xs={12} md={6} lg={8}>
          <AppHumidityChart
            title="Water Consumption Daily"
            subheader=" in Liters (L)"
            chart={{
              labels: [
                "09/30/2019",
                "09/30/2020",
                "09/30/2021",
                "09/30/2022",
                "09/30/2023",
              ],
              series: [
                {
                  name: "vine1",
                  type: "line",
                  fill: "solid",
                  data: [70, 78, 68, 50, 45],
                },
                {
                  name: "vine2",
                  type: "line",
                  fill: "solid",
                  data: [20, 59, 30, 14, 70],
                },
                {
                  name: "vine3",
                  type: "line",
                  fill: "solid",
                  data: [54, 80, 70, 90, 73],
                },
              ],
            }}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 5 }}>
        Environmental Impact
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={8}>
          <AppEnvironmentalImpactChart
            title="Environmental Impact Total"
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
