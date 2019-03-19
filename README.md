
<!-- README.md is generated from README.Rmd. Please edit that file -->

# pctSantiago

## Introduction

The goal of pctSantiago is to create a proof-of-concept or prototype of
a ‘Pedalea’ web application to help prioritise active transport policies
and investment where they are most urgently needed. The starting point
is the Propensity to Cycle Tool web app and research project hosted at
<http://www.pct.bike/>

In terms of project workflow, the simplest approach is to push
everything into this README.Rmd file, with specific scripts going
directly into the repo’s route directory (this is not an R package, yet,
so no need for an R folder) and data going in the releases.

In terms of software, we will use the following packages:

``` r
# install.packages("remotes")
pkgs_cran = c(
  "sf" # spatial package
)
remotes::install_cran(pkgs_cran)
#> Skipping install of 'sf' from a cran remote, the SHA1 (0.7-3) has not changed since last install.
#>   Use `force = TRUE` to force installation
pkgs_github = c(
  "ropensci/stplanr",
  "ITSLeeds/pct",
  "GIScience/openrouteservice-r"
)
remotes::install_github(pkgs_github)
#> Skipping install of 'stplanr' from a github remote, the SHA1 (80677435) has not changed since last install.
#>   Use `force = TRUE` to force installation
#> Skipping install of 'pct' from a github remote, the SHA1 (6d70d0b1) has not changed since last install.
#>   Use `force = TRUE` to force installation
#> Skipping install of 'openrouteservice' from a github remote, the SHA1 (87a03ddd) has not changed since last install.
#>   Use `force = TRUE` to force installation
```

## Input data

## Desire line analysis

## Route generation and analysis

## Cycling uptake

## Route networks and recommendations

This section aims to show how recommendations can be generated.
