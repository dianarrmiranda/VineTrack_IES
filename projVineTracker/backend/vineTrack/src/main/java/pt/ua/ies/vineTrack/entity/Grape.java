package pt.ua.ies.vineTrack.entity;


import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;


@Entity
@Table(name = "grape")
public class Grape {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String type;
    private String color;

    @ManyToMany(mappedBy = "typeGrap")
    private List<Vine> vine;

    public Integer getId(){
        return id;
    }

    public String getName(){
        return name;
    }

    public String getType(){
        return type;
    }

    public String getColor(){
        return color;
    }


    public void setId(Integer id){
        this.id = id;
    }

    public void setName(String name){
        this.name = name;
    }

    public void setType(String type){
        this.type = type;
    }

    public void setColor(String color){
        this.color = color;
    }

    @Override
    public String toString() {
        return "Grape [id=" + id + ", name=" + name + ", type=" + type + ", color=" + color + "]";
    }





    
}
