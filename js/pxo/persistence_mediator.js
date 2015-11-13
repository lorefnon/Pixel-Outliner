import fs from 'fs'

class PersistenceMediator {

    fetch(filename) {
	return JSON.parse(fs.readFileSync(filename))
    }

    save(filename, content) {
	fs.writeFileSync(filename, content)
    }

}

export default PersistenceMediator
