package pt.ua.ies.vineTrack.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import pt.ua.ies.vineTrack.entity.User;

@Repository
public interface UserRepo extends JpaRepository<User, Integer>{
    User findByEmail(String email);
    User findByName(String name);
    User findByRole(String role);
}
