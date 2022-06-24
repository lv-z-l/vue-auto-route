#!/usr/bin/env node
// 进度
const ora = require('ora')
// 字体
const chalk = require('chalk')
const fs = require('fs')
// 命令
const { Command } = require('commander')
// 交互
const inquirer = require('inquirer')

const figlet = require('figlet')
const M = require('./auto-route')

const RegExp_TsOrJs = /\.(ts|js)$/


const { log } = console
const program = new Command()
let start = 0
let end = 0
let spinner
program
  .name('gen-route')
  .version('1.0.0', '-v, --version')
  .description('根据传入的路径，自动生成路由配置并写入文件中')
  .action(() => {
    figlet('gen-route', (err, data) => {
      console.log(data)
      inquirer.prompt([
        {type: 'input', name: 'dir', message: '要生成哪个文件夹下面的路由(eg: src/views)', validate: input => {
          let stat
          try {
            stat = fs.statSync(input)
          } catch (error) {
            return `异常: ${error.message}，请重新输入`
          }
          return true
        }},
        {type: 'input', name: 'dest', message: '要将路由配置生成到哪个文件下(eg: src/router/auto-route.js)', validate: input => {
          return !RegExp_TsOrJs.test(input) ? '只能生成到.ts/.js文件下，请重新输入' : true
        }}
      ]).then(async answers => {
        start = Date.now()
        log(`Wait a mininute,  Routing configuration will be generated into the file ${chalk.green.bold(answers.dest)}`)
        spinner = ora(chalk.hex('#DEADED').bold("👻 I'm trying......")).start()
        await M.generateRoute(answers.dir, answers.dest)
        spinner.color = 'green'
        spinner.stop()
        end = Date.now()
        log(chalk.green.bold(`success in ${(end - start) / 1000} s`))
      }).catch(err => {
        log(chalk.red.bold('fail'))
        log(err)
        spinner.stop()
      })
    })
  })

program.parse()
