// Library
import { DataTypes } from "sequelize";

class Users {
  constructor(server) {
    const table = server.model.db.define('users', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: server.model.db.literal('uuid()')
      },
      name: {
        type: DataTypes.STRING(60),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      username: {
        type: DataTypes.STRING(16),
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      hashing_salt: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      profile_picture_path: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
      tableName: 'users',
      timestamps: false,
      indexes: [
        {
          fields: ['uuid']
        },
        {
          fields: ['username']
        },
        {
          fields: ['email']
        }
      ]
    });

    this.table = table;
  }
}

export default Users;