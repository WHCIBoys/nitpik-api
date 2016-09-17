import Sequelize from 'sequelize';
import db from '../db';

const User = db.define('user', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },
  name: Sequelize.TEXT,
  facebookId: {
    type: Sequelize.TEXT,
    primaryKey: true,
  },
});

export default User;
