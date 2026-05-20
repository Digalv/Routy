package com.rotepet.common;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class CityRegistry {
    private final Map<String, City> cityMap;

    public CityRegistry(ObjectMapper objectMapper) throws IOException {
        var resource = new ClassPathResource("cities.json");
        List<City> cities = objectMapper.readValue(
                resource.getInputStream(),
                new TypeReference<List<City>>() {
                }
        );

        this.cityMap = cities.stream()
                .filter(c -> c.id() != null)
                .collect(Collectors.toMap(
                        city -> city.id().toLowerCase(),
                        city -> city,
                        (existing, replacement) -> existing
                ));
    }

    public City getCity(String cityId) {
        return cityMap.get(cityId.toLowerCase());
    }

    public java.util.Collection<City> getAllCities() {
        return cityMap.values();
    }
}
