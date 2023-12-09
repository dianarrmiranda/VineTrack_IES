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

  // get user's vine ids
  const [vineIds, setVineIds] = useState([]);
  useEffect(() => {
    const initialize = async () => {
      const vineIds = await fetchData(`users/vines/${userInfo.id}`);
      setVineIds(vineIds);
    };
    initialize();
  }, [userInfo]);

  // get water consumption data for each vine
  const [waterConsumption, setWaterConsumption] = useState([]);
  // also need to get the vine name
  useEffect(() => {
    const initialize = async () => {
      // waterConsumption is a map of vinName: waterConsumptionValue
      const waterConsumption = {};
      for (const vineId of vineIds) {
        const vineName = await fetchData(`vines/name/${vineId}`);
        const vineWaterConsumption = await fetchData(`vines/waterConsumption/${vineId}`);
        waterConsumption[vineName] = vineWaterConsumption;
      }
      setWaterConsumption(waterConsumption);
    };
    initialize();
  }, [vineIds]);

  // finnaly, create the yaxis data for the water consumption chart
  const [waterConsumptionData, setWaterConsumptionData] = useState([]);
  useEffect(() => {
    const initialize = async () => {
      const waterConsumptionData = [];
      for (const vineName in waterConsumption) {
        waterConsumptionData.push({
          name: vineName,
          type: "line",
          fill: "solid",
          data: waterConsumption[vineName],
        });
      }
      setWaterConsumptionData(waterConsumptionData);
    };
    initialize();
  }, [waterConsumption]);

  const [vineProduction, setVineProduction] = useState([]);
  const [labelsProduction, setLabelsProduction] = useState([]);
  const [seriesProduction, setSeriesProduction] = useState([]);
  useEffect(() => {
    const initialize = async () => {
      const vineProduction = {};
      for (const vineId of vineIds) {
        const vineName = await fetchData(`vines/name/${vineId}`);
        const production = await fetchData(`vines/production/${vineId}`);
     
        vineProduction[vineName] = production;

      } 

      const allKeys = Object.entries(vineProduction).reduce((acc, [vine, years]) => {
        return [...acc, ...Object.keys(years)];
      }, []);

      const labels = [...new Set(allKeys)].sort();

      const series = Object.entries(vineProduction).map(([key, value]) => {
        return {
          name: key,
          data: labels.map(year => value[year] || 0)
        };
       });
       
      console.log(series);

      setSeriesProduction(series);
      setLabelsProduction(labels);
      setVineProduction(vineProduction);
    };
    initialize();
  }, [vineIds]);



  const data = {
    vine1: {2023: 1234, 2022: 122, 2025:13},
    vine2: {2021:435, 2023:23}
   };
  
  const allKeys = [...Object.keys(data.vine1), ...Object.keys(data.vine2)];
  // Usar um Set para garantir unicidade e converter de volta para um array
  const labels = [...new Set(allKeys)].sort();
  const series = Object.entries(data).map(([key, value]) => {
   return {
     name: key,
     data: labels.map(year => value[year] || 0)
   };
  });

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
              labels: labelsProduction,
              series: seriesProduction,
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
        Water Consumption <span style={{ color: "grey", fontSize: "0.7em" }}>in the past 7 days</span>
      </Typography>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid xs={12} md={6} lg={8}>
          <AppHumidityChart
            title="Water Consumption Daily"
            subheader=" in Liters (L)"
            chart={{
              labels: [
                "7 days ago",
                "6 days ago",
                "5 days ago",
                "4 days ago",
                "3 days ago",
                "2 days ago",
                "yesterday",
                "today",
              ],
              series: waterConsumptionData,
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
