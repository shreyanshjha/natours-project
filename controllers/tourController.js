const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
    try {
        // BUILD QUERY

        // 1A) FILTERING
        const queryObj = {...req.query};
        const excludedFields = ['pageNum', 'sort', 'pageSize', 'fields'];
        for(let i = 0; i < excludedFields.length; i++)  {
            delete queryObj[excludedFields[i]];
        }

        // 1B) ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => '$'+match);

        // Eg:- Mongo DB querying data with advanced filtering
        // { duration: { $gte: 5 }, difficulty: 'easy' }

        let query = Tour.find(JSON.parse(queryStr));

        // 2) SORTING
        if(req.query.sort) { 
            const sortFields = req.query.sort.split(',');
            const sortObj = {};
            for(let i = 0; i < sortFields.length; i++) {
                const [orderBy, orderDirection] = sortFields[i].split(':');
                sortObj[orderBy] = String(orderDirection);
            }
            console.log(sortObj);
            query = query.sort(sortObj);
        } else {
            query = query.sort({'createdAt': 'desc'});
        }

        // 3) Field limiting
        if(req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // 4) PAGINATION
        //pageNum=2&pageSize=20, record 1 to 20 => pageNum 1, record 21 to 40 => pageNum 2, record 41 to 60 is pageNum 3 and so on (Industry standard)
        const pageNum = Number(req.query.pageNum) || 1;
        const limit = Number(req.query.pageSize) || 100;
        const skip = (pageNum - 1) * limit;
        query = query.skip(skip).limit(limit);
        if(req.query.pageNum) {
            const numTours = await Tour.countDocuments();
            if(skip >= numTours) throw new Error("This page does not exist");
        }
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