const Course = require('../models/course');
const Lesson = require('../models/lesson');
const Test = require('../models/test');
const Question = require ('../models/test');
const nodemailer = require('nodemailer');
const Enrollment = require ('../models/enrollement.js');
const User = require ('../Models/user.js');
const asynHandler = require("express-async-handler")


const createCourse= asynHandler(async (req, res) => {
    const {  
        titleCourse ,
        descriptionCourse , 
        category , 
        coach ,
        
      } = req.body;
      const thumbnailCourse = req.file ? req.file.filename : null;

       
  try {  
    // create a new course
    const course = new Course({
        titleCourse : titleCourse ,
        descriptionCourse: descriptionCourse,
        category: category,
        coach: coach,
        thumbnailCourse:thumbnailCourse
    });
    
    // save the course to the database
    await course.save();

    res.status(201).json({ course });
  } catch (err) {
    console.error(err);
    res.json({"message":"Server Error"}).status(400)
    throw new Error('Server Error')  }
})

findTestByCourse = asynHandler(async (req, res) => {
  const course = await Course.findOne({ _id: req.params.course })
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  const existingTest = await Test.findOne({ course });
  if (existingTest) {
    return res.status(200).json({ existingTest });
  }
  return res.status(404).json({ error: 'Test not found' });
});

const setTestPassed = async (req, res) => {
  const { enrollid } = req.params;
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(enrollid, { test: 'Passed' });
    res.json(enrollment); // send the updated enrollment as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update enrollment.' }); // send an error response
  }
};


const  setTestFailed = async (req, res) => {
  const { enrollid} = req.params;
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(enrollid, { test: 'Failed' });
    res.json(enrollment); // send the updated enrollment as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update enrollment.' }); // send an error response
  }
};

const calculateSuccessRate = async (req, res) => {
  const { courseId} = req.params;
  try {
    const enrollments = await Enrollment.find({ course: courseId });
    const completedEnrollments = enrollments.filter(enrollment => enrollment.completionStatus === 'Completed');
    const successRate = (completedEnrollments.length / enrollments.length) * 100;
    return res.json(successRate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update enrollment.' }); // send an error response
  
  }
};

const createTest= asynHandler(async (req, res) => {
  const {  
      course ,
      questions, 
    } = req.body;

   
try {  
  const existingTest = await Test.findOne({ course });
  if (existingTest) {
    return res.status(403).json({ message: "A test already exists for this course" });
  }
  // create a new course
  const test = new Test({
     course: course,
     questions: questions
  });
  
  // save the course to the database
  await test.save();

  res.status(201).json({ test });
} catch (err) {
  console.error(err);
  res.json({"message":"Server Error"}).status(400)
  throw new Error('Server Error')  }
})



const createLesson = async(req,res)=>{
    const { titleLesson,
        descriptionLesson,
         contentLesson,typeLesson,course}= req.body
         try {    
            // create a new lesson
            const lesson = new Lesson({
                titleLesson: req.body.titleLesson,
                descriptionLesson: req.body.descriptionLesson,
                contentLesson: req.body.contentLesson,
                typeLesson: req.body.typeLesson,
              course: req.body.course,
            });

            await lesson.save();
            const thecourse= await Course.findById(req.body.course) ;

            // add the lesson to the course's lessons array
            thecourse.lessons.push(lesson);
            
            // save the course to the database
            await thecourse.save();
        
            res.status(201).json({ thecourse});
          } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
          }
        };

const DisplayLesson= asynHandler(async(req,res)=>{
       
    const courses = await Course.find( {});
    if (!courses) {
        res.Error(404)
        throw new Error(" courses Not Found !!")
    }
    res.json(courses)

})


//delete course
const deleteCourse = asynHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (course) {
    await course.remove()
    res.json("Course removed")
  } else {
    res.status(404)
    throw new Error('Course not found')
  }
})


const deleteTest = asynHandler(async (req, res) => {
  const test = await Test.findById(req.params.id)
  if (test) {
    await test.remove()
    res.json("Test removed")
  } else {
    res.status(404)
    throw new Error('Test not found')
  }
})


//delete lesson
const deleteLessonFromCourse = async (req, res) => {
  const courseId = req.params.courseId;
  const lessonId = req.params.lessonId;

  try {
    // find the course to which the lesson belongs
    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // remove the lesson from the course's lessons array
    course.lessons.pull(lessonId);

    // save the course to the database
    await course.save();

    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
//update course



const updateCourse = asynHandler(async (req, res) => {
  const {
    titleCourse ,
    descriptionCourse , 
    category ,
    coach
  } = req.body
  const thumbnailCourse = req.file ? req.file.filename : null;

  const course = await Course.findById(req.params.id)

  if (course) {
    course.titleCourse = titleCourse
    course.descriptionCourse = descriptionCourse
    course.category = category
    course.coach = coach
    course.thumbnailCourse = thumbnailCourse
    const updatedCourse = await course.save()
    res.status(201).json({
      _id: course.id,
      titleCourse: course.titleCourse,
      user : course.user,
      category: course.category,
      descriptionCourse: course.descriptionCourse,
      coach: course.coach,
      thumbnailCourse: course.thumbnailCourse 

  })
  } else {
    res.status(404)
    throw new Error('Course not found')
  }
})

const updateLesson = asynHandler(async (req, res)  => {
  const courseId = req.params.courseId;
  const lessonId = req.params.lessonId;

  const { titleLesson, descriptionLesson, contentLesson, typeLesson } = req.body;

  try {
    // find the course to which the lesson belongs
    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // find the index of the lesson in the course's lessons array
    const lessonIndex = course.lessons.findIndex((lesson) => lesson._id.equals(lessonId));

    if (lessonIndex === -1) {
      res.status(404).json({ message: 'Lesson not found in course' });
      return;
    }

    // update the lesson in the course's lessons array
    course.lessons[lessonIndex].titleLesson = titleLesson;
    course.lessons[lessonIndex].descriptionLesson = descriptionLesson;
    course.lessons[lessonIndex].contentLesson = contentLesson;
    course.lessons[lessonIndex].typeLesson = typeLesson;

    // save the course to the database
    await course.save();

    res.status(200).json({ message: 'Lesson updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
   });

/* const updateLesson = asynHandler(async (req, res) => {
  const {
    titleLesson,
    descriptionLesson,
     contentLesson,typeLesson } = req.body
     const lesson = await Lesson.findById(req.params.id)
     

  if (lesson) {
    lesson.titleLesson = titleLesson
    lesson.descriptionLesson = descriptionLesson
    lesson.contentLesson = contentLesson
    lesson.typeLesson = typeLesson
   
    const updateLesson = await lesson.save()
    res.status(201).json({
      _id: lesson.id,
      titleLesson: lesson.titleLesson,
      descriptionLesson: lesson.descriptionLesson,
      contentLesson: lesson.contentLesson,
      typeLesson: lesson.typeLesson,
   

  })
  } else {
    res.status(404)
    throw new Error('Lesson not found')
  }
}) */
// search course 
const SearchCourse = asynHandler( async (req, res) => {
  const key = req.params.key;
  
  const courseResults = await Course.find({
    $or: [
      { titleCourse: { $regex:  new RegExp(key, 'i')  } },
      { category: { $regex:  new RegExp(key, 'i')  } },
      { descriptionCourse: { $regex:  new RegExp(key, 'i')  } },
    ],
  });

  const results = courseResults;
  
  res.send(results);
});
//getCourseById
const getCourseById = asynHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)

  if (course) {
    res.json(course)
  } else {
    res.status(404)
    throw new Error('Course not found')
  }
})

/* const getLessonById = asynHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id)

  if (lesson) {
    res.json(lesson)
  } else {
    res.status(404)
    throw new Error('Lesson not found')
  }
}) */

const getLessonById = asynHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const lessonId = req.params.lessonId;

  try {
    // find the course to which the lesson belongs
    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // find the lesson inside the course
    const lesson = course.lessons.find((lesson) => lesson._id == lessonId);

    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

//getCoursesById
const getCoursesById = asynHandler(  async (req, res) => {
  try {

    const course = await Course.find( { coach: req.params.userId } ).populate('coach'); 
    if (!course) {
      return res.status(404).json({ message: 'course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const getCoursesByIds = asynHandler(  async (req, res) => {
  const course = await Course.findById(req.params.id)

  if (course) {
    res.json(course)
  } else {
    res.status(404)
    throw new Error('Course not found')
  }
});

const GetLessons = asynHandler(  async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('lessons');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const lessons = course.lessons;
    res.json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const updateEnrollforUser = asynHandler(async(req,res)=>
{   try{
    const enrollId = req.params.enrollId;
    const userId = req.params.userId;
    
  const updatedUser = await User.findByIdAndUpdate(
  { _id: userId },
  { enrollment: enrollId }
).populate('enrollment');
res.json(updatedUser);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
})
const createEnroll = asynHandler( async (req, res) => {
  try {
    // Get the learner and course IDs from the request body
    const { learner, course ,completionStatus} = req.body;

    // Check if an enrollment document with the same learner and course IDs already exists in the database
    const existingEnrollment = await Enrollment.findOne({ learner: learner , course: course });

    if (existingEnrollment) {
      // If an enrollment document already exists, return an error message to the client
      return res.status(400).json({ error: 'Enrollment already exists' });
    }

    // Create a new Enrollment document with the learner and course IDs
    const enrollment = new Enrollment({
      learner: learner,
      course: course,
      completionStatus:completionStatus,
    });

    // Save the new Enrollment document to the database
    await enrollment.save();

    const updatedUser = await User.findByIdAndUpdate(
      { _id: learner },
      { enrollment: enrollment._id }
    ).populate('enrollment');
    console.log(updatedUser);
    console.log('User updated successfully.');
    // Return a success message to the client
    res.status(201).json({ message: 'Enrollment created successfully' });
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
const getAgePercentage = asynHandler(async (req, res) => {
  const { courseId } = req.params;

  const learners = await Enrollment.find({ course: courseId })
    .populate('learner', 'dateOfBirth')
    .exec();

  const validLearners = learners.filter((learner) => learner.learner.dateOfBirth);

  const totalLearners = validLearners.length;
  const above30 = validLearners.filter((learner) => {
    const birthDate = new Date(learner.learner.dateOfBirth);
    const age = Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
    return age > 30;
  }).length;
  const below30 = totalLearners - above30;

  const above30Percentage = (above30 / totalLearners) * 100;
  const below30Percentage = (below30 / totalLearners) * 100;

  res.json({ above30: above30Percentage, below30: below30Percentage });
});
const updateCompletionStatus = async (req, res) => {
  const { enrollment, status } = req.params;

  try {
    const theEnrollement = await Enrollment.findByIdAndUpdate(
      enrollment,
      { completionStatus: status },
      { new: true }
    );
    res.json(theEnrollement);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};



const DisplayEnrollment= asynHandler(async(req,res)=>{
       
  const enrollmentes = await Enrollment.find( {});
  if (!enrollmentes) {
      res.Error(404)
      throw new Error(" enrollmentes Not Found !!")
  }
  res.json(enrollmentes)

})
const countEnroll = async (req, res) => {
  const { course } = req.params;
  try {
    const count = await Enrollment.countDocuments({ course });
    res.status(200).json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
const countCompletedEnrollments = async (req, res) => {
  const { course } = req.params;
  try {
    const count = await Enrollment.countDocuments({ course, completionStatus: 'Completed' });
    res.status(200).json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
const countinProgressEnrollments = async (req, res) => {
  const { course } = req.params;
  try {
    const count = await Enrollment.countDocuments({ course, completionStatus: 'In progress' });
    res.status(200).json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const popularCategory = async (req, res) => {
  try {
    const courses = await Course.find();
    const categories = {};

    courses.forEach((course) => {
      if (!categories[course.category]) {
        categories[course.category] = 1;
      } else {
        categories[course.category]++;
      }
    });

    const categoryCount = Object.keys(categories).map((category) => ({
      category: category,
      count: categories[category],
    }));

    categoryCount.sort((a, b) => b.count - a.count);

    res.status(200).json(categoryCount);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const countNotStartedEnrollments = async (req, res) => {
  const { course } = req.params;
  try {
    const count = await Enrollment.countDocuments({ course, completionStatus: 'Not started' });
    res.status(200).json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

//@Desc : If the user hasn't already reviewed the product, it creates a new review object with the user's name, rating, comment, and user id. It then pushes the new review into the reviews array of the product object, updates the numReviews field to reflect the new number of reviews, and calculates the new rating by taking the average of all the review ratings. 
//Create Review 
//@Route : POST /couf**rse/:id/reviews 
//@Access : Private 
const createCourseReview = asynHandler(async (req, res) => {
  const {
   rating , comment 
  } = req.body

  const course = await Course.findById(req.params.id) //It proceeds to find the product by its id using Product.findById()

  if (course) {
   const alreadyReviewed = course.reviews.find(r => r.user.toString() === req.user._id.toString())
   if (alreadyReviewed){
    res.status(400)
    throw new Error ('Course Already Reviewed')
   }
   const review ={
    name : req.user.firstName,
    rating : Number(rating),
    comment,
    user : req.user._id
   }
     course.reviews.push(review)
     course.numReviews = course.reviews.length 
     course.rating =course.reviews.reduce((acc , item)=> item.rating + acc , 0 )/
     course.reviews.length
     await course.save()
//   const updatedProduct = await product.save()
    res.status(201).json({ message : "Review added"})
  } else {
    res.status(404)
    throw new Error('Review not found')
  }
})

const SendMail = asynHandler(async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.user,
        pass: process.env.pass
      }
    });

    const mailOptions = {
      from: 'zainebhamdi2013@gmail.com',
      to,
      subject,
      html: body,
      
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send('Email sent successfully.' + to);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while sending the email.');
  }
});


module.exports={

  createCourse,createLesson,getAgePercentage,updateEnrollforUser,DisplayLesson,getCoursesByIds,updateCompletionStatus,countEnroll,countCompletedEnrollments,countinProgressEnrollments,
  deleteCourse,updateCourse,SearchCourse,getCourseById,countNotStartedEnrollments,popularCategory,setTestFailed,setTestPassed,createCourseReview,
  getCoursesById,updateLesson,calculateSuccessRate, getLessonById, deleteLessonFromCourse,GetLessons,createTest,createEnroll,DisplayEnrollment,deleteTest,SendMail
}