import db from './db';
import Sequelize from './sequelize';
import User from './user';

const Friendship = db.define('friendship', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
  },
});

Friendship.belongsTo(User, { as: 'user' });
Friendship.belongsTo(User, { as: 'friend' });

export default Friendship;
