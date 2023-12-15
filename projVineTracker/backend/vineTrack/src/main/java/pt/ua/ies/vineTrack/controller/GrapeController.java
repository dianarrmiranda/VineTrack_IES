package pt.ua.ies.vineTrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.Valid;

import pt.ua.ies.vineTrack.entity.Grape;
import pt.ua.ies.vineTrack.service.GrapeService;

@CrossOrigin("*")
@RestController
@RequestMapping(path = "/api/grapes")
@Tag(name = "Grape", description = "Operations for grapes")
public class GrapeController {

    @Autowired
    private GrapeService grapeService;

    @GetMapping()
    @Operation(summary = "Get all grapes")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved"),
        @ApiResponse(responseCode = "404", description = "Not found", content = @Content),
    })
    public ResponseEntity<List<Grape>> getAllGrapes(){
        try {
            return ResponseEntity.ok(grapeService.getAllGrapes());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

    }

    @PostMapping()
    @Operation(summary = "Add a type of grape")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully added"),
        @ApiResponse(responseCode = "404", description = "Not found", content = @Content),
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        description = "Grape object to be added",
        required = true,
        content = @Content(schema = @Schema(example = "{\"name\": \"Example Grape\", \"type\": \"Example Type\"}"))
    )
    public ResponseEntity<Grape> addGrape(@Valid @RequestBody Grape grape){
        return ResponseEntity.ok(grapeService.save(grape));
    }

    



    
}
