# Aim: explore data from cellphone study
library(dplyr)

u = "https://datadryad.org/bitstream/handle/10255/dryad.180116/HW_20days_dataset.csv"
cell = readr::read_csv2(u)
summary(cell)

# cellagg = cell %>% 
#   group_by(X_w, Y_w, X_h, Y_h) %>% 
#   summarise(n = n())
cellagg = cell %>% 
  group_by(tower_h, tower_w) %>% 
  summarise(X_h = mean(X_h), Y_h = mean(Y_h), X_w = mean(X_w), Y_w = mean(Y_w), n = n())
hist(cellagg$n)
summary(cellagg$n)
cellagg_sub = cellagg %>% 
  filter(n > 50)
celld = stplanr::od_coords2line(odc = cellagg_sub[3:6], crs = 5361)
plot(celld)
mapview::mapview(celld)
