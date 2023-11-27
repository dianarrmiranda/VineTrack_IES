package pt.ua.ies.vineTrack.entity;

import java.sql.Date;
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
    @Column(nullable = false)
    private Double size;
    private Date date;
    @Column(nullable = false)
    private String location;
    private String image;

    String phase;
    int temperature;

    @ManyToMany()
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

    public Double getSize(){
        return size;
    }

    public Date getDate(){
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

    public void setSize(Double size){
        this.size = size;
    }

    public void setDate(Date date){
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

    public String getPhase() {
        return phase;
    }

    public void setPhase(String phase) {
        this.phase = phase;
    }

    public int getTemperature() {
        return temperature;
    }

    public void setTemperature(int temperature) {
        this.temperature = temperature;
    }


    @Override
    public String toString() {
        return "Vine [id=" + id + ", name=" + name + ", size=" + size + ", date=" + date + ", location="
                + location + ", image=" + image + ", typeGrap=" + typeGrap + ", users=" + users + "]";
    }
}
