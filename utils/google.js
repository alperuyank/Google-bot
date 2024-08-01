module.exports = class Google 

{
    constructor(API_KEY) {
        this.key = API_KEY;
        this.headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": API_KEY,
            "X-Goog-FieldMask": "*"
        }
    }
    
    async getPlaces(latitude, longitude, types) {
        return await this.fetchAPI("https://places.googleapis.com/v1/places:searchNearby","POST", JSON.stringify({
            "includedTypes": types,
            "maxResultCount": 20,
            "locationRestriction": {
                "circle": {
                    "center": {
                        "latitude": latitude,
                        "longitude": longitude
                    },
                    "radius": 50000
                }
            }
        })
        );
    }

    async fetchAPI(url, method, body = "", headers = this.headers) {
        let options = {
            'method': method,
            'headers': headers
        };

        if (method === "POST" && body.length > 0)
            options.body = body;
        try {
            const response = await fetch(url, options);

            if (response.ok)
                return response.json();
            return response.text();
        }
        catch (error) {
            throw new Error(error);
        }
    }
}