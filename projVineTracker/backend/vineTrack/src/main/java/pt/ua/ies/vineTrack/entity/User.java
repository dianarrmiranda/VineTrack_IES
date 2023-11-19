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
    private String username;
    private String email;
    private String password;
    private String role;

    private String salt;
    private String token;


    public Integer getId(){
        return id;
    }

    public String getUsername(){
        return username;
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

    public String getSalt(){
        return salt;
    }

    public String getToken(){
        return token;
    }

    public void setId(Integer id){
        this.id = id;
    }

    public void setUsername(String name){
        this.name = name;
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

    public void setSalt(String salt){
        this.salt=salt;
    }

    public void setToken(String token){
        this.token=token;
    }

}
