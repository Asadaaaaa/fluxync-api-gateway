// Library
import { DataTypes } from "sequelize";

class NSFWDetection {
  constructor(server) {
    const table = server.model.db.define('nsfw_detection', {
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
      image_path: {
        type: DataTypes.ENUM('Porn', 'Neutral'),
        allowNull: false
      },
      image_label: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      image_score: {
        type: DataTypes.DOUBLE,
        allowNull: false
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
      tableName: 'nsfw_detection',
      timestamps: false
    });

    this.table = table;
  }
}

export default NSFWDetection;