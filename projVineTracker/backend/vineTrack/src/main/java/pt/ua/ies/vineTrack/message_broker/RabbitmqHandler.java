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


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

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
                // only have 10 tracks per vine, remove the oldest
                trackService.removeOldTracks("moisture", vineId);

                // water consumption
                if (value - pastValue > 0) { //watered
                    double waterPercentage = (value - pastValue);
                    // Per m^2: 100% = 4L
                    double waterConsumption = waterPercentage * 4 / 100 * vine.getSize();

                    trackService.saveTrack(new Track("waterConsumption", date, waterConsumption, vine, t.toString(), d.toString()));
                    System.out.println("Water consumption: " + waterConsumption);

                    // only keep water consumption tracks that are less than 8 days old
                    trackService.removeOldWaterConsumptionTracks();
                }

                // water consumption
                if (value - pastValue > 0) { //watered
                    double waterPercentage = (value - pastValue);
                    // Per m^2: 100% = 4L
                    double waterConsumption = waterPercentage * 4 / 100 * vine.getSize();

                    trackService.saveTrack(new Track("waterConsumption", date, waterConsumption, vine, t.toString(), d.toString()));
                    System.out.println("Water consumption: " + waterConsumption);
                }

                // receive message, if the value is bellow expected save notification to the database
                // for now we will consider that the expected value is 40
                if (value < 40) {
                    Boolean isUnRead = true;
                    Notification notification = new Notification("moisture", "/public/assets/images/notifications/water.png", isUnRead, vine);
                    // set description to  'Levels of the soil humidity are low.'
                    notification.setDescription("Levels of the soil humidity are low.");

                    int totalNotifications = notificationService.getNumberOfNotificationsByVine(vine);

                    // If the total exceeds the maximum limit, remove older notifications
                    if (totalNotifications > MAX_NOTIFICATIONS) {
                        notificationService.removeOldestNotificationsForVine(vine.getId(), MAX_NOTIFICATIONS);
                    }


                    // send through websocket
                    JSONObject notificationJson = new JSONObject(notification);
                    this.template.convertAndSend("/topic/notification", notificationJson.toString());

                    notificationService.saveNotification(notification);
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
                trackService.removeOldTracks("temperature", vineId2);
                
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

                break;
            default:
                break;

        
        }
    }
}
