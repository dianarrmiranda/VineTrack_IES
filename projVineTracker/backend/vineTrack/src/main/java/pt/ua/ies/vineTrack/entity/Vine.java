package pt.ua.ies.vineTrack.entity;

import java.sql.Date;
import java.util.List;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.*;

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
    @Column(nullable = false)
    private String city;
    private String image;

    private Double MaxWaterConsumption;

    String phase = "bud";
    private Double temperature = 0.0;

    @ManyToMany()
    @JoinTable(name = "vine_grape",
            joinColumns = @JoinColumn(name = "vine_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "grape_id", referencedColumnName = "id"))
    private List<Grape> typeGrap;

    @Column(nullable = false)
    @ManyToMany(mappedBy = "vines")
    private List<User> users;

    @ElementCollection
    private SortedMap<String, Double> avgTempsByDay = new TreeMap<>();
    @ElementCollection
    private SortedMap<String, Double> avgTempsByWeek = new TreeMap<>();
    @ElementCollection
    private SortedMap<String, Double> productionLiters = new TreeMap<>();   
    @ElementCollection
    private Map<String, Double> areaGrapes = new TreeMap<>();


    @Column(nullable = false)
    @ManyToMany(mappedBy = "vines")
    private List<Nutrient> Nutrients; //TODO: convém ver como os valores saem daqui

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

    public String getCity() {
        return city;
    }

    public SortedMap<String, Double> getAvgTempsByDay(){
        return avgTempsByDay;
    }

    public SortedMap<String, Double> getAvgTempsByWeek(){
        return avgTempsByWeek;
    }

    public SortedMap<String, Double> getProductionLiters() {
        return productionLiters;
    }

    public Map<String, Double> getAreaGrapes() {
        return areaGrapes;
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

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Double getMaxWaterConsumption() {
        return MaxWaterConsumption;
    }

    public void setMaxWaterConsumption(Double maxWaterConsumption) {
        MaxWaterConsumption = maxWaterConsumption;
    }
    
    public void setAvgTempsByDay(SortedMap<String, Double> avgTempsByDay){ this.avgTempsByDay = avgTempsByDay; }

    public void setAvgTempsByWeek(SortedMap<String, Double> avgTempsByWeek){ this.avgTempsByWeek = avgTempsByWeek; }

    public void setProductionLiters(SortedMap<String, Double> productionLiters) {
        this.productionLiters = productionLiters;
    }

    public void setAreaGrapes(Map<String, Double> areaGrapes) {
        this.areaGrapes = areaGrapes;
    }

    public List<Nutrient> getNutrientsList() {
        return Nutrients;
    }
         public void setNutrientsList(List<Nutrient> nutrients) {
         this.Nutrients = nutrients;
     }
    @Override
    public String toString() {
        return name;
    }

    // }

}