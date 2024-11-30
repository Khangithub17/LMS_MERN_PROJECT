import { Course } from "../models/course.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "Course title and category is required.",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });

    return res.status(201).json({
      course,
      message: "Course created.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create course",
    });
  }
};

export const getPublishedCourses = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({path:"creator", select:"name photoUrl"});
    if (!courses) {
      return res.status(404).json({
        courses: [],
        message: "Course not found.",
      });
    }
    return res.status(200).json({
      courses,
      message: "Published courses found.",
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get published courses",
    });
    
  }
}



export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        courses: [],
        message: "Course not found.",
      });
    }
    return res.status(200).json({
      courses,
      message: "Courses found.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get courses",
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const {
      courseTitle,
      subTitle,
      category,
      courseLevel,
      description,
      coursePrice,
    } = req.body;
    const thumbnail = req.file?.path;

    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }
    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId); //old photo
      }
      courseThumbnail = await uploadMedia(thumbnail);
    }
    //upload new photo
    const updateData = {
      courseTitle,
      subTitle,
      category,
      courseLevel,
      description,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url || course.courseThumbnail,
    };

    course = await Course.findByIdAndUpdate(course, updateData, {
      new: true,
    });

    return res.status(200).json({
      course,
      message: "Course updated.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to edit course",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }
    return res.status(200).json({
      course,
      message: "Course found.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get course",
    });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "Lecture title is required",
      });
    }

    // create lecture
    const lecture = await lecture.create({ lectureTitle });

    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(201).json({
      lecture,
      message: "Lecture created successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create lecture",
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }
    return res.status(200).json({
      lectures: course.lectures,
      message: "Lectures found.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get lecture",
    });
  }
};
export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;

    const { courseId, lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }

    // update lecture
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(200).json({
      lecture,
      message: "Lecture updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to edit lectures",
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found.",
      });
    }
    // delete the lecture from couldinary as well
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }
    //remove the lecture from course
    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    );
    return res.status(200).json({
      message: "Lecture removed successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to remove lecture",
    });
  }
};
export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }
    return res.status(200).json({
      lecture,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get lecture by id",
    });
  }
};

//publish unpublish course logic

export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; // true or false
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }
    //update the course status
    course.isPublished = publish === "true";
    await course.save();
    const statusMessage = course.isPublished ? "published" : "unpublished";
    return res.status(200).json({
      message: `Course ${statusMessage} successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update status",
    });
  }
};
