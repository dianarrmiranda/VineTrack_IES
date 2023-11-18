package pt.ua.ies.vineTrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pt.ua.ies.vineTrack.service.UserService;
import pt.ua.ies.vineTrack.entity.User;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping(path = "/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping(path = "/register")
    public User registerUser(@RequestBody User user){
        return userService.save(user);
    }

    @GetMapping(path = "/{id}")
    public User viewUser(@PathVariable Integer id){
        return userService.getUserById(id);
    }

    @GetMapping(path = "/all")
    public List<User> viewAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping(path = "/login/{email}/{password}")
    public User loginUser(@PathVariable String email, @PathVariable String password){
        User user = userService.getUserByEmail(email);
        if(user.getPassword().equals(password)){
            return user;
        }
        return null;
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
