package pt.ua.ies.vineTrack.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pt.ua.ies.vineTrack.entity.Grape;
import pt.ua.ies.vineTrack.entity.Vine;
import pt.ua.ies.vineTrack.entity.User;
import pt.ua.ies.vineTrack.repository.VineRepo;

import java.util.ArrayList;
import java.util.List;

@Service
public class VineService {

    @Autowired
    private VineRepo vineRepo;
    @Autowired
    private GrapeService grapeRepo;
    @Autowired
    private UserService userRepo;

    public Vine save(Vine vine){
        if (vine.getTypeGrap() != null) {
            List<Grape> grapes = new ArrayList<>();
            for (Grape grape : vine.getTypeGrap()) {
                Grape existingGrape = grapeRepo.getGrapeById(grape.getId());
                if (existingGrape != null) {
                    grapes.add(existingGrape);
                } else {
                    grapeRepo.save(grape);
                }
            }
            vine.setTypeGrap(grapes);
        }
        List<User> users = new ArrayList<>();
        for (User user : vine.getUsers()) {
            User existingUser = userRepo.getUserById(user.getId());
            if (existingUser != null) {
                users.add(existingUser);
                if(existingUser.getVines() == null) {
                    existingUser.setVines(new ArrayList<>());
                }
                existingUser.getVines().add(vine);
            }
        }
        
        vine.setUsers(users);
        
        return vineRepo.save(vine);
    }


    public List<Vine> getAllVines(){
        return vineRepo.findAll();
    }

    public String deleteVineById(Integer id){
        vineRepo.deleteById(id);
        return "Vine removed! "+id;
    }

    public Vine updateVine(Vine vine){
        Vine existing = vineRepo.findById(vine.getId()).orElse(null);
        existing.setName(vine.getName());
        existing.setDate(vine.getDate());
        existing.setSize(vine.getSize());
        existing.setImage(vine.getImage());
        existing.setLocation(vine.getLocation());
        existing.setTypeGrap(vine.getTypeGrap());
        existing.setUsers(vine.getUsers());
    
        return vineRepo.save(existing);
    }

}
