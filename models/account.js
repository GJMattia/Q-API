const mongoose = require('mongoose')
const Schema = mongoose.Schema


const accountSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    description: { type: String, default: 'motto here' },
    film: {
        'right': { type: Number, default: 0 },
        'wrong': { type: Number, default: 0 }
    },
    music: {
        'right': { type: Number, default: 0 },
        'wrong': { type: Number, default: 0 }
    },
    television: {
        'right': { type: Number, default: 0 },
        'wrong': { type: Number, default: 0 }
    },
    videoGames: {
        'right': { type: Number, default: 0 },
        'wrong': { type: Number, default: 0 }
    },
    mythology: {
        'right': { type: Number, default: 0 },
        'wrong': { type: Number, default: 0 }
    },
    sports: {
        'right': { type: Number, default: 0 },
        'wrong': { type: Number, default: 0 }
    },
    geography: {
        'right': { type: Number, default: 0 },
        'wrong': { type: Number, default: 0 }
    },
    history: {
        'right': { type: Number, default: 0 },
        'wrong': { type: Number, default: 0 }
    },
    politics: {
        'right': { type: Number, default: 0 },
        'wrong': { type: Number, default: 0 }
    },
    animals: {
        'right': { type: Number, default: 0 },
        'wrong': { type: Number, default: 0 }
    },
    vehicles: {
        'right': { type: Number, default: 0 },
        'wrong': { type: Number, default: 0 }
    }

}, {
    timestamps: true
});


module.exports = mongoose.model('Account', accountSchema)