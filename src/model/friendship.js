import Sequelize from 'sequelize';
import db from '../db';
import User from './user';

const Friendship = db.define('friendship', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },
});

Friendship.belongsTo(User, { as: 'user' });
Friendship.belongsTo(User, { as: 'friend' });

export default Friendship;
