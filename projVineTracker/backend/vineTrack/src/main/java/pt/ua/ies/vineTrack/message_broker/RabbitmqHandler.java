package pt.ua.ies.vineTrack.message_broker;

import org.json.JSONObject;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import pt.ua.ies.vineTrack.entity.Track;
import pt.ua.ies.vineTrack.entity.Vine;
import pt.ua.ies.vineTrack.entity.Notification;
import pt.ua.ies.vineTrack.service.TrackService;
import pt.ua.ies.vineTrack.service.VineService;
import pt.ua.ies.vineTrack.service.NotificationService;

import org.apache.commons.lang3.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class RabbitmqHandler {
    @Autowired
    private SimpMessagingTemplate template; // for sending messages to the client through websocket
    @Autowired
    private VineService vineService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TrackService trackService;

    private static final int MAX_NOTIFICATIONS = 10;
    private static final double MAX_WATER_CONSUMPTION = 0.95; // max of 0.95L per m^2 per day

    @RabbitListener(queues = Config.QUEUE_NAME)
    public void receiveMessage(String message) {
        System.out.println("Received <" + message + ">");
        this.template.convertAndSend("/topic/update", message);
        JSONObject params = new JSONObject(message);
        String type = params.getString("sensor");

        switch (type) {
            case "moisture":
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

                    // check if water consumption is above the limit
                    double vineSize = vine.getSize();
                    double waterConsumptionLimit = vine.getMaxWaterConsumption();

                    // if water consumption is above the limit, send notification
                    if (waterConsumption > waterConsumptionLimit) {
                        Boolean isUnRead = true;
                        Notification notification = new Notification();
                        notification.setDescription("Water consumption is above the limit. Please check the vine " + vine.getName() + ".");
                        notification.setVine(vine); // Set the vine
                        notification.setType("waterConsumption"); // Set the type
                        notification.setAvatar("/public/assets/images/notifications/waterConsumption.png"); // Set the avatar
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
                        notificationJson.put("avatar", notification.getAvatar());
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
                    notification.setAvatar("/public/assets/images/notifications/water.png"); // Set the avatar
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
                    notificationJson.put("avatar", notification.getAvatar());
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

                trackService.saveTrack(track2);
                
                vine2.setTemperature(value2);
                vineService.save(vine2);

                break;
            case "weatherAlerts":
                int vineId3 = params.getInt("id");
                String value3 = params.getString("value");

                Vine vine3 = vineService.getVineById(vineId3);
                LocalDateTime date3 = LocalDateTime.now();

                Track track3 = new Track(type, date3, value3, vine3);
                trackService.saveTrack(track3);
                trackService.removeOldTracks("weatherAlerts",vineId3);

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

                for (String key : map.keySet()) {

                    if (!map.get(key).get(2).equals("'green'")){

                        Boolean isUnRead = true;
                        Notification notification = new Notification();
                        // "weatherAlerts", "/assets/images/notifications/rain.png", isUnRead, vine3
                        notification.setDescription("Levels of the soil humidity are low.");
                        notification.setVine(vine3); // Set the vine
                        notification.setType("weatherAlerts"); // Set the type
                        notification.setAvatar("/public/assets/images/notifications/rain.png"); // Set the avatar
                        notification.setIsUnRead(isUnRead); // Set the isUnRead
                        notification.setVineId(vine3.getId()); // Set the vineId directly


                        notification.setDescription(key.replaceAll("'", "") + ": " + map.get(key).get(3).replaceAll("'", ""));

                        int totalNotifications = notificationService.getNumberOfNotificationsByVine(vine3);

                        // If the total exceeds the maximum limit, remove older notifications
                        if (totalNotifications > MAX_NOTIFICATIONS) {
                            notificationService.removeOldestNotificationsForVine(vine3.getId(), MAX_NOTIFICATIONS);
                        }

                        notificationService.saveNotification(notification);

                        // send through websocket
                        JSONObject notificationJson = new JSONObject();
                        notificationJson.put("id", notification.getId());
                        notificationJson.put("type", notification.getType());
                        notificationJson.put("avatar", notification.getAvatar());
                        notificationJson.put("isUnRead", notification.getIsUnRead());
                        notificationJson.put("vineId", notification.getVineId());
                        notificationJson.put("description", notification.getDescription());
                        notificationJson.put("date", notification.getDate());
                        this.template.convertAndSend("/topic/notification", notificationJson.toString());
                    }
                }

                break;
            default:
                break;

        
        }
    }
}
