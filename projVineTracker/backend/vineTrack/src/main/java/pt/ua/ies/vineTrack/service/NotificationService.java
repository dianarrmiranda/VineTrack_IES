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

    public List<Notification> getAllNotifications(){
        return notificationRepo.findAll();
    }

    public Notification saveNotification(Notification notification){
        return notificationRepo.save(notification);
    }

    public List<Notification> getNotificationsByUserId(Integer userId){
        List<Notification> notifications = notificationService.getAllNotifications();
        notifications.removeIf(notification -> !notification.getUser().getId().equals(userId));
        return notifications;
    }
}