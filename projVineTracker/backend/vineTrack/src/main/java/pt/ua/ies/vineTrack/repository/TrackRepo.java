package pt.ua.ies.vineTrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pt.ua.ies.vineTrack.entity.Track;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TrackRepo extends JpaRepository<Track, Integer> {
    @Query("SELECT DISTINCT t.vine.id FROM Track t")
    List<Integer> getVinesIds();

    // get all tracks for a vine
    @Query("SELECT t FROM Track t WHERE t.vine.id = ?1")
    List<Track> getTracksByVineId(Integer vineId);

    // get last moisture track date for a vine
    @Query("SELECT t FROM Track t WHERE t.vine.id = ?1 AND t.type = 'moisture' ORDER BY t.date DESC")
    List<Track> getLastMoistureTrackByVineId(Integer vineId);

    List<Track> findAllByTypeOrderByDateAsc(String type);
}
