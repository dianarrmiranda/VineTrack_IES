package pt.ua.ies.vineTrack.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "track")
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String type;
    private LocalDateTime date;
    private String time = "00:00:00";
    private String day = "00/00/0000";
    @Column(columnDefinition = "VARCHAR(1000)")
    private String valString = ""; 
    private double value;
    
    @ManyToOne
    @JoinColumn(name = "vine_id", referencedColumnName = "id")
    private Vine vine;

    public Track() {
    }

    public Track(String type, LocalDateTime date, double value, Vine vine) {
        this.type = type;
        this.date = date;
        this.value = value;
        this.vine = vine;
    }

    public Track(String type, LocalDateTime date,  String value, Vine vine) {
        this.type = type;
        this.date = date;
        this.valString = value;
        this.value = 0.0;
        this.vine = vine;
    }

    public Track(String type, LocalDateTime date, double value, Vine vine, String time, String day) {
        this.type = type;
        this.date = date;
        this.time = time;
        this.day = day;
        this.value = value;
        this.vine = vine;   
    }

    public Integer getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public double getValue() {
        return value;
    }

    public Vine getVine() {
        return vine;
    }

    public String getTime() {
        return time;
    }

    public String getDay() {
        return day;
    }

    public String getValString() {
        return valString;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public void setVine(Vine vine) {
        this.vine = vine;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public void setValString(String valString) {
        this.valString = valString;
    }
}
