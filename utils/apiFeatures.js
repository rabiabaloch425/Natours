
class ApiFeature{
  constructor(query, queryString){
    this.query = query;
    this.queryString = queryString;
  }
  filter(){
 // 1A) Filtering
 const queryObj = {...this.queryString };
 const excludedFields = ['page', 'sort', 'limit', 'fields'];
 excludedFields.forEach(el => delete queryObj[el]);

 //Execute Query
 // 2B) Advanced Filtering
 let queryStr = JSON.stringify(queryObj);
 queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
 console.log(JSON.parse(queryStr));
 this.query =  this.query.find(JSON.parse(queryStr))
 return this;
  }
  sort(){
    // 3) Sorting
    if(this.queryString.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    else{
      this.query = this.query.sort('-createdAt')
    }
    return this;
  }
  limitFields(){
// 3) Field Limiting
    if(this.queryString.fields){
      const fields = req.query.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    else{
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate(){
    const page = this.queryString.page * 1 || 1; //convert a string to number
    const limit = this.queryString.limit * 1 || 100; //convert a string to number
    const skip = (page - 1) * limit;
  
    this.query = this.query.skip(skip).limit(limit)
    // if(this.queryString.page){
    //   const numTours = await Tour.countDocuments();
    //   if(skip > numTours) throw new Error('This Page Does not Exist');
    // }
    return this;
  }
}

module.exports = ApiFeature;