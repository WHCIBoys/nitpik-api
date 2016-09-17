import Sequelize from 'sequelize';
import db from '../db';
import User from './user';

const Nit = db.define('nit', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },
  content: Sequelize.TEXT,
  isAnonymous: Sequelize.BOOLEAN,
});

Nit.belongsTo(User, { as: 'user' });
Nit.belongsTo(User, { as: 'author' });

export default Nit;
