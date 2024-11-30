import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useCreateLectureMutation, useGetCourseByIdQuery } from "@/features/api/courseApi";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const params = useParams();
  const courseId = params.courseId;
  const [lectureTitle, setLectureTitle] = useState("");

  const navigate = useNavigate();

  const [createLecture,{data,isLoading,error,isSuccess}] = useCreateLectureMutation();

  const {data:lectureData,isLoading:lectureLoading,isError:lectureError} = useGetCourseByIdQuery(courseId);

  const createLectureHandler = async () => {
    await createLecture({ courseId, lectureTitle });
  };
  useEffect(() => {
    if(isSuccess){
    toast.success(data?.message || "Lecture created.");
    }
    if(error){
    toast.error(error?.data?.message || "Failed to create lecture.")
    }

  },[isLoading,error])


  

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add lecture, add some basic course details for your new lecture
        </h1>
        <p className="text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus,
          laborum!
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Your Title Name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back to Course
          </Button>
          <Button disabled={isLoading} onCLick={createLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create lecture"
            )}
          </Button>
        </div>
        <div className="mt-10">
          {
            lectureLoading ? (<p>Loading lecture...</p>) : lectureError ? (<p>Failed to load lecture</p>) : !lectureData || lectureData.lectures.length === 0 ? (<p>No lecture found</p>) : (
              
              lectureData.lectures.map((lecture,index) => (
                <Lecture key={lecture._id} lecture={lecture} courseId={courseId} index={index}/>
              ))
            
            )
          }
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
