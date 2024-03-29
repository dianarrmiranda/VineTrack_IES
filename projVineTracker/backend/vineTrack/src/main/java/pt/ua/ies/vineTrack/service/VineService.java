package pt.ua.ies.vineTrack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pt.ua.ies.vineTrack.entity.Track;
import pt.ua.ies.vineTrack.entity.Vine;
import pt.ua.ies.vineTrack.repository.VineRepo;

import java.util.List;

@Service
public class VineService {
    @Autowired
    private VineRepo vineRepo;
    @Autowired
    private TrackService trackService;

    public List<Vine> getAllVines(){
        return vineRepo.findAll();
    }

    public Vine getVineById(Integer id){
        return vineRepo.findById(id).orElse(null);
    }

    public List<Track> getTracksByVineId(Integer vineId){
        List<Track> tracks = trackService.getAllTracks();
        tracks.removeIf(track -> !track.getVine().getId().equals(vineId));
        return tracks;
    }

    public List<Track> getAllTracks(){
        return trackService.getAllTracks();
    }

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
        existing.setSize(vine.getSize());
        existing.setImage(vine.getImage());
        existing.setLocation(vine.getLocation());
        existing.setTypeGrap(vine.getTypeGrap());
        existing.setUsers(vine.getUsers());
        existing.setMaxWaterConsumption(vine.getMaxWaterConsumption());
    
        return vineRepo.save(existing);
    }
}
