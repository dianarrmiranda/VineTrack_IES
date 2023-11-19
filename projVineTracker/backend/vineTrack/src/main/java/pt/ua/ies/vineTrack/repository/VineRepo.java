package pt.ua.ies.vineTrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.ua.ies.vineTrack.entity.Vine;

public interface VineRepo extends JpaRepository<Vine, Integer> {
}
