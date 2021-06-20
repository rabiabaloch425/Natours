const Tour = require('./../models/tourModel')
const ApiFeature = require('./../utils/apiFeatures')
//Middleware For Filter
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// Here is my Post Api
exports.createTour = async (req, res) => {
  // const newTour = new Tour({});
  // newTour.save();
try{
  const newTour =  await Tour.create(req.body);
  res.status(201).json({
    status: 'message',
    data:{
      tour: newTour,
    }
  })

}catch(err){
res.status(400).json({
  status:'fail',
  message: err,
})
}
}

// Here is my Get All Api
exports.getAllTours = async (req,res)=>{
  try{
  // Build Query
  console.log(req.query);
  // // 1A) Filtering
  // const queryObj = {...req.query };
  // const excludedFields = ['page', 'sort', 'limit', 'fields'];
  // excludedFields.forEach(el => delete queryObj[el]);

  // //Execute Query
  // // 2B) Advanced Filtering
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  // console.log(JSON.parse(queryStr));

  // let query = Tour.find(JSON.parse(queryStr));

  // 3) Sorting
    //  if(req.query.sort) {
    //    const sortBy = req.query.sort.split(',').join(' ');
    //    query = query.sort(sortBy);
    //  }
    //  else{
    //    query = query.sort('-createdAt')
    //  }
  // // 3) Field Limiting
  // if(req.query.fields){
  //   const fields = req.query.fields.split(',').join(' ');
  //   query = query.select(fields);
  // }
  // else{
  //   query = query.select('-__v');
  // }
  // 3) Pagination
  // const page = req.query.page * 1 || 1; //convert a string to number
  // const limit = req.query.limit * 1 || 100; //convert a string to number
  // const skip = (page - 1) * limit;

  // query = query.skip(skip).limit(limit)
  // if(req.query.page){
  //   const numTours = await Tour.countDocuments();
  //   if(skip > numTours) throw new Error('This Page Does not Exist');
  // }
  // {difficulty: 'easy', duration: {$gte: 5}}
  // gte, gt, lte, lt


  //Execute Query
  const features = new ApiFeature(Tour.find(), req.query).filter().sort().limitFields().paginate();

  const tours = await features.query;

  
  // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')
  res.status(200).json({
    status:'success',
    results: tours.length,
    data: {
      tours
    }
  }) 
  }catch(err){
    res.status(404).json({
      status:'fail',
      message: 'Invalid DataSet',
    })
  }
  }
// Here is my Get By ID Api
exports.getTour = async (req,res)=>{
try{
 const tour =  await Tour.findById(req.params.id);
  // Tour.findOne({_id: req.params.id})
 res.status(200).json({
  status:'success',
  data: {
   tour
  }
})
}
catch(err){
  res.status(404).json({
    status:'fail',
    message: 'Invalid DataSet',
  })
}
}

// Here is my Update By ID Api
exports.updateTour = async (req,res)=>{
  try{
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  }catch(err){
    res.status(404).json({
      status:'fail',
      message: 'Invalid DataSet',
    })
  }
}

// Here is my Delete By ID Api
exports.deleteTour = async (req,res)=>{
 await Tour.findByIdAndDelete(req.params.id)
 try{
  res.status(204).json({
    data: null
  })
 }catch(err){
  res.status(404).json({
    status: 'fail',
    message: 'Invalid DataSet',
  })
 }
}
//Aggregates
exports.getTourStats = async (req, res) =>{
    try{
     const stats = await Tour.aggregate([
       {
         $match: {ratingsAverage: {$gte: 4.5} }
       },
       {
         $group:{
           _id: { $toUpper: '$difficulty'},
           avgRating: {$avg: '$ratingsAverage'},
           numRatings: {$sum: '$ratingsQuantity'},
           numTours: {$sum: 1},
           avgPrice: {$avg: '$price'},
           avgPrice: {$avg: '$price'},
           minPrice: {$min: '$price'},
           maxPrice: {$max: '$price'},
         }
       },
       {
         $sort:{avgPrice: 1}
       },
      //  {
      //    $match: {_id: {$ne: "EASY"}}
      //  }
     ]);
     res.status(200).json({
      status:'success',
      data: {
        stats
      }
    });
    }
    catch(err){
      res.status(404).json({
        status: 'fail',
        message: 'Invalid DataSet',
      })
    }
}
//Monthly Query using aggregates
exports.getMonthlyPlan = async (req, res) =>{
  try{
   const year = req.params.year * 1; //2021
   const plan = await Tour.aggregate([
     {
       $unwind: '$startDates' //convert array into single object
     },
     {
       $match:{
         startDates: {
           $gte: new Date(`${year}-01-01`),
           $lte: new Date(`${year}-12-31`)
         }
       }
     },
    { $group: {
       _id: {$month: '$startDates'},
       numTours: {$sum: 1},
       tours: {$push: '$name'}
     }
    },
    {
      $addFields: {month: '$_id'}
    },
    {
      $project: {
        _id: 0
      },
    },
    {
      $sort:{ numTourStarts: - 1}  //-1 for in ascending order // 1 for descending order
    },
    {
      $limit: 12
    }
   ]);
   res.status(200).json({
    status:'success',
    data: {
      plan
    }
  });
  }
  catch(err){
    res.status(404).json({
      status: 'fail',
      message: 'Invalid DataSet',
    })
  }
}