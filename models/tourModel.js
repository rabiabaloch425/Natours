const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tours have a name"],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less then or equal then 40 characters.'],
    minlength: [10, 'A tour name must have less then or equal then 10 characters.'],
    //validate: [validator.isAlpha,'Tour Name must only container characters.']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, "A tours have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tours have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tours have a difficulty"],
    enum: {
      values:  ['easy','medium','difficult'],
      message: "Difficulty is either: easy, medium, difficult"
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.7,
    min: [1, "Ratings must be above 1.0"],
    max: [5, "Ratings must be above 5.0"],
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, " A tours have a price"]
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator:  function(val){
        return val < this.price;
      },
      message: 'Discount Price ({VALUE}) should be than the regular price'
    }
   
  },
  Summary: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, " A tours have a Image"]
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secreteTour: {
    type: Boolean,
    default: false
  }
},
{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}  //this will output the value in our get api (virtual values) // it's not part of the database
})


// DOCUMENT MIDLLEWARE: runs before .save() and .create() 
toursSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true});
   next();
  })
  

//Query Middlware //working for get all api
toursSchema.pre(/^find/, function(next){  //no need to add more queries it will resolve the issue for those which are starting from find.
  this.find({secreteTour: {$ne: true}});
  this.start = Date.now();
  next();
})

//Query Middlware //working for get all api
toursSchema.post(/^find/, function(docs, next){  
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  console.log(docs);
  next();
})

//Aggregation Middlware
toursSchema.pre('aggregate', function(next){
  this.pipeline().unshift({$match: {secreteTour: {$ne: true}}}) //unshift to put at the end of array shift to put at the top of array
  console.log(this.pipeline());
  next();
})

//   //Query Middlware //working for get all api
// toursSchema.pre('findOne', function(next){
//   this.find({secreteTour: {$ne: true}})
//   next();
// })

// toursSchema.pre('save', function(next) {
//  console.log('Will Save Document....');
//    next();
//   })

// toursSchema.post('save', function(doc, next) {
//  console.log(doc);
//    next();
//   })
  
  //virtual Schema //these are regular functions and we use this to point out the current value
  toursSchema.virtual('durationWeeks').get(function(){
  return this.duration / 7 ;
  })


const Tour = mongoose.model("Tour", toursSchema);


module.exports = Tour;