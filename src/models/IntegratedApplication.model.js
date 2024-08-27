// Library
import { DataTypes } from "sequelize";

class IntegratedApplications {
  constructor(server) {
    const table = server.model.db.define('integrated_applications', {
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
      name: {
        type: DataTypes.STRING(60),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      secret_key: {
        type: DataTypes.STRING(64),
        allowNull: true
      },
      balance: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      logo_path: {
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
      tableName: 'integrated_applications',
      timestamps: false
    });

    this.table = table;
  }
}

export default IntegratedApplications;