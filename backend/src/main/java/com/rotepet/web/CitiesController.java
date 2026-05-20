package com.rotepet.web;

import com.rotepet.common.City;
import com.rotepet.common.CityRegistry;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/api")
public class CitiesController {

    private final CityRegistry cityRegistry;

    public CitiesController(CityRegistry cityRegistry) {
        this.cityRegistry = cityRegistry;
    }

    @GetMapping("/cities")
    public Collection<City> getCities() {
        return cityRegistry.getAllCities();
    }
}
