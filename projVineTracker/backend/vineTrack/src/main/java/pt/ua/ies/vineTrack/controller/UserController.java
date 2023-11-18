package pt.ua.ies.vineTrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import org.json.JSONObject;


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
    public @ResponseBody String registerUser(@RequestParam String username, @RequestParam String name, @RequestParam String email, @RequestParam String password, @RequestParam String role){
        try{
            User user = new User();

            if (userService.getUserByEmail(email) != null)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already in use!");
            if (userService.getUserByUserName(username) != null)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already in use!");

            user.setUserName(username);
            user.setName(name);
            user.setEmail(email);
            user.setPassword(password);
            user.setRole(role);
            userService.save(user);

            JSONObject json = new JSONObject();
            json.put("id", user.getId());
            json.put("username", user.getUserName());
            json.put("name", user.getName());
            json.put("email", user.getEmail());
            json.put("role", user.getRole());

            return json.toString(1);
        }catch(Exception e){
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal processing error!");        
        }
        
    }

    @GetMapping(path = "/{id}")
    public User viewUser(@PathVariable Integer id){
        return userService.getUserById(id);
    }

    @GetMapping(path = "/all")
    public List<User> viewAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping(path = "/username")
    public @ResponseBody User getUserByUsername(@RequestParam String username){
        try {

            User user = userService.getUserByUserName(username);

            
            return user;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found!");
        }
    }

    @GetMapping(path = "/login")
    public @ResponseBody String loginUser(@RequestParam String email, @RequestParam String password){
        User user = userService.getUserByEmail(email);
        System.out.println("user " + user);
        if(user.getPassword().equals(password)){
            System.out.println("user2 " + user);
            JSONObject json = new JSONObject();
            json.put("id", user.getId());
            json.put("username", user.getUserName());
            json.put("name", user.getName());
            json.put("email", user.getEmail());
            json.put("role", user.getRole());

            return json.toString(1);
        }

        return "Invalid credentials!";
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
