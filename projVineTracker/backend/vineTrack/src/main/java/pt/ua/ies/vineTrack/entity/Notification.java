package pt.ua.ies.vineTrack.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String type;
    // an image fot the avatar
    private String avatar; // a path to the image
    private Boolean isUnRead;
    private LocalDateTime date;
    private String description;


    // one user can take many notifications (1:N)
    @ManyToOne
    @JoinColumn(name = "vine_id")
    private Vine vine;


    // constructors
    public Notification() {
    }

    public Notification(String type, String avatar, Boolean isUnRead, Vine vine) {
        this.type = type;
        this.avatar = avatar;
        this.isUnRead = isUnRead;
        this.vine = vine;
        this.date = LocalDateTime.now();
        this.description = "Default";
    }

    // getters and setters
    public Integer getId() {
        return id;
    }

    public String getType() {
            return type;
    }

    public String getAvatar() {
        return avatar;
    }

    public Boolean getIsUnRead() {
        return isUnRead;
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

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public void setIsUnRead(Boolean isUnRead) {
        this.isUnRead = isUnRead;
    }

    public void setVine(Vine vine) {
        this.vine = vine;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description=description;
    }

}
