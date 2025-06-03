class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
         // 1A) FILTERING
        const queryObj = {...this.queryString};
        const excludedFields = ['pageNum', 'sort', 'pageSize', 'fields'];
        for(let i = 0; i < excludedFields.length; i++)  {
            delete queryObj[excludedFields[i]];
        }

        // 1B) ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => '$'+match);

        // Eg:- Mongo DB querying data with advanced filtering
        // { duration: { $gte: 5 }, difficulty: 'easy' }

        //let query = Tour.find(JSON.parse(queryStr));
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if(this.queryString.sort) { 
            const sortFields = this.queryString.sort.split(',');
            const sortObj = {};
            for(let i = 0; i < sortFields.length; i++) {
                const [orderBy, orderDirection] = sortFields[i].split(':');
                sortObj[orderBy] = String(orderDirection);
            }
            console.log(sortObj);
            this.query = this.query.sort(sortObj);
        } else {
            this.query = this.query.sort({'createdAt': 'desc'});
        }
        return this;
    }

    limitFields() {
        if(this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        //pageNum=2&pageSize=20, record 1 to 20 => pageNum 1, record 21 to 40 => pageNum 2, record 41 to 60 is pageNum 3 and so on (Industry standard)
        const pageNum = Number(this.queryString.pageNum) || 1;
        const limit = Number(this.queryString.pageSize) || 100;
        const skip = (pageNum - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;