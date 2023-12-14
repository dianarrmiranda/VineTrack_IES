package pt.ua.ies.vineTrack.dao;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Integer id;
    private Long expires;
    private String name;
    private String email;

    public JwtResponse(String accessToken, Integer id, Long expires, String name, String email) {
        this.token = accessToken;
        this.id = id;
        this.expires = expires;
        this.email = email;
        this.name = name;
    }
}