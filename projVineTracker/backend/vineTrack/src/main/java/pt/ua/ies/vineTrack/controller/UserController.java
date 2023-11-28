package pt.ua.ies.vineTrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import pt.ua.ies.vineTrack.service.UserService;
import pt.ua.ies.vineTrack.entity.User;
import pt.ua.ies.vineTrack.entity.Notification;
import pt.ua.ies.vineTrack.service.NotificationService;
import pt.ua.ies.vineTrack.entity.Vine;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping(path = "/user")
@ResponseStatus(HttpStatus.OK)
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping(path = "/all")
    public ResponseEntity<List<User>> getAllUsers(){
        try {
            return ResponseEntity.ok(userService.getAllUsers());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(path = "/add")
    public ResponseEntity<User> addUser(@Valid @RequestBody User user){
        return ResponseEntity.ok(userService.save(user));
    }

    @GetMapping(path = "/view/{id}")
    public ResponseEntity<User> viewUser(@PathVariable Integer id){
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping(path = "/login/{email}/{password}")
    public ResponseEntity<User> loginUser(@PathVariable String email, @PathVariable String password){
        try {
            return ResponseEntity.ok(userService.loginUser(email, password));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(path = "/email/{email}")
    public ResponseEntity<User> viewUser(@PathVariable String email){
        try {
            return ResponseEntity.ok(userService.getUserByEmail(email));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(path = "/notifications/{userId}")
    // get all notifications from a vine
    public List<Notification> getNotificationsByUserId(@PathVariable Integer userId){
        User user = userService.getUserById(userId);
        List<Vine> vines = userService.getVinesByUser(user);
        List<Notification> notifications = new ArrayList<>();
        for (Vine vine : vines) {
                notifications.addAll(notificationService.getNotificationsByVine(vine));
        }
        System.out.println(notifications);
        // invert the list
        List<Notification> invertedNotifications = new ArrayList<>();
        for (int i = notifications.size() - 1; i >= 0; i--) {
            invertedNotifications.add(notifications.get(i));
        }
        return invertedNotifications;
    }



    @PutMapping(path = "/update")
    public User updateUser(@RequestBody User user){
        return userService.updateUser(user);
    }

    @DeleteMapping(path = "/delete/{id}")
    public String deleteUser(@PathVariable Integer id){
        return userService.deleteUserById(id);
    }
}
