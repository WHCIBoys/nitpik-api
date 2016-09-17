import Sequelize from 'sequelize';
import db from './db';
import User from './user';

const Nit = db.define('nit', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
  },
  content: Sequelize.TEXT,
});

Nit.belongsTo(User, { as: 'user' });
Nit.belongsTo(User, { author: 'user' });

export default Nit;
