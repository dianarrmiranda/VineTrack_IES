package pt.ua.ies.vineTrack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pt.ua.ies.vineTrack.repository.UserRepo;
import pt.ua.ies.vineTrack.entity.User;

import java.util.List;


@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    public User save(User user){
        return userRepo.save(user);
    }

    public User getUserByEmail(String email){
        return userRepo.findByEmail(email);
    }

    public User getUserByUserName(String username){
        return userRepo.findByUsername(username);
    }

    public User getUserById(Integer id){
        return userRepo.findById(id).orElse(null);
    }

    public User getUserByName(String name){
        return userRepo.findByName(name);
    }

    public List<User> getAllUsers(){
        return userRepo.findAll();
    }

    public String deleteUserById(Integer id){
        userRepo.deleteById(id);
        return "User removed! "+id;
    }

    public User getUserByRole(String role){
        return userRepo.findByRole(role);
    }

    public User updateUser(User user){
        User existingUser = userRepo.findById(user.getId()).orElse(null);
        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPassword(user.getPassword());
        existingUser.setRole(user.getRole());
        return userRepo.save(existingUser);
    }
    
}
