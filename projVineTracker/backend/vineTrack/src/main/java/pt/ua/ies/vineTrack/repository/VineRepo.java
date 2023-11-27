package pt.ua.ies.vineTrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pt.ua.ies.vineTrack.entity.Vine;

@Repository
public interface VineRepo extends JpaRepository<Vine, Integer>{
    Vine findByName(String name);
    Vine findByLocation(String location);
    
} 
