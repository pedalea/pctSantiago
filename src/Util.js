const getResultsFromGoogleMaps = (string, callback) => {

    if (typeof (string) === 'string' && typeof (callback) === 'function') {
        let fullURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
            string
            + "&key=" + process.env.REACT_APP_GOOGLE_MAP_KEY;
        console.log(process.env.REACT_APP_GOOGLE_MAP_KEY);
        fetch(fullURL)
            .then((response) => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                // Examine the text in the response
                response.json()
                    .then((data) => {
                        //rouch search results will do.
                        if (data.results.length === 0 || response.status === 'ZERO_RESULTS') {
                            callback(response.status);
                        } else {
                            callback(data.results[0].geometry.location)
                        }
                    });
            })
            .catch((err) => {
                console.log('Fetch Error :-S', err);
            });

    }
    //ignore
};

const fetchData = (url, callback) => {
    fetch(url) // [0] => "", [1] => roads and [2] => qfactor
        .then((response) => response.json())
        .then((responseJson) => {
            try {                
                // const json = JSON.parse(responseJson);
                // console.log(json);
                callback(responseJson)
            } catch (error) {
                console.error(error);
            }
        })
        .catch((error) => {
            console.error(error);
            callback(null, error)
        });

}

export {
    fetchData,
    getResultsFromGoogleMaps,
}