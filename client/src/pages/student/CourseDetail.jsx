import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const CourseDetail = () => {
  const params = useParams();
  const courseId = params.id;
  const Navigate = useNavigate();

  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(params.id);

  if(isLoading) return <h1>Loading...</h1>
  if(isError) return <h1>Some error occured</h1>

  const {course,purchased} = data;

const handleContinueCourse = () => {
  if(purchased){
    // Redirect to course page
    Navigate(`/course-progress/${courseId}`);
}
}
 
 
  return (
    <div className="mt-10 space-y-5 dark:bg-gray-900 dark:text-white">
      <div className="bg-[#2d2f31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">Course Title</h1>
          <p className="text-base md:text-lg">{course?.courseTitle}</p>
          <p>
            Created By{" "}
            <span className="text-[#c0c4fc] underline italic">
             {course?.creator.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated {course?.createdAt.split("T")[0]}</p>
          </div>
          <p>Student Enrolled: {course?.enrolledStudents.lengh}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p className="text-sm" dangerouslySetInnerHTML={{__html:course.description}}>

           
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>4 lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.lectures.map((_, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span>
                    {true ? <PlayCircle size={14} /> : <Lock size={14} />}
                  </span>
                  <p>{lecture.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">Video aayega</div>
              <h1>Lecture Title </h1>
             <Separator/>
              <h1 className="text-lg md:text-xl font-semibold">Course Price</h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {
                purchased ? (
                  <Button onClick={handleContinueCourse} className="w-full">Continue Course</Button>
                ) : (
                  <BuyCourseButton courseId={courseId}/>
                )
              }
         
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
