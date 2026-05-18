const readline = require('readline')
const fs = require('fs')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const CurrentYear = new Date().getFullYear()
const minYearAllowed = 1900
const mainMenu = () => {
    console.clear()
    console.log('\n--- Main Menu -----')
    console.log('1 : Add New User')
    console.log('2 : View All users')
    console.log('3 : exit')
    rl.question('what is your choice ? ', (choice) => {
        switch (choice) {
            case '1': askName()
                break
            case '2': 
    // 1. قراءة الملف
    const fileContent = fs.readFileSync('users.txt', 'utf8')    
    // 2. تقسيم محتوى الملف إلى مصفوفة من الأسطر (نقص عند كل سطر جديد)
    const lines = fileContent.trim().split('\n')
    console.log("\n-------------------------------------------------------------")    
    // 3. المرور على كل سطر لتنسيقه
    lines.forEach((line) => {
        // تفكيك السطر بناءً على الفاصل | وتنظيف الفراغات حول الكلمات
        const columns = line.split('|').map(item => item.trim())        
        // إذا كان السطر يحتوي على البيانات الـ 5 كاملة نقوم بطباعته بشكل منسق
        if (columns.length === 5) {
            const [name, born, age, decade, status] = columns            
            // استخدام الـ \t (Tab) ليعطي مسافات قفز ثابتة ومستقيمة تماماً بالترمينال
            console.log(`${name.padEnd(12)} | ${born.padEnd(6)} | ${age.padEnd(4)} | ${decade.padEnd(6)} | ${status}`)
        }
    })
    console.log("-------------------------------------------------------------\n")
    // 4. سؤال العودة للقائمة الرئيسية الخاص بك
    rl.question('press enter to return to Main Menu ', () => {
        mainMenu()
    })
    break
            case '3': rl.close()
                break
            default: console.log(' make choice number between 1 and 3')
                mainMenu()
                break;
        }
    })
}
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
                const askToContinue = () => {
                rl.question(`do you want enter another user ? press y for entered or enter for return to main menu `, (answer) => {
                    if (answer.toLowerCase () == 'y') {
                        askName()
                    }
                    else if (answer == '' ){
                        mainMenu()
                    }
                    else {
                        console.log('\n [!] Invalid choice ! press y or enter just')
                        askToContinue()
                    }
                })
            } 
            askToContinue()
            })
        }
        askYear()
    })
}
mainMenu()