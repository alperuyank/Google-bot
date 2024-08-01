const File = require('./utils/file');
const Google = require('./utils/google');
const MathLab = require('./utils/math');
const check = (object) => {
    return object.maxLatitude &&
        object.minLatitude &&
        object.originX &&
        object.originY &&
        object.maxLongitude &&
        object.minLongitude &&
        object.radius &&
        object.name;
}


async function main() {

    const configPath = './config/credentials.json';
    const dir = './data/';
    const file = new File();
    const math = new MathLab();
    const config = await file.readJSON(configPath);

    const google = new Google(config.api.API_KEY);

    for (const index in config.locations) 
    {
        const area = config.locations[index];

        if (await !check(area)) 
        {

            continue;
        }

        let x = area.minLongitude, y = area.minLatitude;

        while (true) 
            {

            if (await math.isLongerThanRadius(x, y, area.originX, area.originY, area.radius)) 
            {
                x += 0.001;

                if (x >= area.maxLongitude) 
                {
                    x = area.minLongitude;
                    y += 0.01;
                }

                if (y >= area.maxLatitude)
                    return;

                console.log("********************Daire dışı alan " + x + ' ' + y +'*****************************');
                continue;
            }

            console.log("Aranan konum: "+ x + ' ' + y + '\n');

            const data = await google.getPlaces(y, x, config.types);
            console.log(Object.keys(data).length);
            if(Object.keys(data).length <1) 
            {
                x += 0.001;
                if (x >= area.maxLongitude) 
                {
                    x = area.minLongitude;
                    y += 0.001;
                }
    
                if (y >= area.maxLatitude)
                    return;
                continue;
            }
            const places = await data.places;
            console.log("Mekan sayısı " + places.length);
            for(let i = 0; i< places.length; i+=1)
            {
                await file.write(`${dir}${places[i].id}.json`, await JSON.stringify(places[i]));
                console.log(places[i].id);
                console.log(places[i]);
           }
        
            x += 0.001;
            if (x >= area.maxLongitude) 
            {
                x = area.minLongitude;
                y += 0.001;
            }

            if (y >= area.maxLatitude)
                return;
        }

    }
    console.log("İŞLEM BİTTİ H.O");
}

main();