package pt.ua.ies.vineTrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pt.ua.ies.vineTrack.entity.Track;
import pt.ua.ies.vineTrack.entity.Vine;
import pt.ua.ies.vineTrack.service.VineService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping(path = "/vine")
public class VineController {
    @Autowired
    private VineService vineService;

    @GetMapping(path = "/test")
    public Track getAllVines(){
        // Returns the last track
        List<Track> tracks = vineService.getTracksByVineId(1);
        return tracks.get(tracks.size() - 1);
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
