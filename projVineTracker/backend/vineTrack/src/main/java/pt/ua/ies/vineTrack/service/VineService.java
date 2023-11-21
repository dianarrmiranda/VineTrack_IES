package pt.ua.ies.vineTrack.service;

import org.springframework.stereotype.Service;

import pt.ua.ies.vineTrack.entity.Vine;
import pt.ua.ies.vineTrack.repository.VineRepo;

@Service
public class VineService {

    private VineRepo vineRepo;

        public Vine save(Vine vine){
        return vineRepo.save(vine);
    }

    public String deleteVineById(Integer id){
        vineRepo.deleteById(id);
        return "Vine removed! "+id;
    }

    public Vine updateVine(Vine vine){
        Vine existing = vineRepo.findById(vine.getId()).orElse(null);
        existing.setName(vine.getName());
        existing.setDate(vine.getDate());
        existing.setDescription(vine.getDescription());
        existing.setImage(vine.getImage());
        existing.setLocation(vine.getLocation());
        existing.setTypeGrap(vine.getTypeGrap());
        existing.setUsers(vine.getUsers());
    
        return vineRepo.save(existing);
    }

    
}
