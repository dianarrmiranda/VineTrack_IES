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
            fetchData(`users/${user.id}`, user.token).then((res) => {
              const { id, name, role } = res;
              const token = user.token;
              setUserInfo({ id, name, role, token });
            });
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
      const grapes = await fetchData(`vines/areaGrapes/`, userInfo.token);

      const areaGrapesList = Object.entries(grapes).map(([label, value]) => ({ label, value }));

      setAreaGrapes(areaGrapesList);
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
