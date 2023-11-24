package pt.ua.ies.vineTrack.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
<<<<<<< Updated upstream
    private String username;
=======
    @Column(nullable = false)
>>>>>>> Stashed changes
    private String email;
    private String password;
    @Column(nullable = false)
    private String role;

<<<<<<< Updated upstream
    private String salt;
    private String token;

=======
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "vines",
    joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
    inverseJoinColumns = @JoinColumn(name = "vine_id", referencedColumnName = "id"))
    private List<Vine> vines;
>>>>>>> Stashed changes

    public Integer getId(){
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail(){
        return email;
    }

    public String getPassword(){
        return password;
    }

    public String getRole(){
        return role;
    }

<<<<<<< Updated upstream
    public String getSalt(){
        return salt;
    }
=======
>>>>>>> Stashed changes

    public String getToken(){
        return token;
    }

    public void setId(Integer id){
        this.id = id;
    }

    public void setName(String name){
        this.name = name;
    }

    public void setEmail(String email){
        this.email=email;
    }

    public void setPassword(String password){
        this.password=password;
    }

    public void setRole(String role){
        this.role=role;
    }

<<<<<<< Updated upstream
    public void setSalt(String salt){
        this.salt=salt;
    }

    public void setToken(String token){
        this.token=token;
=======
    public void setVines(List<Vine> vines){
        this.vines=vines;
    }

    @Override
    public String toString() {
        return "User [id=" + id + ", name=" + name + ", email=" + email + ", role=" + role + ", vines=" + vines + "]";
>>>>>>> Stashed changes
    }

}
