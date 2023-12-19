import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

import AppNutritionChart from "../app-typeOfGrapes-chart";
import AppHumidityChart from "../app-production-chart";
import { useEffect, useState } from "react";
import { fetchData } from "src/utils";
// ----------------------------------------------------------------------


export default function AppView() {

const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const initialize = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const res = await fetchData(`users/${user.id}`, user.token);
        if (res) {
          const { id, name, role } = res;
          const token = user.token;
          setUserInfo({ id, name, role, token });
        } else {
          console.log('Failed to fetch user data');
        }
      } else {
        console.log('No user data in local storage');
      }
    };
    initialize();
  }, []);

  // get user's vine ids
  const [vineIds, setVineIds] = useState([]);
  useEffect(() => {
    const initialize = async () => {
      if (!userInfo.id) return;
      const vineIds = await fetchData(`users/vines/${userInfo.id}`, userInfo.token);

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
        if (!vineId) continue;
        const vineName = await fetchData(`vines/name/${vineId}`, userInfo.token);
        const vineWaterConsumption = await fetchData(`vines/waterConsumption/${vineId}`, userInfo.token);
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
        if (!vineId) continue;
        const vineName = await fetchData(`vines/name/${vineId}`, userInfo.token);
        const production = await fetchData(`vines/production/${vineId}`, userInfo.token);
     
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
       
      setSeriesProduction(series);
      setLabelsProduction(labels);
      setVineProduction(vineProduction);
    };
    initialize();
  }, [vineIds]);

  const [areaGrapes, setAreaGrapes] = useState([]);
  useEffect(() => {
    const initialize = async () => {
      if (!vineIds || vineIds.length === 0) {
        console.log('Vine IDs not available');
        return;
      }
  
      const grapes = await fetchData(`vines/areaGrapes/${userInfo.id}`, userInfo.token);
  
      if (grapes) {
        const areaGrapesList = Object.entries(grapes).map(([label, value]) => ({ label, value }));
        setAreaGrapes(areaGrapesList);
      } else {
        console.log('Failed to fetch area grapes data');
      }
    };
  
    initialize();
  }, [vineIds]);

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
              series: areaGrapes,
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

    </Container>
  );
}
