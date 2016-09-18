import Sequelize from 'sequelize';
import * as S from './constant/secret';

export default new Sequelize(S.DB_ADDRESS);
