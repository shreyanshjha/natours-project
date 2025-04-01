const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
    try {
        // BUILD QUERY

        // 1) FILTERING
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 2) ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => '$'+match);

        // Eg:- Mongo DB querying data with advanced filtering
        // { duration: { $gte: 5 }, difficulty: 'easy' }

        const query = Tour.find(JSON.parse(queryStr));

        // moongoose query params code just for learning reference
        // const tours = await Tour.find()
        //      .where('duration')
        //      .equals(req.query.duration)
        //      .where('difficulty')
        //      .equals(req.query.difficulty);

        // EXECUTE QUERY
        const tours = await query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}
exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        // same like in mongo shell cmd: findOne({ _id: req.params.id })
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}
exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
          }
       });
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        });
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            data: null
        });
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}