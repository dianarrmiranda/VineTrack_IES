package pt.ua.ies.vineTrack.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import pt.ua.ies.vineTrack.dao.JwtResponse;
import pt.ua.ies.vineTrack.dao.request.LoginRequest;
import pt.ua.ies.vineTrack.dao.response.MessageResponse;
import pt.ua.ies.vineTrack.entity.User;
import pt.ua.ies.vineTrack.repository.UserRepo;
import pt.ua.ies.vineTrack.security.JwtUtils;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/authentication")
@Tag(name = "Authentication", description = "Operations for authentication")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepo userRepo;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    @Operation(summary = "Authenticate a client with an email and password")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully authenticated", content = @Content),
        @ApiResponse(responseCode = "401", description = "Invalid credentials", content = @Content),
    })
    public ResponseEntity<?> authenticateClient(@Valid @RequestBody LoginRequest loginRequest) {
        User user = userRepo.findByEmail(loginRequest.getEmail()).orElse(null);

        if (user == null) {
            return new ResponseEntity<>(new MessageResponse("Not found"), HttpStatus.UNAUTHORIZED);
        }

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        Long expires = jwtUtils.getDateFromJwtToken(jwt).getTime();

        User userDetails = (User) authentication.getPrincipal();

        return ResponseEntity
                .ok(new JwtResponse(jwt, userDetails.getId(), expires, userDetails.getName(), userDetails.getEmail()));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully registered", content = @Content),
        @ApiResponse(responseCode = "400", description = "E-mail is already in use", content = @Content),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        description = "User registration details",
        required = true,
        content = @Content(schema = @Schema(example = "{\"name\": \"Exemplo Ex\", \"email\": \"example@email.com\", \"password\": \"examplePassword\"}"))
    )
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        if (userRepo.existsByEmail(user.getEmail())) {

            return ResponseEntity.badRequest().body(new MessageResponse("E-mail is already in use"));
        }

       
        String unencryptedPassword = user.getPassword();
        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole("USER");
        userRepo.save(user);

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), unencryptedPassword));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        Long expires = jwtUtils.getDateFromJwtToken(jwt).getTime();

        User userDetails = (User) authentication.getPrincipal();

        return ResponseEntity
                .ok(new JwtResponse(jwt, userDetails.getId(), expires, userDetails.getName(), userDetails.getEmail()));
    }
}