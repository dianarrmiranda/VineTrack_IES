package pt.ua.ies.vineTrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pt.ua.ies.vineTrack.entity.Nutrient;
import pt.ua.ies.vineTrack.entity.Track;
import pt.ua.ies.vineTrack.service.NutrientService;
import pt.ua.ies.vineTrack.service.TrackService;

@CrossOrigin("*")
@RestController
@RequestMapping(path = "api/nutrients")
public class NutrientController {

    @Autowired
    NutrientService nutrientService;

    @GetMapping()
    public ResponseEntity<List<Nutrient>> getAllNutrients(){
        try {
            return ResponseEntity.ok(nutrientService.getAllNutrients());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

    }

}
