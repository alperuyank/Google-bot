const fs = require('fs');

module.exports = class File {
    read(path, encoding = 'utf-8') {
        try {
            return fs.readFileSync(path, {
                encoding: encoding
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async write(path, data) {

        try {
            await fs.writeFileSync(path, data, { encoding : 'utf-8'});
        }

        catch (error) {
            throw new Error(error);
        }
    }
    readJSON(path) {
        try {
            return JSON.parse(this.read(path));
        } catch (error) {
            throw new Error(error);
            
        }
    }
}

