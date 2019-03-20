FROM rocker/r-base

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    # sf
    libproj-dev \ 
    libgdal-dev \ 
    libudunits2-dev \
    libgeos-dev \
    lbzip2 \
    libfftw3-dev \
    libgsl0-dev \
    libgl1-mesa-dev \
    libglu1-mesa-dev \
    libhdf4-alt-dev \
    libhdf5-dev \
    libjq-dev \
    liblwgeom-dev \
    libprotobuf-dev \
    libnetcdf-dev \
    libsqlite3-dev \
    libssl-dev \
    netcdf-bin \
    tk-dev \
    unixodbc-dev \
    libv8-dev \
    protobuf-compiler

ADD . /app

RUN apt-get install curl -y

RUN install2.r geojsonsf
RUN install2.r sf
RUN install2.r plumber
RUN install2.r devtools
RUN install2.r osmdata

RUN R -e 'devtools::install_github("ATFutures/geoplumber")'

EXPOSE 8000

ENTRYPOINT ["R", "-e", "setwd('/app'); plumber::plumb('R/plumber.R')$run(host='0.0.0.0', port=8000)"]
