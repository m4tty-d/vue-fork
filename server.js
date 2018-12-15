const express = require('express')
const serveStatic = require('serve-static')
const secure = require('express-force-https')
const path = require('path')

const app = express()

app.use(secure)
app.use(serveStatic(path.join(__dirname, 'dist')))
app.get('*', (res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'))
})

const port = process.env.PORT || 8080
app.listen(port)
console.log(`Server is listening on ${port}`)
