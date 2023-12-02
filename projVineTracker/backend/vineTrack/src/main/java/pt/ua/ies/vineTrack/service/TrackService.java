package pt.ua.ies.vineTrack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

    public String deleteTrackById(Integer id){
        trackRepo.deleteById(id);
        return "Track removed! "+id;
    }

    public Track saveTrack(Track track){
        return trackRepo.save(track);
    }

    public int getTracksCount(){
        return trackRepo.findAll().size();
    }

    public void removeOldTracks(String type) {
        List<Track> tracks = trackRepo.findAllByTypeOrderByDateAsc(type);
        while (tracks.size() > 10) {
            trackRepo.delete(tracks.get(0));
            tracks.remove(0);
        }
    }

    // get last moisture track date for a vine
public List<Track> getLastMoistureTrackByVineId(Integer vineId){
        return trackRepo.getLastMoistureTrackByVineId(vineId);
    }
}
