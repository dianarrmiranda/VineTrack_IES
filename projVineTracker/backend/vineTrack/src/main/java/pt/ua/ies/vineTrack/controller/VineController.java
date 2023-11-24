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
import pt.ua.ies.vineTrack.entity.Vine;
import pt.ua.ies.vineTrack.service.VineService;

@CrossOrigin("*")
@RestController
@RequestMapping(path = "/vine")
public class VineController {
    @Autowired
    private VineService vineService;

    @GetMapping(path = "/all")
    public ResponseEntity<List<Vine>> getAllVines(){
        try {
            return ResponseEntity.ok(vineService.getAllVines());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

    }

    @PostMapping(path = "/add")
    public ResponseEntity<Vine> addVine(@Valid @RequestBody Vine vine){
        return ResponseEntity.ok(vineService.save(vine));

    }


}
