import Sequelize from 'sequelize';
import db from './db';

const User = db.define('user', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
  },
  name: Sequelize.TEXT,
  facebookId: Sequelize.TEXT,
});

export default User;
