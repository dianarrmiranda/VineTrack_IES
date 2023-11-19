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
}
