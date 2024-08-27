// Library
import { DataTypes } from "sequelize";

class TopupBalances {
  constructor(server) {
    const table = server.model.db.define('topup_balances', {
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
      integrated_application_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'integrated_applications',
          key: 'id'
        }
      },
      balance: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      tax: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      total_price: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('Pending', 'Paid', 'Done', 'Rejected', 'Expired'),
        allowNull: false
      },
      approve_by_admin_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'admin_accounts',
          key: 'id'
        }
      },
      expired_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      paid_at: {
        type: DataTypes.DATE,
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
      tableName: 'topup_balances',
      timestamps: false
    });

    this.table = table;
  }
}

export default TopupBalances;