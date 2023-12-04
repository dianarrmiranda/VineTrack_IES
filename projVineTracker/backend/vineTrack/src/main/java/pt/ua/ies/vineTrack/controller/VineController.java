package pt.ua.ies.vineTrack.controller;

import org.springframework.beans.factory.annotation.Autowired;

import pt.ua.ies.vineTrack.entity.Grape;
import pt.ua.ies.vineTrack.entity.Notification;
import pt.ua.ies.vineTrack.entity.Track;
import pt.ua.ies.vineTrack.entity.User;
import pt.ua.ies.vineTrack.entity.Vine;
import pt.ua.ies.vineTrack.service.GrapeService;
import pt.ua.ies.vineTrack.service.NotificationService;
import pt.ua.ies.vineTrack.service.TrackService;
import pt.ua.ies.vineTrack.service.UserService;
import pt.ua.ies.vineTrack.service.VineService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Date;
import org.javatuples.Pair;


@CrossOrigin("*")
@RestController
@RequestMapping(path = "/vines")
public class VineController {
    @Autowired
    private VineService vineService;
    @Autowired
    private UserService userService;
    @Autowired
    private GrapeService grapeService;
    @Autowired
    private TrackService trackService;
    @Autowired
    private NotificationService notificationService;

    @GetMapping(path = "/test")
    public Track getAllVinesTest(){
        // Returns the last track
        List<Track> tracks = vineService.getTracksByVineId(1);
        return tracks.get(tracks.size() - 1);
    }

    @GetMapping(path = "/moisture/{vineId}")
    public List<Double> getMoistureByVineId(@PathVariable int vineId){
        System.out.println("Vine id: " + vineId);
        List<Track> tracks = vineService.getTracksByVineId(vineId);
        Iterator<Track> iterator = tracks.iterator();
        while (iterator.hasNext()) {
            Track track = iterator.next();
            if (!track.getType().equals("moisture")) {
                iterator.remove();
            }
        }
        // now we need to order the tracks by date from the oldest to the newest
        tracks.sort(Comparator.comparing(Track::getDate));

        // finally we need to get only the moisture values
        List<Double> moistureValues = new ArrayList<>(tracks.stream().map(Track::getValue).toList());
        while (moistureValues.size() < 10) {
            moistureValues.add(0, 0.0);
        }
        if (moistureValues.size() > 10) {
            moistureValues = moistureValues.subList(moistureValues.size() - 10, moistureValues.size());
        }
        System.out.println("Moisture: " + moistureValues);
        return moistureValues;
    }

    @GetMapping(path = "/nutrients/{vineId}")
    public List<Double> getNutrientsByVineId(@PathVariable int vineId){
        System.out.println("Inside /nutrients: Vine id: " + vineId);
        List<Track> tracks = vineService.getTracksByVineId(vineId);
        // Iterator<Track> iterator = tracks.iterator();
        // while (iterator.hasNext()) {
        //     Track track = iterator.next();
        //     if (!track.getType().equals("nutrients")) {
        //         iterator.remove();
        //     }
        // }
        // now we need to order the tracks by date from the oldest to the newest
        tracks.sort(Comparator.comparing(Track::getDate));

        for (Track track : tracks) {
            double Nutrientval = track.getValue();
        }

        // finally we need to get only the moisture values
        List<Pair<String,Double>> NutrientsValues = new ArrayList<>();
        while (NutrientsValues.size() < 10) {
            nutrientsList.add(new Pair<>("Nitrogen", Nutrientval));
        }
        if (NutrientsValues.size() > 10) {
            NutrientsValues = NutrientsValues.subList(NutrientsValues.size() - 10, NutrientsValues.size());
        }
        System.out.println("Nutrients: " + NutrientsValues);
        return NutrientsValues;
    }

    @GetMapping(path = "/temperature/{vineId}")
    public Map<String, Double> getTemperatureByVineId(@PathVariable int vineId){
        System.out.println("Vine id: " + vineId);
        List<Track> tracks = vineService.getTracksByVineId(vineId);
        Iterator<Track> iterator = tracks.iterator();
        while (iterator.hasNext()) {
            Track track = iterator.next();
            if (!track.getType().equals("temperature")) {
                iterator.remove();
            }
        }

        // now we need to order the tracks by date from the oldest to the newest
        tracks.sort(Comparator.comparing(Track::getDate));

        // finally we need to get only the moisture values

        List<Double> tempValues = new ArrayList<>();
        List<String> tempTimes = new ArrayList<>();

        for (Track track : tracks) {
            if (track.getDay().equals(LocalDate.now().toString())) {
                tempValues.add(track.getValue());
                tempTimes.add(track.getTime());
            }
        }

        Map<String, Double> tempMap = new TreeMap<>();
        for (int i = 0; i < tempValues.size(); i++) {
            tempMap.put(tempTimes.get(i), tempValues.get(i));
        }

        System.out.println("Temperature: " + tempMap);
        return tempMap;
    }

    @GetMapping(path = "/weatherAlerts/{vineId}")
    public Map<String, String> getWeatherAlertsByVineId(@PathVariable int vineId){
        System.out.println("Vine id: " + vineId);
        List<Track> tracks = vineService.getTracksByVineId(vineId);
        Iterator<Track> iterator = tracks.iterator();
        while (iterator.hasNext()) {
            Track track = iterator.next();
            if (!track.getType().equals("weatherAlerts")) {
                iterator.remove();
            }
        }

        // now we need to order the tracks by date from the oldest to the newest
        tracks.sort(Comparator.comparing(Track::getDate));

        // finally we need to get only the moisture values

        List<String> weatherLabels = new ArrayList<>();
        List<String> weatherValues = new ArrayList<>();

        for (Track track : tracks) {
            String weatherAlerts = track.getValString();
            String[] weatherAlertsArray = weatherAlerts.split(",");
            for (String weatherAlert : weatherAlertsArray) {
                String[] weatherAlertArray = weatherAlert.split(":");
                weatherLabels.add(weatherAlertArray[0]);
                weatherValues.add(weatherAlertArray[1]);
            }
        }

        Map<String, String> weatherMap = new TreeMap<>();
        for (int i = 0; i < weatherValues.size(); i++) {
            weatherMap.put(weatherLabels.get(i), weatherValues.get(i));
        }

        System.out.println("Weather: " + weatherMap);
        return weatherMap;
    }

    @GetMapping(path = "/waterConsumption/{vineId}")
    public List<Double> getWaterConsumptionByVineId(@PathVariable int vineId){
        System.out.println("Vine id: " + vineId);
        List<Track> tracks = vineService.getTracksByVineId(vineId);

        tracks.removeIf(track -> !track.getType().equals("waterConsumption"));

        // map to store day: waterConsumption for that day
        Map<String, Double> waterConsumptionMap = new TreeMap<>();

        for (Track track : tracks) {
            String day = track.getDay();
            double waterConsumption = track.getValue();
            if (waterConsumptionMap.containsKey(day)) {
                waterConsumptionMap.put(day, waterConsumptionMap.get(day) + waterConsumption);
            } else {
                waterConsumptionMap.put(day, waterConsumption);
            }
        }

        System.out.println("Water consumption: " + waterConsumptionMap);

        List<Double> waterConsumptionValues = new ArrayList<>(waterConsumptionMap.values());
        while (waterConsumptionValues.size() < 8) {
            waterConsumptionValues.add(0, 0.0);
        }

        if (waterConsumptionValues.size() > 8) {
            waterConsumptionValues = waterConsumptionValues.subList(waterConsumptionValues.size() - 8, waterConsumptionValues.size());
        }

        return waterConsumptionValues;
    }

    @GetMapping(path = "/name/{vineId}")
    public String getVineNameById(@PathVariable Integer vineId){
        try {
            return vineService.getVineById(vineId).getName();
        } catch (Exception e) {
            return "Vine not found";
        }
    }


    @GetMapping()
    public ResponseEntity<List<Vine>> getAllVines(){
        try {
            return ResponseEntity.ok(vineService.getAllVines());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Vine> addVine(@RequestParam String name, @RequestParam String location, @RequestParam String city, @RequestParam Double size, @RequestParam java.util.Date date, @RequestParam(required = false) MultipartFile img, @RequestParam List<Integer> users, @RequestParam List<Integer> typeGrap){

        try {
            Vine vine = new Vine();
            vine.setName(name);
            vine.setLocation(location);
            vine.setCity(city);
            vine.setSize(size);
            vine.setImage("");
            vine.setDate(new Date(date.getTime()));
            for (Integer id : users) {
                User user = userService.getUserById(id);
                if (user.getVines() != null) {
                    if (!user.getVines().contains(vine)) {
                        user.getVines().add(vine);
                    }
                } else {
                    List<Vine> vines = new ArrayList<Vine>();
                    vines.add(vine);
                    user.setVines(vines);
                }
            }

            for (Integer id : typeGrap){
                Grape grape = grapeService.getGrapeById(id);
                if (vine.getTypeGrap() != null) {
                    if (!vine.getTypeGrap().contains(grape)) {
                        vine.getTypeGrap().add(grape);
                    }
                } else {
                    List<Grape> grapes = new ArrayList<Grape>();
                    grapes.add(grape);
                    vine.setTypeGrap(grapes);
                }
            }

            vineService.save(vine);

            // add 2 tracks to the vine
            LocalDateTime now = LocalDateTime.now();
            Track track2 = new Track("moisture", now, 0.0, vine, now.toLocalTime().toString(), now.toLocalDate().toString());
            Track track1 = new Track("moisture", LocalDateTime.now(), 0.0, vine, now.toLocalTime().toString(), now.toLocalDate().toString());
            trackService.saveTrack(track1);
            trackService.saveTrack(track2);

            if (!img.isEmpty()){
                try {
                    byte[] bytes = img.getBytes();
                    Path path = Paths.get("src/main/resources/static/vines/" + vine.getId() + "_" + vine.getName().replaceAll("\s", "") + ".jpeg");
                    Files.write(path, bytes);
                    vine.setImage(path.toString());
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            return ResponseEntity.ok(vineService.save(vine));
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<Vine> getVineById(@PathVariable Integer id){
        try {
            return ResponseEntity.ok(vineService.getVineById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(path = "/image/{id}")
    public ResponseEntity<byte[]> getImageById(@PathVariable Integer id) throws IOException{
        Vine vine = vineService.getVineById(id);
        Path path = Paths.get(vine.getImage());
        byte[] image = Files.readAllBytes(path);

        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(image);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<String> deleteVineById(@PathVariable Integer id){
        try {
            for (User user : vineService.getVineById(id).getUsers()) {
                user.getVines().remove(vineService.getVineById(id));
            }

            for (Track track : trackService.getAllTracks()){
                if (track.getVine().getId() == id){
                    trackService.deleteTrackById(track.getId());
                }
            }

            for (Notification noti : notificationService.getNotificationsByVine(vineService.getVineById(id))){
                notificationService.deleteNotificationById(noti.getId());
            }

            return ResponseEntity.ok(vineService.deleteVineById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
