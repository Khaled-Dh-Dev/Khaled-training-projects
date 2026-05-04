const readline = require('readline')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
rl.question('what is your name ? ', (name) => {
    rl.question('what is your birth year? ', (year) => {
        const age = 2026 - year
        console.log(`hello ${name} , your age is : ${age} , you are in the ${Math.floor(age / 10) * 10}s`)
        if (age >= 18) { console.log('you are adult') }
        else { console.log('you are young') }
        rl.close()
    })
})