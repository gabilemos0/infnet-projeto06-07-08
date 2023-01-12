import { sequelizeDb as sequelize } from '../db'
import { Optional, Model, DataTypes } from 'sequelize'

interface IUser {
  id: number
  name: string
  username: string
  email: string
  password: string
  token: string
  active: boolean
  role_id: number

  createdAt: Date
  updatedAt: Date
}

export type UserCreationAttributes = Optional<IUser, 'id'>

export class User extends Model<IUser, UserCreationAttributes> {
  declare id: number
  declare name: string
  declare username: string
  declare email: string
  declare password: string
  declare token: string
  declare active: boolean
  declare role_id: number
  declare createdAt: Date
  declare updatedAt: Date
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: new DataTypes.STRING(100),
      allowNull: false
    },
    username: {
      type: new DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: new DataTypes.STRING(100),
      allowNull: false
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false
    },
    token: {
      type: new DataTypes.STRING(128),
      allowNull: true
    },
    active: {
      type: new DataTypes.BOOLEAN(),
      allowNull: true,
      defaultValue: false
    },
    role_id: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'user'
  }
)
