package pt.ua.ies.vineTrack.repository;

import org.springframework.stereotype.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import pt.ua.ies.vineTrack.entity.User;

import java.util.Optional;


@Repository
public interface UserRepo extends JpaRepository<User, Integer>{
    Optional<User>  findByEmail(String email);
    User findByName(String name);
    User findByRole(String role);
    Boolean existsByEmail(String email);

    
}
