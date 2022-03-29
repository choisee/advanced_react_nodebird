const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Hashtag extends Model {
    static init(sequelize) {
        return super.init({
            // id가 기본적으로 들어있다
            name: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
        }, {
            modelName: 'Hashtag',
            tableName: 'hashtags',
            charset: 'utf8mb4',            // 이모티콘 저장
            collate: 'utf8mb4_general_ci', // 이모티콘 저장
            sequelize,
        });
    }
    static associate(db) {
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
    }
};
// belongsToMany - 하나의 해시태그에 여러 게시글 ㅇㅋ, 하나의 게시글에 여러 해시태그 ㅇㅋ, 다대다 관계