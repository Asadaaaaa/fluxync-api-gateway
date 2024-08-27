// Library
import { DataTypes } from "sequelize";

class EmailVerifCode {
  constructor(server) {
    const table = server.model.db.define('email_verif_code', {
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
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      type: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      code: {
        type: DataTypes.STRING(6),
        allowNull: false
      },
      try_counter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      max_try_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
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
      tableName: 'email_verif_code',
      timestamps: false
    });

    this.table = table;
  }
}

export default EmailVerifCode;