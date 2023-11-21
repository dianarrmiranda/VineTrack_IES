package pt.ua.ies.vineTrack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pt.ua.ies.vineTrack.entity.Grape;
import pt.ua.ies.vineTrack.repository.GrapeRepo;

@Service
public class GrapeService {

    @Autowired
    private GrapeRepo grapeRepo;

    public Grape save(Grape grape){
        return grapeRepo.save(grape);
    }

    public String deleteGrapeById(Integer id){
        grapeRepo.deleteById(id);
        return "Grape removed! "+id;
    }

    public Grape updateGrape(Grape grape){
        Grape existing = grapeRepo.findById(grape.getId()).orElse(null);
        existing.setName(grape.getName());
        existing.setColor(grape.getColor());
        existing.setType(grape.getType());
    
        return grapeRepo.save(existing);
    }


    
}
