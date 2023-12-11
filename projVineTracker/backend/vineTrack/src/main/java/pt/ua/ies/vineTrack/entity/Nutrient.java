package pt.ua.ies.vineTrack.entity;

import jakarta.persistence.*;

import java.util.List;

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

    @ManyToMany()
    @JoinColumn(name = "nutrients", referencedColumnName = "id")
    private List<Vine> vines;

    public Nutrient() {
    }

    public Nutrient(Double nitrogen, Double phosphorus, Double potassium, Double calcium, Double magnesium, Double chloride) {
        Nitrogen = nitrogen;
        Phosphorus = phosphorus;
        Potassium = potassium;
        Calcium = calcium;
        Magnesium = magnesium;
        Chloride = chloride;
    }

    public Nutrient(Double nitrogen, Double phosphorus, Double potassium, Double calcium, Double magnesium, Double chloride, String phase) {
        Nitrogen = nitrogen;
        Phosphorus = phosphorus;
        Potassium = potassium;
        Calcium = calcium;
        Magnesium = magnesium;
        Chloride = chloride;
        phase = phase;
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

    public List<Vine> getVines() {
        return vines;
    }

    public void setVines(List<Vine> vines) {
        this.vines = vines;
    }

    public void setChloride(Double chloride) {
        Chloride = chloride;
    }

    public String getPhase() {
        return phase;
    }

    public void setPhase(String phase) {
        phase = phase;
    }
}