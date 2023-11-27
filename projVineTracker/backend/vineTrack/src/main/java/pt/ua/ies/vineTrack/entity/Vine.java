package pt.ua.ies.vineTrack.entity;

<<<<<<< HEAD
import java.sql.Date;
=======
>>>>>>> a03035a2 (Revert "5 registar dados básicos da vinha")
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

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
@JsonIdentityInfo(
 generator = ObjectIdGenerators.PropertyGenerator.class, 
 property = "id")
public class Vine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;
<<<<<<< HEAD
    private Double size;
    private Date date;
=======
    private String description;
    private String date;
>>>>>>> a03035a2 (Revert "5 registar dados básicos da vinha")
    @Column(nullable = false)
    private String location;
    @Column(nullable = false)
    private String image;

<<<<<<< HEAD
    @ManyToMany()
=======
    @ManyToMany(cascade = CascadeType.ALL)
>>>>>>> a03035a2 (Revert "5 registar dados básicos da vinha")
    @JoinTable(name = "vine_grape", 
    joinColumns = @JoinColumn(name = "vine_id", referencedColumnName = "id"),
    inverseJoinColumns = @JoinColumn(name = "grape_id", referencedColumnName = "id"))
    private List<Grape> typeGrap;
     
    @Column(nullable = false)
    @ManyToMany(mappedBy = "vines")
    private List<User> users;


    public Integer getId(){
        return id;
    }

    public String getName(){
        return name;
    }

<<<<<<< HEAD
    public Double getSize(){
        return size;
    }

    public Date getDate(){
=======
    public String getDescription(){
        return description;
    }

    public String getDate(){
>>>>>>> a03035a2 (Revert "5 registar dados básicos da vinha")
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

<<<<<<< HEAD
    public void setSize(Double size){
        this.size = size;
    }

    public void setDate(Date date){
=======
    public void setDescription(String description){
        this.description = description;
    }

    public void setDate(String date){
>>>>>>> a03035a2 (Revert "5 registar dados básicos da vinha")
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

    @Override
    public String toString() {
        return "Vine [id=" + id + ", name=" + name + ", description=" + description + ", date=" + date + ", location="
                + location + ", image=" + image + ", typeGrap=" + typeGrap + ", users=" + users + "]";
    }


    



}
