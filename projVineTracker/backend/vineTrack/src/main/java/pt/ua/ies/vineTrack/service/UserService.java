package pt.ua.ies.vineTrack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pt.ua.ies.vineTrack.repository.UserRepo;
import pt.ua.ies.vineTrack.entity.User;

import pt.ua.ies.vineTrack.entity.Vine;
import pt.ua.ies.vineTrack.service.VineService;

import java.util.ArrayList;
import java.util.List;


@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private VineService vineService;
    
    public User save(User user){
        //Check if user already exists
        User existingUser = userRepo.findByEmail(user.getEmail());
        if(existingUser != null){
            return null;
        }
        return userRepo.save(user);
    }

    public User getUserById(Integer id){
        return userRepo.findById(id).orElse(null);
    }

    public List<User> getAllUsers(){
        return userRepo.findAll();
    }

    public User loginUser(String email, String password){
        User user = userRepo.findByEmail(email);
        if(user.getPassword().equals(password)){
            return user;
        }
        return null;
    }

    public User getUserByEmail(String email){
        return userRepo.findByEmail(email);
    }

    public String deleteUserById(Integer id){

        userRepo.deleteById(id);
        return "User removed! "+id;
    }

    public User updateUser(User user){
        User existingUser = userRepo.findById(user.getId()).orElse(null);
        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPassword(user.getPassword());
        existingUser.setRole(user.getRole());
        return userRepo.save(existingUser);
    }

    // return the vines of a user
    public List<Vine> getVinesByUser(User user){
        // get all the vines
        List<Vine> vines = vineService.getAllVines();
        List<Vine> userVines = new ArrayList<>();
        // get the vines of the user
        for (Vine vine : vines) {
            if(vine.getUsers().contains(user)){
                userVines.add(vine);
            }
        }

        return userVines;
    }
    
}
