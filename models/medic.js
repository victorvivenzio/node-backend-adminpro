var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var medicSchema = new Schema({
    name: {
        type: String,
        required: [
            true,
            'Medic name is required'
        ]
    },
    img: {
        type: String,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [
            true,
            'User is Required'
        ]
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [
            true,
            'Hospital is required'
        ]
    },
});

module.exports = mongoose.model( 'Medic', medicSchema );
