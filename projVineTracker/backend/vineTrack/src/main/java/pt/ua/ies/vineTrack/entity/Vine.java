package pt.ua.ies.vineTrack.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "vine")
public class Vine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;
    private String description;
    private String date;
    @Column(nullable = false)
    private String location;
    @Column(nullable = false)
    private String image;
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "vine_grape", 
    joinColumns = @JoinColumn(name = "vine_id", referencedColumnName = "id"),
    inverseJoinColumns = @JoinColumn(name = "grape_id", referencedColumnName = "id"))
    private List<Grape> typeGrap;
    @ManyToMany(mappedBy = "vines")
    private List<User> users;


    public Integer getId(){
        return id;
    }

    public String getName(){
        return name;
    }

    public String getDescription(){
        return description;
    }

    public String getDate(){
        return date;
    }

    public String getLocation(){
        return location;
    }

    public String getImage(){
        return image;
    }

    public List<Grape> getTypeGrap(){
        return typeGrap;
    }

    public List<User> getUsers(){
        return users;
    }

    public void setId(Integer id){
        this.id = id;
    }

    public void setName(String name){
        this.name = name;
    }

    public void setDescription(String description){
        this.description = description;
    }

    public void setDate(String date){
        this.date = date;
    }

    public void setLocation(String location){
        this.location = location;
    }

    public void setImage(String image){
        this.image = image;
    }

    public void setTypeGrap(List<Grape> typeGrap){
        this.typeGrap = typeGrap;
    }

    public void setUsers(List<User> users){
        this.users = users;
    }



    



}