package pt.ua.ies.vineTrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import pt.ua.ies.vineTrack.entity.Grape;
import pt.ua.ies.vineTrack.service.GrapeService;

@CrossOrigin("*")
@RestController
@RequestMapping(path = "/grapes")
public class GrapeController {

    @Autowired
    private GrapeService grapeService;

    @GetMapping()
    public ResponseEntity<List<Grape>> getAllGrapes(){
        try {
            return ResponseEntity.ok(grapeService.getAllGrapes());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

    }

    @PostMapping()
    public ResponseEntity<Grape> addGrape(@Valid @RequestBody Grape grape){
        return ResponseEntity.ok(grapeService.save(grape));
    }

    



    
}
