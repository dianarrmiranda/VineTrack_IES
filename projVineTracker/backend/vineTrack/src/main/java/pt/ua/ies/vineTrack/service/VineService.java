package pt.ua.ies.vineTrack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pt.ua.ies.vineTrack.entity.Vine;
import pt.ua.ies.vineTrack.repository.VineRepo;

import java.util.List;

@Service
public class VineService {
    @Autowired
    private VineRepo vineRepo;

    public List<Vine> getAllVines(){
        return vineRepo.findAll();
    }
}
