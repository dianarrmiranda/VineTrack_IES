package pt.ua.ies.vineTrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pt.ua.ies.vineTrack.entity.Grape;

@Repository
public interface GrapeRepo extends JpaRepository<Grape, Integer>{
    Grape findByName(String name);
    Grape findByType(String type);
} 
