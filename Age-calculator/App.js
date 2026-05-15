const readline = require('readline')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const CurrentYear = new Date().getFullYear()
const minYearAllowed = 1900
//const year = parseInt(CurrentYear)
rl.question('what is your name ? ', (name) => {
    const askYear = () => {
        rl.question('what is your birth year? ', (yearBirth) => {
            const yearOfBirth = parseInt(yearBirth)
            if (isNaN(yearOfBirth) || yearOfBirth > CurrentYear || yearOfBirth < minYearAllowed) {
                console.log(`
                hello ${name}
                [!] error: the !${yearBirth}! entered is invalid year of birth 
                 please make sure  between ${minYearAllowed} and ${CurrentYear} `)
                return askYear()
            }
            const age = CurrentYear - yearOfBirth
            console.log(`hello ${name} , your age is excatly : ${age} , you are in the ${Math.floor(age / 10) * 10}s`)
            if (age >= 18) { console.log('you are adult') }
            else { console.log('you are young') }
            rl.close()
        })
    }
    askYear()
})