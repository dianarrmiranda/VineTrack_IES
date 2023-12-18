package pt.ua.ies.vineTrack.message_broker;

import org.json.JSONObject;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import pt.ua.ies.vineTrack.entity.Nutrient;
import pt.ua.ies.vineTrack.entity.Track;
import pt.ua.ies.vineTrack.entity.Vine;
import pt.ua.ies.vineTrack.entity.Notification;
import pt.ua.ies.vineTrack.service.NutrientService;
import pt.ua.ies.vineTrack.service.TrackService;
import pt.ua.ies.vineTrack.service.VineService;
import pt.ua.ies.vineTrack.service.NotificationService;

import org.apache.commons.lang3.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.temporal.WeekFields;
import java.util.*;

@Component
public class RabbitmqHandler {
    @Autowired
    private SimpMessagingTemplate template; // for sending messages to the client through websocket
    @Autowired
    private VineService vineService;
    @Autowired
    private NutrientService nutrientService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TrackService trackService;

    private static final int MAX_NOTIFICATIONS = 10;

    @RabbitListener(queues = Config.QUEUE_NAME)
    public void receiveMessage(String message) {
        System.out.println("Received <" + message + ">");
        
        JSONObject params = new JSONObject(message);
        String type = params.getString("sensor");
        System.out.println("Tipo de sensor:"+ type);

        switch (type) {
            case "moisture":
                this.template.convertAndSend("/topic/update", message);
                int vineId = params.getInt("id");
                double value = params.getDouble("value");
                double pastValue;
                // store the track in the database
                Vine vine = vineService.getVineById(vineId);
                System.out.println("Vine: " + vine.getName());
                List<Track> tracks = trackService.getLastMoistureTrackByVineId(vineId);
                Track lastMoistureTrack = !tracks.isEmpty() ? tracks.get(0) : null;
                LocalDateTime lastMoistureTrackDate = lastMoistureTrack != null ? lastMoistureTrack.getDate() : null;
                pastValue = lastMoistureTrack != null ? lastMoistureTrack.getValue() : 0;
                LocalDateTime date;
                if (lastMoistureTrackDate != null) {
                    date = lastMoistureTrackDate.plusHours(1);
                } else {
                    date = LocalDateTime.now();
                }

                LocalDate d = date.toLocalDate();
                LocalTime t = date.toLocalTime();

                Track track = new Track(type, date, value, vine, t.toString(), d.toString());

                trackService.saveTrack(track);

                // evolve the vine
                // get the last reset track
                List<Track> lastResetTrack = trackService.getLastResetTrackByVineId(vineId);
                // if there is no reset track, the start date is the date of the creation of the vine
                Date startDate = lastResetTrack.isEmpty() ? vine.getDate() : Date.from(lastResetTrack.get(0).getDate().atZone(ZoneId.systemDefault()).toInstant());
                // make it a LocalDate
                LocalDate startDateLocalDate = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

                // if the phase is 'bud' and it has been 2 weeks since the creation of the vine, evolve to 'flower'
                if (vine.getPhase().equals("bud")) {
                    // the current date is d
                    // if the difference between the two dates is 14 days or more, evolve to 'flower'
                    if (!d.isBefore(startDateLocalDate.plusDays(14))) {
                        vine.setPhase("flower");
                        vineService.save(vine);
                    }
                }
                // if the phase is 'flower' and it has been 6 weeks since the creation of the vine, evolve to 'fruit'
                if (vine.getPhase().equals("flower")) {
                    // the current date is d
                    // if the difference between the two dates is 42 days or more, evolve to 'fruit'
                    if (!d.isBefore(startDateLocalDate.plusDays(56))) { // 14 + 42 = 56
                        vine.setPhase("fruit");
                        vineService.save(vine);
                    }
                }
                // if the phase is 'fruit' and it has been 2 months since the creation of the vine, evolve to 'ripen'
                if (vine.getPhase().equals("fruit")) {
                    // the current date is d
                    // if the difference between the two dates is 60 days or more, evolve to 'ripen'
                    if (!d.isBefore(startDateLocalDate.plusDays(116))) { // 56 + 60 = 116
                        vine.setPhase("ripen");
                        vineService.save(vine);
                    }
                }
                // if the phase is 'ripen' and it has been 2 months since the creation of the vine, evolve to 'bud'
                if (vine.getPhase().equals("ripen")) {
                    // the current date is d
                    // if the difference between the two dates is 60 days or more, evolve to 'bud'
                    if (!d.isBefore(startDateLocalDate.plusDays(176))) { // 116 + 60 = 176
                        vine.setPhase("bud");
                        vineService.save(vine);

                        // create a new track indicating that the vine has been reset
                        Track resetTrack = new Track("reset", date, 0, vine, t.toString(), d.toString());
                    }
                }

                // only save the 10 most recent moisture tracks for each vine
                trackService.removeOldTracks("moisture", vineId);


                // water consumption
                if (value - pastValue > 0) { //watered
                    double waterPercentage = (value - pastValue);
                    // Per m^2: 100% = 4L
                    double waterConsumption = waterPercentage * 4 / 100 * vine.getSize();
                    // 2 decimal places
                    waterConsumption = Math.round(waterConsumption * 100.0) / 100.0;
                    trackService.saveTrack(new Track("waterConsumption", date, waterConsumption, vine, t.toString(), d.toString()));
                    System.out.println("Water consumption: " + waterConsumption);

                    // only keep water consumption tracks that are less than 8 days old
                    trackService.removeOldWaterConsumptionTracks();

                    // we need to add the water consumption to the vine's total water consumption for the week
                    // get the week number
                    int weekNumber = weekNumber(d);
                    boolean exists = false;
                    // see if there is a track for this week
                    List<Track> waterConsumptionTracks = trackService.getWaterConsumptionWeekTracksByVineId(vineId);
                    for (Track waterConsumptionTrack : waterConsumptionTracks) {
                        LocalDate trackDate = waterConsumptionTrack.getDate().toLocalDate();
                        int trackWeekNumber = weekNumber(trackDate);
                        if (trackWeekNumber == weekNumber) {
                            // there is a track for this week, add the water consumption to the total
                            double totalWaterConsumption = waterConsumptionTrack.getValue() + waterConsumption;
                            // 2 decimal places
                            totalWaterConsumption = Math.round(totalWaterConsumption * 100.0) / 100.0;
                            waterConsumptionTrack.setValue(totalWaterConsumption);
                            trackService.saveTrack(waterConsumptionTrack);
                            exists = true;
                            break;
                        }
                    }
                    // if there is no track for this week, create one
                    if (!exists) {
                        Track waterConsumptionTrack = new Track("waterConsumptionWeek", date, waterConsumption, vine, t.toString(), d.toString());
                        trackService.saveTrack(waterConsumptionTrack);
                    }

                    // send weekly water consumption through websocket
                    // get all weekly water consumption tracks for this vine
                    List<Track> waterConsumptionWeekTracks = trackService.getWaterConsumptionWeekTracksByVineId(vineId);
                    // sort them by date
                    waterConsumptionWeekTracks.sort(Comparator.comparing(Track::getDate));
                    // we only want the last 9 tracks
                    while (waterConsumptionWeekTracks.size() > 9) {
                        waterConsumptionWeekTracks.remove(0);
                    }
                    // get the values
                    List<Double> waterConsumptionWeekValues = new ArrayList<>();
                    for (Track waterConsumptionWeekTrack : waterConsumptionWeekTracks) {
                        waterConsumptionWeekValues.add(waterConsumptionWeekTrack.getValue());
                    }
                    // if there are less than 9 tracks, add 0s to the beginning
                    while (waterConsumptionWeekValues.size() < 9) {
                        waterConsumptionWeekValues.add(0, 0.0);
                    }
                    // send through websocket
                    JSONObject waterConsumptionWeekJson = new JSONObject();
                    waterConsumptionWeekJson.put("vineId", vineId);
                    waterConsumptionWeekJson.put("waterConsumptionWeekValues", waterConsumptionWeekValues);
                    this.template.convertAndSend("/topic/waterConsumptionWeek", waterConsumptionWeekJson.toString());

                    // check if water consumption is above the limit
                    double waterConsumptionLimit = vine.getMaxWaterConsumption();

                    // if water consumption is above the limit, send notification
                    if (waterConsumption > waterConsumptionLimit) {
                        Boolean isUnRead = true;
                        Notification notification = new Notification();
                        notification.setDescription("Water consumption is above the limit. Please check the vine " + vine.getName() + ".");
                        notification.setVine(vine); // Set the vine
                        notification.setType("waterConsumption"); // Set the type
                        notification.setAvatar("src/main/resources/static/images/waterConsumption.png"); // Set the avatar
                        notification.setIsUnRead(isUnRead); // Set the isUnRead
                        notification.setDate(LocalDateTime.now()); // Set the date
                        notification.setVineId(vine.getId()); // Set the vineId directly

                        System.out.println("VINE ID: " + vineId);
                        System.out.println("Received Notification: type: " + notification.getType() + " avatar: " + notification.getAvatar() + " isUnRead: " + notification.getIsUnRead() + " vineId: " + notification.getVineId());


                        int totalNotifications = notificationService.getNumberOfNotificationsByVine(vine);

                        // If the total exceeds the maximum limit, remove older notifications
                        if (totalNotifications > MAX_NOTIFICATIONS) {
                            notificationService.removeOldestNotificationsForVine(vine.getId(), MAX_NOTIFICATIONS);
                        }



                        notificationService.saveNotification(notification);

                        // send through websocket
                        JSONObject notificationJson = new JSONObject();
                        notificationJson.put("id", notification.getId());
                        notificationJson.put("type", notification.getType());
                        notificationJson.put("isUnRead", notification.getIsUnRead());
                        notificationJson.put("vineId", notification.getVineId());
                        notificationJson.put("description", notification.getDescription());
                        notificationJson.put("date", notification.getDate());
                        notificationJson.put("waterLimit", waterConsumptionLimit);
                        this.template.convertAndSend("/topic/notification", notificationJson.toString());


                    }


                }

                // receive message, if the value is bellow expected save notification to the database
                // for now we will consider that the expected value is 40
                if (value < 40) {
                    Boolean isUnRead = true;
                    Notification notification = new Notification();
                    // set description to  'Levels of the soil humidity are low.'
                    notification.setDescription("Levels of the soil humidity are low.");
                    notification.setVine(vine); // Set the vine
                    notification.setType("moisture"); // Set the type
                    notification.setAvatar("src/main/resources/static/images/water.png"); // Set the avatar
                    notification.setIsUnRead(isUnRead); // Set the isUnRead
                    notification.setDate(LocalDateTime.now()); // Set the date
                    notification.setVineId(vine.getId()); // Set the vineId directly

                    System.out.println("VINE ID: " + vineId);
                    System.out.println("Received Notification: type: " + notification.getType() + " avatar: " + notification.getAvatar() + " isUnRead: " + notification.getIsUnRead() + " vineId: " + notification.getVineId());


                    int totalNotifications = notificationService.getNumberOfNotificationsByVine(vine);

                    // If the total exceeds the maximum limit, remove older notifications
                    if (totalNotifications > MAX_NOTIFICATIONS) {
                        notificationService.removeOldestNotificationsForVine(vine.getId(), MAX_NOTIFICATIONS);
                    }



                    notificationService.saveNotification(notification);

                    // send through websocket
                    JSONObject notificationJson = new JSONObject();
                    notificationJson.put("id", notification.getId());
                    notificationJson.put("type", notification.getType());
                    notificationJson.put("isUnRead", notification.getIsUnRead());
                    notificationJson.put("vineId", notification.getVineId());
                    notificationJson.put("description", notification.getDescription());
                    notificationJson.put("date", notification.getDate());
                    this.template.convertAndSend("/topic/notification", notificationJson.toString());
                }

                break;
            case "temperature":
                
                int vineId2 = params.getInt("id");
                double value2 = params.getDouble("value");
                String time = params.getString("date");
                String day = params.getString("day");

                Vine vine2 = vineService.getVineById(vineId2);
                LocalDateTime date2 = LocalDateTime.now();

                Track track2 = new Track(type, date2, value2, vine2, time, day);

                List<Track> allTracks = trackService.getAllTracks();
                allTracks.removeIf(trackid -> trackid.getVine().getId() != vineId2);
                allTracks.removeIf(tractype -> !tractype.getType().equals("temperature"));

                boolean exists = false;

                for (Track tr : allTracks) {
                    if (tr.getDay().equals(day) && tr.getTime().equals(time)) {
                        exists = true;
                        break;
                    }
                }

                if (!exists){
                    this.template.convertAndSend("/topic/update", message);
                    trackService.saveTrack(track2);
                    vine2.setTemperature(value2);
                    vineService.save(vine2);
                }

                break;
            case "weatherAlerts":
                int vineId3 = params.getInt("id");
                String value3 = params.getString("value");

                Vine vine3 = vineService.getVineById(vineId3);
                LocalDateTime date3 = LocalDateTime.now();

                Track track3 = new Track(type, date3, value3, vine3);

                List<Track> allTracks3 = trackService.getAllTracks();
                allTracks3.removeIf(trackid -> trackid.getVine().getId() != vineId3);
                allTracks3.removeIf(tractype -> !tractype.getType().equals("weatherAlerts"));

                boolean exists3 = false;
                for (Track tr : allTracks3) {
                    if (value3.equals(tr.getValString())) {
                        exists3 = true;
                        break;
                    }
                }

                if (!exists3) {
                    this.template.convertAndSend("/topic/update", message);
                    trackService.saveTrack(track3);
                    trackService.removeOldTracks("weatherAlerts", vineId3);

                    Map<String, List<String>> map = getStringListMap(value3);

                    for (String key : map.keySet()) {

                        if (!map.get(key).get(2).equals("'green'")) {

                            Boolean isUnRead = true;
                            Notification notification = new Notification();
                            // "weatherAlerts", "src/main/resources/static/images/rain.png", isUnRead, vine3
                            notification.setDescription(map.get(key).get(3).replaceAll("'", ""));
                            notification.setVine(vine3); // Set the vine
                            notification.setType("weatherAlerts"); // Set the type
                            notification.setAvatar("src/main/resources/static/images/rain.png"); // Set the avatar
                            notification.setIsUnRead(isUnRead); // Set the isUnRead
                            notification.setDate(LocalDateTime.now()); // Set the date
                            notification.setVineId(vine3.getId()); // Set the vineId directly



                            int totalNotifications;
                            totalNotifications = notificationService.getNumberOfNotificationsByVine(vine3);

                            // If the total exceeds the maximum limit, remove older notifications
                            if (totalNotifications > MAX_NOTIFICATIONS) {
                                notificationService.removeOldestNotificationsForVine(vine3.getId(), MAX_NOTIFICATIONS);
                            }


                            notificationService.saveNotification(notification);

                            // send through websocket
                            JSONObject notificationJson = new JSONObject();
                            notificationJson.put("id", notification.getId());
                            notificationJson.put("type", notification.getType());
                            notificationJson.put("isUnRead", notification.getIsUnRead());
                            notificationJson.put("vineId", notification.getVineId());
                            notificationJson.put("description", notification.getDescription());
                            notificationJson.put("date", notification.getDate());
                            this.template.convertAndSend("/topic/notification", notificationJson.toString());
                        }
                    }

                }
                break;
            case "nutrients":

                int vineId4 = params.getInt("id");
                Vine vine4 = vineService.getVineById(vineId4);
                JSONObject nutrientValues = params.getJSONObject("value");
                Double N = nutrientValues.getDouble("Nitrogen");
                Double Ph = nutrientValues.getDouble("Phosphorus");
                Double K = nutrientValues.getDouble("Potassium");
                Double Ca = nutrientValues.getDouble("Calcium");
                Double Mg = nutrientValues.getDouble("Magnesium");
                Double Cl = nutrientValues.getDouble("Chloride");

                Nutrient nutrient = new Nutrient(vine4,N,Ph,K,Ca,Mg,Cl);
                this.template.convertAndSend("/topic/update", message);
                nutrientService.saveNutrient(nutrient);
                break;
            default:
                throw new IllegalStateException("Unexpected value: " + type);
        }
    }

    private static Map<String, List<String>> getStringListMap(String value3) {
        Map<String, List<String>> map = new HashMap<>();
        String val = StringUtils.substringBetween(value3, "{", "}");

        String[] keyValuePairs = val.split(",(?![^\\[]*\\])");


        for(String pair : keyValuePairs) {
            String[] keyValue = pair.split(": ");
            String listString = keyValue[1].substring(1, keyValue[1].length() - 1);
            String[] listItems = listString.split(", ");
            List<String> list = Arrays.asList(listItems);
            map.put(keyValue[0], list);
        }
        return map;
    }

    private static int weekNumber(LocalDate date) {
        return date.get(WeekFields.of(Locale.getDefault()).weekOfWeekBasedYear());
    }
}
