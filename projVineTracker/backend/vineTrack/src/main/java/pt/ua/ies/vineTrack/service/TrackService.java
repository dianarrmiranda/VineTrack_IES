package pt.ua.ies.vineTrack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pt.ua.ies.vineTrack.entity.Vine;
import pt.ua.ies.vineTrack.repository.TrackRepo;
import pt.ua.ies.vineTrack.entity.Track;

import java.util.List;

@Service
public class TrackService {
    @Autowired
    private TrackRepo trackRepo;

    public List<Track> getAllTracks(){
        return trackRepo.findAll();
    }

    public Track saveTrack(Track track){
        return trackRepo.save(track);
    }
}
