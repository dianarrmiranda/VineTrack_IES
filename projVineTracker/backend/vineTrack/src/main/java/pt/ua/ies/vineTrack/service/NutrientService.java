package pt.ua.ies.vineTrack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pt.ua.ies.vineTrack.entity.Nutrient;
import pt.ua.ies.vineTrack.repository.NutrientRepo;

import java.util.List;

@Service
public class NutrientService {
    @Autowired
    private NutrientRepo nutrientRepo;

    public List<Nutrient> getAllNutrients(){
        return nutrientRepo.findAll();
    }

    public String deleteNutrientById(Integer id){
        nutrientRepo.deleteById(id);
        return "Nutrients removed! "+id;
    }

   public List<Nutrient> getNutrientsByVineId(Integer vineId){
        return nutrientRepo.getNutrientsByVineId(vineId);
    }

    public Nutrient saveNutrient(Nutrient nutrient){
        return nutrientRepo.save(nutrient);
    }
}
