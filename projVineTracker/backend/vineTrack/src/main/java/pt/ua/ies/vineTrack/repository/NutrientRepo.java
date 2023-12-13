package pt.ua.ies.vineTrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pt.ua.ies.vineTrack.entity.Nutrient;
import pt.ua.ies.vineTrack.entity.Track;

import java.util.List;

@Repository
public interface NutrientRepo extends JpaRepository<Nutrient, Integer> {

    @Query("SELECT t FROM Nutrient t JOIN Vine v On t.vine.id= v.id WHERE t.id = ?1")
    List<Nutrient> getNutrientsByVineId(Integer vineId);
}
