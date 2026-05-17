const readline = require('readline')
const fs = require('fs')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const CurrentYear = new Date().getFullYear()
const minYearAllowed = 1900
if (!fs.existsSync('users.txt')) { fs.writeFileSync('users.txt', ' Name | Born | Age | Decade | Status \n') }
const askName = () => {
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
                const decade = Math.floor(age / 10) * 10
                console.log(`hello ${name} , your age is excatly : ${age} , you are in the ${decade}s`)
                let status = ''
                if (age >= 18) { status = "adult" }
                else { (status = "young") }
                console.log(`you are : ${status} `)
                fs.appendFileSync('users.txt', `${name} | ${yearOfBirth} | ${age} | ${decade}s | ${status} \n `)
                console.log(` ${name} , succesfuly entered `)
                rl.question(`do you want enter another user ? press y for entered or any other key for exit `, (answer) => {
                    if (answer == 'y') {
                        askName()
                    }
                    else
                        rl.close()
                })
            })
        }
        askYear()
    })
}
askName()