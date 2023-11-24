package pt.ua.ies.vineTrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pt.ua.ies.vineTrack.entity.Vine;

import java.util.List;

@Repository
public interface VineRepo extends JpaRepository<Vine, Integer> {
}
