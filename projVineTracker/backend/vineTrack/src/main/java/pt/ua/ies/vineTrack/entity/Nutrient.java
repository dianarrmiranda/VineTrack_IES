package pt.ua.ies.vineTrack.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "nutrient")
public class Nutrient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Double Nitrogen;
    @Column(nullable = false)
    private Double Phosphorus;
    @Column(nullable = false)
    private Double Potassium;
    @Column(nullable = false)
    private Double Calcium;
    @Column(nullable = false)
    private Double Magnesium;
    @Column(nullable = false)
    private Double Chloride;

    private String phase="flower"; // os nutrientes só têm 2 fases: flower e fruit

    @ManyToOne()
    @JoinColumn(name = "vine_id", referencedColumnName = "id")
    private Vine vine;

    public Nutrient() {
    }

    public Nutrient(Vine vine,Double nitrogen, Double phosphorus, Double potassium, Double calcium, Double magnesium, Double chloride) {
        this.vine = vine;
        Nitrogen = nitrogen;
        Phosphorus = phosphorus;
        Potassium = potassium;
        Calcium = calcium;
        Magnesium = magnesium;
        Chloride = chloride;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Double getNitrogen() {
        return Nitrogen;
    }

    public void setNitrogen(Double nitrogen) {
        Nitrogen = nitrogen;
    }

    public Double getPhosphorus() {
        return Phosphorus;
    }

    public void setPhosphorus(Double phosphorus) {
        Phosphorus = phosphorus;
    }

    public Double getPotassium() {
        return Potassium;
    }

    public void setPotassium(Double potassium) {
        Potassium = potassium;
    }

    public Double getCalcium() {
        return Calcium;
    }

    public void setCalcium(Double calcium) {
        Calcium = calcium;
    }

    public Double getMagnesium() {
        return Magnesium;
    }

    public void setMagnesium(Double magnesium) {
        Magnesium = magnesium;
    }

    public Double getChloride() {
        return Chloride;
    }

    public void setChloride(Double chloride) {
        Chloride = chloride;
    }

    public Vine getVine() {
        return vine;
    }

    public void setVine(Vine vine) {
        this.vine = vine;
    }
}
