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

import pt.ua.ies.vineTrack.service.UserService;
import pt.ua.ies.vineTrack.entity.User;

import org.json.JSONObject;
import java.util.List;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Base64.Encoder;


@CrossOrigin("*")
@RestController
@RequestMapping(path = "/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping(path = "/register")
    public @ResponseBody String registerUser(@RequestParam String username, @RequestParam String name, @RequestParam String email, @RequestParam String password, @RequestParam String role){
        if (userService.getUserByEmail(email) != null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already in use!");
        if (userService.getUserByUsername(username) != null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already in use!");

        try{
            User user = new User();
            user.setUsername(username);
            user.setName(name);
            user.setEmail(email);
            user.setPassword(password);
            user.setRole(role);
            

            Encoder encoder = Base64.getUrlEncoder().withoutPadding();
            //Generate token
            SecureRandom random2 = new SecureRandom();
            byte bytes[] = new byte[64];
            random2.nextBytes(bytes);
            String tokenString = encoder.encodeToString(bytes);
            user.setToken(tokenString);

            userService.save(user);

            JSONObject json = new JSONObject();
            json.put("id", user.getId());
            json.put("username", user.getUsername());
            json.put("name", user.getName());
            json.put("email", user.getEmail());
            json.put("role", user.getRole());
            json.put("token", user.getToken());

            return json.toString(1);
        }catch(Exception e){
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal processing error!");        
        }
        
    }

    @GetMapping(path = "/view")
    public @ResponseBody String viewUser(@RequestParam Integer id, @RequestParam String token){
        User user;

        try {
            user = userService.getUserById(id);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal processing error!");
        }

        if (user == null)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "User id has no account associated!");

        if (!user.getToken().equals(token))
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "User token is incorrect!");

        JSONObject json = new JSONObject();
        json.put("id", user.getId());
        json.put("username", user.getUsername());
        json.put("name", user.getName());
        json.put("email", user.getEmail());
        json.put("role", user.getRole());
        json.put("token", user.getToken());

        return json.toString(1);
    }

    @GetMapping(path = "/all")
    public List<User> viewAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping(path = "/username")
    public @ResponseBody String getUserByUsername(@RequestParam String username){
        try {

            User user = userService.getUserByUsername(username);
            if (user == null)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found!");

            JSONObject json = new JSONObject();
            json.put("id", user.getId());
            json.put("username", user.getUsername());

            return json.toString(1);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found!");
        }
    }

    @GetMapping(path = "/email")
    public @ResponseBody String getUserByEmail(@RequestParam String email){
        try {

            User user = userService.getUserByEmail(email);
            if (user == null)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found!");

            JSONObject json = new JSONObject();
            json.put("id", user.getId());
            json.put("email", user.getEmail());

            return json.toString(1);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found!");
        }
    }

    @GetMapping(path = "/login")
    public @ResponseBody String loginUser(@RequestParam String email, @RequestParam String password){
        User user;

        try {
            user = userService.getUserByEmail(email);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal processing error!");
        }

        if (user == null)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "User email has no account associated!");

        if (!user.getPassword().equals(password))
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "User password is incorrect!");

        
        
        Encoder encoder = Base64.getUrlEncoder().withoutPadding();

        SecureRandom rand = new SecureRandom();
        byte bytes[] = new byte[64];
        rand.nextBytes(bytes);

        user.setToken(encoder.encodeToString(bytes));
        userService.save(user);

        JSONObject json = new JSONObject();
        json.put("id", user.getId());
        json.put("username", user.getUsername());
        json.put("name", user.getName());
        json.put("email", user.getEmail());
        json.put("role", user.getRole());
        json.put("token", user.getToken());

        return json.toString(1); 
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
