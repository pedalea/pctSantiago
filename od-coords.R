# with coordinates only
d = readr::read_delim("~/hd/data/raw/od/EOD2012_Stgo.csv", delim = ";")
names_include = grep("Zon|Coord|Mod", names(d))
d = d[names_include] %>% 
  filter(ZonaOrigen < 999, ZonaOrigen > 0, ZonaDestino < 999, ZonaDestino > 0) %>%
  filter(!is.na(OrigenCoordX))
round_to = function(x, to = 10) round(x / to) * to
d_agg_coord = d %>% 
  mutate_at(vars(contains("Coord")), round_to, 500) %>% 
  group_by(OrigenCoordX, OrigenCoordY, DestinoCoordX, DestinoCoordY) %>% 
  summarise(n = n()) %>% 
  filter(n > 5)
g = stplanr::mats2line(
  cbind(d_agg_coord$OrigenCoordX, d_agg_coord$OrigenCoordY),
  cbind(d_agg_coord$DestinoCoordX, d_agg_coord$DestinoCoordY)
)
sf::st_crs(g) = sf::st_crs(z)
od_agg_coord = sf::st_sf(data.frame(n = d_agg_coord$n), geometry = g)
mapview::mapview(od_agg_coord) # what CRS is this?