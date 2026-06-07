const readline = require('readline')
const fs = require('fs')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const CurrentYear = new Date().getFullYear()
const minYearAllowed = 1900
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const RESET = '\x1b[0m'
let results = []
const printSuccess = (message, details = {}) => {
    const time = new Date().toLocaleTimeString();

    console.log(`\n${GREEN}=============================================`);
    console.log(` [✔️] STATUS    : SUCCESS`)
    console.log(` [i] MESSAGE   : ${message}`)
    console.log(` [-] OLD DATA  : ${details.old}`)
    console.log(` [+] NEW DATA  : ${details.new}`)
    console.log(` [L] TIMESTAMP : ${time}`)
    console.log(`=============================================${RESET}\n`);
}

const processEditData = (userobj, updatedName, yearOfBirthFil, search, search1) => {
    const olduserObj = [...userobj.data]
    const newAgeupd = CurrentYear - yearOfBirthFil
    const newDecade = Math.floor(newAgeupd / 10) * 10
    let newStatus = ''
    if (newAgeupd >= 18) { newStatus = "adult" }
    else { (newStatus = "young") }
    const dataUpdated = [updatedName, yearOfBirthFil.toString(), newAgeupd.toString(), newDecade.toString() + "s", newStatus]
    userobj.data = dataUpdated
    const allLines = fs.readFileSync("users.txt", "utf-8").split("\n")
    allLines[userobj.index] = dataUpdated.join(" | ")
    fs.writeFileSync("users.txt", allLines.join("\n"))
    //console.log(`\n ${GREEN} [*] ${olduserObj.join(" | ")}  is successfully modified to ${userobj.data.join(" | ")} ${RESET} `)
    printSuccess("User modified successfully", {
        old: olduserObj.join(" | "),
        new: dataUpdated.join(" | ")
    })
    search(search1)
}
const askNewYearOfbirth = (userobj, updatedName, search, search1) => {
    rl.question(`Enter new year of birth (or press Enter to keep '${userobj.data[1]}'): `, (newYearOfBirth) => {
        const updateYearOfBirth = newYearOfBirth.trim() === '' ? userobj.data[1] : newYearOfBirth.trim();
        if (!/^\d{4}$/.test(updateYearOfBirth) && updateYearOfBirth !== "" || isNaN(updateYearOfBirth) || updateYearOfBirth > CurrentYear || updateYearOfBirth < minYearAllowed) {
            console.log(`\n
                hello ${updatedName}
               ${RED} [!] error: the !${newYearOfBirth}! entered is invalid year of birth ${RESET}
                 please make sure it is between ${minYearAllowed} and ${CurrentYear} `)
            return askNewYearOfbirth(userobj, updatedName, search, search1)
        }
        const yearOfBirthFil = parseInt(updateYearOfBirth)
        processEditData(userobj, updatedName, yearOfBirthFil, search, search1)

    })
}
const editUserData = (userobj, search, search1) => {
    // 1. نسأله عن الاسم مع عرض الاسم الحالي
    rl.question(`Enter new Name (or press Enter to keep '${userobj.data[0]}'): `, (newName) => {

        // إذا ضغط إنتر (ترك الحقل فارغاً)، نحتفظ بالاسم القديم، وإلا نأخذ الجديد
        const updatedName = newName.trim() === '' ? userobj.data[0] : newName.trim();
        askNewYearOfbirth(userobj, updatedName, search, search1)
    })


}

const processUserAction = (userobj, search, search1, editUserData, res) => {
    console.log(` you chose the row : ${BLUE} ${userobj.data.join(" | ")}${RESET}\n`)
    const delMod = () => {
        rl.question(' press "d" to delete the line or "m" to modify  or "c" to cancel ', (answer) => {
            if (answer.toLowerCase() === 'd') {
                // delete line process
                console.log(`you chose :${BLUE} ${userobj.data.join(" | ")} ${RED}for deletion.${RESET}\n`)
                const confDel = () => {
                    rl.question('press "y" to delete or "c" to cancel ', (answer) => {
                        if (answer.toLowerCase() === 'c') {
                            console.log(`\n ${RED}[!] Deletion cancelled. Data remains unchanged:${RESET}`)
                            search(search1)
                        }
                        else if (answer.toLowerCase() === 'y') {
                            console.log(`\n ${GREEN} [-] ${userobj.data.join(" | ")} is successfully deleted ${RESET}`)
                            const allLines = fs.readFileSync("users.txt", "utf-8").split("\n")
                            allLines.splice(userobj.index, 1)
                            fs.writeFileSync("users.txt", allLines.join("\n"))
                            search(search1)

                        }

                        else {
                            console.log(`\n ${RED} [!] Invalid choice ! : please press "y" to confirm deletion or "c" to cancel. ${RESET}`)
                            confDel()
                        }
                    })

                }
                confDel()
            }
            else if (answer.toLowerCase() === 'm') {
                console.log(`you chose : ${BLUE}${userobj.data.join(" | ")} ${YELLOW}for modification.${RESET}\n`)
                const confMod = () => {
                    rl.question('press "y" to confirm modification or "c" to cancel  ', (answer) => {
                        if (answer.toLowerCase() === 'c') {
                            console.log(`\n${RED}[!] modification cancelled. Data remains unchanged:${RESET}`)
                            search(search1)
                        }
                        else if (answer.toLowerCase() === 'y') {
                            editUserData(userobj, search, search1)


                        }
                        else {
                            console.log(`\n ${RED}[!] Invalid choice ! : please press "y" to confirm modification or "c" to cancel ${RESET}`)
                            confMod()
                        }
                    })

                }
                confMod()
            }

            else if (answer.toLowerCase() === 'c') {
                search(search1)
            }
            else {
                console.log(`\n${RED}[!] invalid choice : please press "d" to delete or "m" to modify or "c" to cancel${RESET}`)
                delMod()
            }
        })
    }
    delMod()
}
const search = (autoSearchterm) => {
    const startfiltering = (search1) => {
        const fileContent = fs.readFileSync('users.txt', 'utf8')
        const lines = fileContent.trim().split('\n')
        results = []
        lines.forEach((line, i) => {
            if (i == 0 || line.trim() === "") {
                return
            }
            const columns = line.split('|').map(item => item.trim())
            for (let j = 0; j < columns.length; j++) {
                if (columns[j].includes(search1)) {
                    results.push({ index: i, data: columns })
                    break
                }
            }
        })
        if (results.length == 0) {
            console.log(`\n${YELLOW}[!] No Results found${RESET}`)
            const askAgain = () => {
                rl.question(`${YELLOW}[!]To search again press "s" , or press Enter to return to the Main Menu : ${RESET} `, (againSearch) => {
                    if (againSearch.toLowerCase() === 's') {
                        search()
                    }
                    else if (againSearch.trim() === '') {
                        mainMenu()
                    }
                    else {
                        console.log(`\n${RED}[!] Invalid choice : please press "s" to search again or Enter to return to Main Menu : ${RESET}`)
                        askAgain()
                    }
                })
            }
            askAgain()
        }
        else {
            const displayResult = () => {
                // 1. طباعة عنوان القسم لفصل البحث بصرياً
                console.log("\n--- Search Results ---\n")

                // 2. طباعة الـ Header يدوياً لأن مصفوفة النتائج لا تحتوي عليه
                console.log("No.".padEnd(4) + "|" + "Name".padEnd(12) + "|" + "Born".padEnd(6) + "|" + "Age".padEnd(4) + "|" + "Decade".padEnd(6) + "|" + "Status")

                // 3. الخط الفاصل تحت الـ Header مباشرة لتنظيم المظهر
                console.log("-------------------------------------------------------------")

                // 4. الدوران حول النتائج وتفكيك أعمدتها لطباعتها بالتنسيق الموحد
                let indexRow = 1
                results.forEach((res) => {
                    const col = res.data
                    const [name, born, age, decade, status] = col;
                    console.log(`${String(indexRow).padEnd(4)}|${name.padEnd(12)}|${born.padEnd(6)}|${age.padEnd(4)}|${decade.padEnd(6)}|${status}`)
                    indexRow++
                })

                // سطر فارغ بسيط ليعطي مساحة مريحة للعين قبل سؤال العودة
                console.log("")
            }
            displayResult()

            // 5. بوابة الانتظار تعلّق الشاشة حتى يضغط المستخدم Enter ليعود للقائمة
            const goSearchAgain = () => {
                rl.question(' press "s" to search again , or Enter to return to Main Menu , or enter the row number to delete/modify ', (answer) => {
                    if (answer.toLowerCase() == "s") {
                        search()
                    }
                    else if (answer == "") {
                        mainMenu()
                    }
                    else if (/^\d+$/.test(answer) && !isNaN(parseInt(answer)) && (answer > 0 && answer <= results.length)) {

                        const userobj = results[parseInt(answer) - 1]
                        processUserAction(userobj, search, search1, editUserData, results)
                    }

                    else {
                        console.log(`${RED}\n [!] Invalid choice !${RESET}`)
                        goSearchAgain()
                    }

                })
            }
            goSearchAgain()
        }

    }
    if (autoSearchterm) {
        startfiltering(autoSearchterm)
    }
    else {
        rl.question(` Enter what do you want search `, (search1) => {
            if (!search1 || search1.trim() === "") {
                console.log(`\n${RED}[!] Error : Search query cannot be empty${RESET}`)
                return search()
            }
            startfiltering(search1)
        })
    }
}
const mainMenu = () => {
    console.clear()
    console.log('\n--- Main Menu -----')
    console.log('1 : Add New User')
    console.log('2 : View All users')
    console.log('3 : search')
    console.log('4 : exit')
    rl.question('what is your choice ? ', (choice) => {
        switch (choice) {
            case '1': askName()
                break
            case '2': {
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
            }

            case '3': {
                search()
                break
            }
            case '4': rl.close()
                break
            default: {
                console.log(`\n ${RED} your choice is : ${choice} ${RESET}`)
                console.log(`${RED} [!] Invalid option : Please enter a number between 1 and 4 ${RESET}`)
                setTimeout(() => {
                    mainMenu()
                }, 2000)
                break
            }
        }
    })

}
if (!fs.existsSync('users.txt')) { fs.writeFileSync('users.txt', ' Name | Born | Age | Decade | Status \n') }
const askName = () => {
    rl.question(`${YELLOW}What is your name ? ${RESET}`, (name) => {
        const askYear = () => {
            rl.question(` ${YELLOW}What is your birth year? ${RESET} `, (yearBirth) => {
                if (!/^\d{4}$/.test(yearBirth) || isNaN(yearBirth) || yearBirth > CurrentYear || yearBirth < minYearAllowed) {
                    console.log(`
                Hello ${name}
                ${RED} [!] error : The year "${yearBirth}" is not a valid year of birth ${RESET} 
                 ${YELLOW} Hint : Please make sure  between ${minYearAllowed} and ${CurrentYear} ${RESET}\n
                 `)
                    return askYear()
                }
                const yearOfBirth = parseInt(yearBirth)
                const age = CurrentYear - yearOfBirth
                const decade = Math.floor(age / 10) * 10
                const status = age >= 18 ? "adult" : "young"
                console.log(`${BLUE} Hello ${name} , your age is exactly : ${age} , you are in the ${decade}s , and you are classified as: ${status}${RESET}`)
                fs.appendFileSync('users.txt', `${name} | ${yearOfBirth} | ${age} | ${decade}s | ${status}\n`)
                console.log(`${GREEN} [+] User ${name} has been successfully registered!${RESET}`)
                const askToContinue = () => {
                    rl.question(` ${YELLOW} Do you want to add another user ? press "y" to add new user or Enter to return to Main Menu : ${RESET} `, (answer) => {
                        if (answer.toLowerCase() == 'y') {
                            askName()
                        }
                        else if (answer == '') {
                            mainMenu()
                        }
                        else {
                            console.log(`\n ${RED}[!] Invalid choice !:  press "y" to add new user, or press Enter to return to Main Menu ${RESET}`)
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