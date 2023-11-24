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

import java.util.List;


@CrossOrigin("*")
@RestController
@RequestMapping(path = "/user")
public class UserController {
    @Autowired
    private UserService userService;

<<<<<<< Updated upstream
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

=======
    @GetMapping(path = "/all")
    public ResponseEntity<List<User>> getAllUsers(){
>>>>>>> Stashed changes
        try {
            return ResponseEntity.ok(userService.getAllUsers());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

<<<<<<< Updated upstream
    @GetMapping(path = "/all")
    public List<User> viewAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping(path = "/username")
    public @ResponseBody String getUserByUsername(@RequestParam String username){
=======
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
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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


=======
>>>>>>> Stashed changes
    @PutMapping(path = "/update")
    public User updateUser(@RequestBody User user){
        return userService.updateUser(user);
    }

    @DeleteMapping(path = "/delete/{id}")
    public String deleteUser(@PathVariable Integer id){
        return userService.deleteUserById(id);
    }
}
