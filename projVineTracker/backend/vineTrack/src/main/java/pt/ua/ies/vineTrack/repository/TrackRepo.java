package pt.ua.ies.vineTrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pt.ua.ies.vineTrack.entity.Track;

@Repository
public interface TrackRepo extends JpaRepository<Track, Integer> {
}
