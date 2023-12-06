package pt.ua.ies.vineTrack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pt.ua.ies.vineTrack.entity.Vine;
import pt.ua.ies.vineTrack.repository.NotificationRepo;
import pt.ua.ies.vineTrack.entity.Notification;


import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepo notificationRepo;

    @Autowired
    private VineService vineService;

    public List<Notification> getAllNotifications(){
        return notificationRepo.findAll();
    }

    public Notification saveNotification(Notification notification){
        return notificationRepo.save(notification);
    }

    public List<Notification> getNotificationsByVine(Vine vine){
        return notificationRepo.getNotificationsByVine(vine);
    }

    public String deleteNotificationById(Integer id){
        notificationRepo.deleteById(id);
        return "Notification removed! "+id;
    }

    public Notification getNotificationById(Integer id){
        return notificationRepo.findById(id).orElseThrow();
    }

    public int getNumberOfNotificationsByVine(Vine vine){
        return notificationRepo.getNotificationsByVine(vine).size();
    }

    public void removeOldestNotificationsForVine(Integer vineId, Integer numberOfNotificationsToKeep){
        List<Notification> notifications = notificationRepo.getNotificationsByVine(vineService.getVineById(vineId));
        int numberOfNotifications = notifications.size();
        if(numberOfNotifications > numberOfNotificationsToKeep){
            for(int i = 0; i < numberOfNotifications - numberOfNotificationsToKeep; i++){
                notificationRepo.deleteById(notifications.get(i).getId());
            }
        }
    }

    public List<Notification> getNotificationsByVineId(Integer vineId){
        return notificationRepo.getNotificationsByVine(vineService.getVineById(vineId));
    }

    public void deleteNotifications(List<Notification> notificationsToRemove) {
        for(Notification notification : notificationsToRemove){
            notificationRepo.deleteById(notification.getId());
        }
    }
}