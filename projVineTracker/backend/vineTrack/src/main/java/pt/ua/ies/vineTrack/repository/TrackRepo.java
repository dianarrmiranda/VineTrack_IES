package pt.ua.ies.vineTrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pt.ua.ies.vineTrack.entity.Track;
import pt.ua.ies.vineTrack.entity.Vine;

import java.util.List;

@Repository
public interface TrackRepo extends JpaRepository<Track, Integer> {
    List<Track> findByVine(Vine vine);
}
