#!/usr/bin/env node

const jsdom = require('jsdom')
const { walk } = require('walk')
const fs = require('fs')
const argv = require('yargs')
  .usage('Usage: $0 <dump directory> <site basename>')
  .demandCommand(2)
  .argv

const path = require('path')
const jquery = fs.readFileSync(path.join(__dirname, 'node_modules/jquery/dist/jquery.js'), 'utf-8')
const debug = require('debug')('scraper')
const fields = []

const rootpath = argv._[0]
const url = argv._[1]
const walker = walk(rootpath, {followLinks: true})

function report (field) {
  if (!field.name) return
  console.log(field.url, field.name, field.form_action ? field.form_action : '')
}

console.log('url\tfield_name\tform_action')

walker.on('file', (root, fileStats, next) => {
  const filepath = path.join(root, fileStats.name)
  const relativefilepath = filepath.replace(rootpath, '')
  fs.readFile(filepath, (err, data) => {
    if (err) throw err
    jsdom.env({
      html: data,
      src: [jquery],
      done: (err, window) => {
        if (err) throw err
        const $ = window.$

        // find all inputs type hidden with jquery
        let inputs = $('input[type="hidden"]')
        let forms = $('form[action]')

        for (let i = 0; i < inputs.length; i++) {
          const elem = $(inputs[i])
          let form
          if (forms.length > 1) {
            let parent = elem
            do {
              parent = parent.parent()
              for (let j = 0; j < forms.length; j++) {
                if (forms[j] === parent[0]) {
                  form = $(forms[j])
                }
              }
            } while (!form && parent.parent() && parent.parent().length !== 0)
          } else if (forms.length === 1) {
            form = $(forms[0])
          }

          fields.push({
            url: url + path.join('/', relativefilepath),
            id: elem.attr('id'),
            name: elem.attr('name'),
            val: elem.val(),
            form_action: form ? form.attr('action') : ''
          })
          report(fields[fields.length - 1])
        }
      }
    })
  })
  next()
})
