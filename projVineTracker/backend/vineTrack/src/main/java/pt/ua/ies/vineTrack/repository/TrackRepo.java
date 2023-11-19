package pt.ua.ies.vineTrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.ua.ies.vineTrack.entity.Track;

public interface TrackRepo extends JpaRepository<Track, Integer> {
}
