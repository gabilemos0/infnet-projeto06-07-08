import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import AdminJSSequelize from '@adminjs/sequelize'
import AdminJSMongoose from '@adminjs/mongoose'
import express from 'express'

import session from 'express-session'
import cors from 'cors'

import { Role } from './models/role.entity'
import { User } from './models/user.entity'
import { Document } from './models/document.entity'

import bcrypt from 'bcryptjs'
import UserController from './controllers/UserController'

import { document } from './routes/document'
import { auth } from './routes/auth'

import hbs from 'hbs'
const path = require('node:path')

require('dotenv').config()

const mysqlStore = require('express-mysql-session')(session)

const { PORT } = process.env

const ROOT_DIR = __dirname

const sessionStore = new mysqlStore({
  connectionLimit: 10,
  password: process.env.SQL_DB_PASS,
  user: process.env.SQL_DB_USER,
  database: process.env.SQL_DB_NAME,
  host: process.env.SQL_DB_HOST,
  port: process.env.SQL_DB_PORT,
  createDataBaseTable: true
})

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database
})

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database
})

const generateResources = (
  Model: object,
  properties: any = {},
  actions: any = {}
) => {
  return {
    resource: Model,
    options: {
      properties: {
        ...properties,
        createdAt: {
          isVisible: {
            list: true,
            edit: false,
            create: false,
            show: true
          }
        },
        updatedAt: {
          isVisible: {
            list: true,
            edit: false,
            create: false,
            show: true
          }
        }
      },
      actions: {
        ...actions
      }
    }
  }
}

const start = async () => {
  const app = express()

  const adminOptions = {
    resources: [
      generateResources(Role),
      generateResources(
        User,
        {
          password: {
            type: 'password'
          }
        },
        {
          new: {
            before: async (request: any, context: any) => {
              if (request.payload.password) {
                request.payload.password = await bcrypt.hashSync(
                  request.payload.password,
                  10
                )
              }
              return request
            },
            after: async (
              originalResponse: any,
              request: any,
              context: any
            ) => {
              console.log(originalResponse.record.params)
              return originalResponse
            }
          }
        }
      ),
      generateResources(Document)
    ],
    dashboard: {
      component: AdminJS.bundle('./components/DashboardComponent')
    },
    // rootPath: '/internal/admin',
    branding: {
      companyName: 'Gabi Docs',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Eo_circle_light-blue_heart.svg/640px-Eo_circle_light-blue_heart.svg.png',
      favicon:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Eo_circle_light-blue_heart.svg/640px-Eo_circle_light-blue_heart.svg.png'
    }
  }

  const admin = new AdminJS(adminOptions)

  // const adminRouter = AdminJSExpress.buildRouter(admin)
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (email, password) => {
        const userCtrl = new UserController()
        return await userCtrl.login(email, password)
      },
      cookieName: 'adminjs-internal-admin',
      cookiePassword: 'LOUalhYNP3xzNKIx8Jvc5RTIGmp8zS'
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: 'T1oPBqZoSLazm2qAMGt0SdtAnfAxVb',
      cookie: {
        httpOnly: process.env.NODE_ENV !== 'production',
        secure: process.env.NODE_ENV === 'production'
      },
      name: 'adminjs-internal-admin'
    }
  )

  hbs.registerPartials(path.join(ROOT_DIR, 'views'))
  app.set('view engine', '.hbs')

  app.use(cors())
  app.use(express.json())

  app.use(admin.options.rootPath, adminRouter)
  app.use('/document', document)
  app.use('/auth', auth)

  app.get('/', (req, res) => {
    res.send('oi')
  })

  app.listen(PORT, () => {
    console.log(
      `AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`
    )
  })
}

start()
