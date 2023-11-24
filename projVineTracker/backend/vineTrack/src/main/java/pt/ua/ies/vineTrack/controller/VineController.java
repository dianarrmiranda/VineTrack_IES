package pt.ua.ies.vineTrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pt.ua.ies.vineTrack.entity.Track;
import pt.ua.ies.vineTrack.entity.Vine;
import pt.ua.ies.vineTrack.service.VineService;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping(path = "/vine")
public class VineController {
    @Autowired
    private VineService vineService;

    @GetMapping(path = "/test")
    public List<Vine> getAllVines(){
        return vineService.getAllVines();
    }

    @GetMapping(path = "/test2/{vineId}")
    public List<Track> getTracksByVineId(@PathVariable Integer vineId){
        return vineService.getTracksByVineId(vineId);
    }

    @GetMapping(path = "/test3")
    public List<Track> getAllTracks(){
        return vineService.getAllTracks();
    }
}
