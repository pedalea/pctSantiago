#' plumber 0.4.6
require("osmdata")
require("geojsonsf")
# Enable CORS -------------------------------------------------------------
#' CORS enabled for now. See docs of plumber
#' for disabling it for any endpoint we want in future
#' https://www.rplumber.io/docs/security.html#cross-origin-resource-sharing-cors
#' @filter cors
cors <- function(res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  plumber::forward()
}
# TODO: option to remove above CORS

#'
#' @param msg The message to echo
#' @get /api/helloworld
#' @get /api/helloworld/
function(msg="nothing given"){
  list(msg = paste0("The message is: '", msg, "'"))
}

#' @section TODO:
#' The plugger endpoint should not be there. Currently mapping React build to /
#' at assets causes the swagger endpoint to be 404. Support is limited.
#'
#' @get /__swagger__/
swagger <- function(req, res){
  fname <- system.file("swagger-ui/index.html", package = "plumber") # serve the swagger page.
  plumber::include_html(fname, res)
}

#' Tell plumber where our public facing directory is to SERVE.
#' No need to map / to the build or public index.html. This will do.
#'
#' @assets ./build /
list()

#' getbb
# wd is root of showcase
text_string <- "Santiago"
bb <- osmdata::getbb(text_string)
bb_json <- paste0("[", bb[2,1], ",", bb[1,1], ",",
                  bb[2,2], ",", bb[1,2], "]")
#' @get /api/getbb
uol_geojson <- function(res){
  res$headers$`Content-type` <- "application/json"
  res$body <- bb_json
  res
}

url <-  "https://github.com/pedalea/pctSantiago/releases/download/0.0.1/comunas.Rds"
path <- file.path(tempdir(), "comunas.Rds")
if(!exists(path))
   utils::download.file(url, path)
comunas <- readRDS(path)
comunas <- comunas[,c("COMUNA", "geometry")]
comunas <- geojsonsf::sf_geojson(comunas)
#' Get comunas
#' @get /api/comunas
comunas_geojson <- function(res){
  res$headers$`Content-type` <- "application/json"
  res$body <- comunas
  res
}

#' @get /deck
#' @get /deck/
#' @get /about
#' @get /about/
routesAllowed <- function(req, res){
  # cat(req$PATH_INFO)
  fname <- file.path("build", "index.html")
  plumber::include_html(fname, res)
}