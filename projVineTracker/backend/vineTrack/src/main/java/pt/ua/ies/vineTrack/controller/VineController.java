package pt.ua.ies.vineTrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import pt.ua.ies.vineTrack.service.VineService;

@CrossOrigin("*")
@RestController
@RequestMapping(path = "/vines")
public class VineController {
    @Autowired
    private VineService vineService;

    //@PostMapping(path = "/add")

}
