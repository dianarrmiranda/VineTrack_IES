package pt.ua.ies.vineTrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pt.ua.ies.vineTrack.entity.Vine;
import pt.ua.ies.vineTrack.service.VineService;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping(path = "/vine")
public class VineController {
    @Autowired
    private VineService vineService;

    @GetMapping(path = "/test")
    public List<Vine> getAllVines(){
        return vineService.getAllVines();
    }
}
