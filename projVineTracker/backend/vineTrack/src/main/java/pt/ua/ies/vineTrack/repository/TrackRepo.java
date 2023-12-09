package pt.ua.ies.vineTrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pt.ua.ies.vineTrack.entity.Track;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TrackRepo extends JpaRepository<Track, Integer> {
    @Query("SELECT DISTINCT t.vine.id FROM Track t")
    List<Integer> getVinesIds();

    // get all tracks for a vine
    @Query("SELECT t FROM Track t WHERE t.vine.id = ?1")
    List<Track> getTracksByVineId(Integer vineId);

    // last track for a vine
    @Query("SELECT t FROM Track t WHERE t.vine.id = ?1 ORDER BY t.date DESC")
    List<Track> getLastTrackByVineId(Integer vineId);

    // get last moisture track date for a vine
    @Query("SELECT t FROM Track t WHERE t.vine.id = ?1 AND t.type = 'moisture' ORDER BY t.date DESC")
    List<Track> getLastMoistureTrackByVineId(Integer vineId);

    List<Track> findAllByTypeOrderByDateAsc(String type);

    // get the waterConsumption tracks older than 7 days ago using column day
    @Query("SELECT t FROM Track t WHERE t.type = 'waterConsumption' AND STR_TO_DATE(t.day, '%Y-%m-%d') < :day")
    List<Track> getOldWaterConsumptionTracks(@Param("day") LocalDate day);
}
