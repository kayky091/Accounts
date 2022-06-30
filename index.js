import inquirer from 'inquirer'
import chalk from 'chalk'
import fs from 'fs'

operation()

function operation() {

    inquirer.prompt([
        {
            type: 'list',
            message: 'O que deseja fazer ?',
            name: 'action',
            choices: [
                'criar conta',
                'consultar saldo',
                'depositar',
                'sacar',
                'sair'
            ],
        }
    ]).then((answer) => {
        const action = answer['action']

        if (action == 'criar conta') {
            createAccount()
            buildAccount()
        } else if (action == 'depositar') {
            deposit()
        } else if (action == 'consultar saldo') {
            getAccountBalance()
        } else if (action == 'sacar') {
            getMoney()
        } else if (action == 'sair') {
            console.log(chalk.bgBlue.black('obrigado por usar o Accounts'))
            process.exit()
        }
    }).catch((err) => console.log(err))
}

//criar conta

function createAccount() {

    console.log(chalk.bgGreen.black('parabens por escolherr nosso banco !'))
    console.log(chalk.green('Defina as opcoes da sua contea a seguir'))
}

function buildAccount() {
    inquirer.prompt([
        {
            message: 'qual e o nome da conta ?',
            name: 'accountName',
        }
    ]).then((answer) => {
        const accountName = answer['accountName']
        console.info(accountName)

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('esta conta ja existe, escolha outro nome !'))
            buildAccount()
            return
        }
        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function (err) {
            console.log(err)
        },
        )
        console.log(chalk.green('parabens a sua conta foi criada !'))
        operation()

    }).catch((err) => console.log(err))
}

function deposit() {
    inquirer.prompt([
        {
            message: 'qual e o nome da conta ?',
            name: 'accountName',
        }
    ]).then((answer) => {

        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return deposit()
        }

        inquirer.prompt([
            {
                message: 'qual e o valor que deseja depositar ?',
                name: 'amount',
            }
        ]).then((answer) => {

            const amount = answer['amount']


            addAmount(accountName, amount)
            operation()

        }).catch((err) => console.log(err))

    }).catch(err => console.log(err))
}

function getMoney() {
    inquirer.prompt([
        {
            message: 'qual e o nome da conta ?',
            name: 'accountName',
        }
    ]).then((answer) => {

        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return deposit()
        }

        inquirer.prompt([
            {
                message: 'quanto deseja sacar ?',
                name: 'money',
            }
        ]).then((answer) => {

            const money = answer['money']


            outMoney(accountName, money)
            operation()

        }).catch((err) => console.log(err))

    }).catch(err => console.log(err))
}
function checkAccount(accountName) {

    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('esta conta nao existe !'))
        return false
    }
    return true
}
function addAmount(accountName, amount) {

    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro tente novamente mais tarde !'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(`accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )

    console.log(chalk.green(`foi depositado ${amount} na sua conta !`))

}
function outMoney(accountName, money) {

    const accountData = getAccount(accountName)

    if (!money) {
        console.log(chalk.bgRed.black('Ocorreu um erro tente novamente mais tarde !'))
        return deposit()
    }
    if (parseFloat(money) > parseFloat(accountData.balance)) {

        console.log(chalk.red('valor maior do que voce possui na conta ! coloque um valor valido.'))
        return getMoney()
    }
    accountData.balance = parseFloat(accountData.balance) - parseFloat(money)

    fs.writeFileSync(`accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )

    console.log(chalk.green(`foi sacado ${money} na sua conta !`))

}


function getAccount(accountName) {

    const accountJson = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJson)
}

function getAccountBalance() {
    inquirer.prompt([
        {
            message: 'qual e o nome da conta ?',
            name: 'accountName',
        }
    ]).then((answer) => {

        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.green(`Ola, o saldo da conta ${accountName} e  R$${accountData.balance} !`))

        return operation()

    }).catch((err) => console.log(err))

}