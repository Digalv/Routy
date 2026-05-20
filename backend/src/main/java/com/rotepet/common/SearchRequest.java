package com.rotepet.common;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record SearchRequest(
        @NotBlank @Size(min = 2, max = 64) String from,
        @NotBlank @Size(min = 2, max = 64) String to,
        @FutureOrPresent LocalDate date,
        @Min(1) @Max(9) int passengers
) {}
