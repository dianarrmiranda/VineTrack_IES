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
}
