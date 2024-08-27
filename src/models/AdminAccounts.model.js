// Library
import { DataTypes } from "sequelize";

class AdminAccounts {
  constructor(server) {
    const table = server.model.db.define('admin_accounts', {
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
      username: {
        type: DataTypes.STRING(16),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
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
      }
    }, {
      tableName: 'admin_accounts',
      timestamps: false
    });

    this.table = table;
  }
}

export default AdminAccounts;