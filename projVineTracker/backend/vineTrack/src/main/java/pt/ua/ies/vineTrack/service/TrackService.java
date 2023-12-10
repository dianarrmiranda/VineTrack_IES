package pt.ua.ies.vineTrack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pt.ua.ies.vineTrack.repository.TrackRepo;
import pt.ua.ies.vineTrack.entity.Track;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

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

    public void removeOldTracks(String type, Integer id) {
        List<Track> tracks = trackRepo.findAllByTypeOrderByDateAsc(type);
        
        tracks.removeIf(track -> !Objects.equals(track.getVine().getId(), id));

        switch (type) {
            case "moisture" -> {
                while (tracks.size() > 10) {
                    trackRepo.delete(tracks.get(0));
                    tracks.remove(0);
                }
            }
            case "temperature" -> {
                while (tracks.size() > 24) {
                    trackRepo.delete(tracks.get(0));
                    tracks.remove(0);
                }
            }
            case "weatherAlerts" -> {
                while (tracks.size() > 1) {
                    trackRepo.delete(tracks.get(0));
                    tracks.remove(0);
                }
            }
        }

    }

    // get last moisture track date for a vine
    public List<Track> getLastMoistureTrackByVineId(Integer vineId){
        return trackRepo.getLastMoistureTrackByVineId(vineId);
    }

    // remove the waterConsumption tracks older than 7 days ago
    public void removeOldWaterConsumptionTracks() {
        // get last track's day
        List<Track> tracks = trackRepo.findAllByTypeOrderByDateAsc("waterConsumption");
        Track lastTrack = tracks.get(tracks.size() - 1);
        String lastTrackDay = lastTrack.getDay();
        LocalDate lastTrackDate = LocalDate.parse(lastTrackDay);

        // get the waterConsumption tracks older than 7 days ago using column day
        List<Track> oldWaterConsumptionTracks = trackRepo.getOldWaterConsumptionTracks(lastTrackDate.minusDays(7));
        trackRepo.deleteAll(oldWaterConsumptionTracks);
    }

    public List<Track> getLastTrackByVineId(Integer vineId) {
        return trackRepo.getLastTrackByVineId(vineId);
    }

    public List<Track> getTracksByVineId(Integer vineId) {
        return trackRepo.getTracksByVineId(vineId);
    }

    public List<Track> getWaterConsumptionWeekTracksByVineId(int vineId) {
        return trackRepo.getWaterConsumptionWeekTracksByVineId(vineId);
    }
}
