package pt.ua.ies.vineTrack.message_broker;

import org.json.JSONObject;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import pt.ua.ies.vineTrack.entity.Track;
import pt.ua.ies.vineTrack.entity.Vine;
import pt.ua.ies.vineTrack.service.TrackService;
import pt.ua.ies.vineTrack.service.VineService;

import java.time.LocalDateTime;

@Component
public class RabbitmqHandler {
    //@Autowired
    //private SimpMessagingTemplate template;
    @Autowired
    private VineService vineService;

    @Autowired
    private TrackService trackService;

    @RabbitListener(queues = Config.QUEUE_NAME)
    public void receiveMessage(String message) {
        System.out.println("Received <" + message + ">");
        //this.template.convertAndSend("/topic/update", message);
        JSONObject params = new JSONObject(message);
        String type = params.getString("sensor");

        switch (type) {
            case "moisture":
                int vineId = params.getInt("id");
                double value = params.getDouble("value");

                // store the track in the database
                Vine vine = vineService.getVineById(vineId);
                LocalDateTime date = LocalDateTime.now();
                Track track = new Track(type, date, value, vine);

                trackService.saveTrack(track);
                break;
            default:
                break;
        }
    }
}
