import { Switch } from "@/components/ui/switch";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from "@/features/api/courseApi";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const MEDIA_API = "http://localhost:3000/api/v1/media";

const LectureTab = () => {
    const [lecturetitle, setLectureTitle] = useState("");
    const [uploadVideoInfo,setUploadVideoInfo] = useState(null);
    const [isFree,setIsFree] = useState(false);
    const [mediaProgess,setMediaProgress] = useState(false);
    const [uploadProgess,setUploadProgress] = useState(0);
    const [buttonDisabled,setButtonDisabled] = useState(true);
    const params = useParams();
    const {courseId,lectureId} = params;

    const {data:lectureData} = useGetLectureByIdQuery(lectureId);
    const lecture = lectureData?.lecture;

    useEffect(() => {
        if(lecture){
            setLectureTitle(lecture.lecturetitle);
            setUploadVideoInfo({videoUrl:lecture.videoUrl,publicId:lecture.publicId});
            setIsFree(lecture.isFree);
        }
    }, [lecture]);

    const [editLecture,{data,isLoading,error,isSuccess}] = useEditLectureMutation();
    const [removeLecture,{data:removeData,isLoading:removeLoading,isSuccess:removeSuccess}] = useRemoveLectureMutation();

    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file){
            const formData = new FormData();
            formData.append("file",file);
            setMediaProgress(true);
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`,formData,{
                    onUploadProgress:({loaded,total}) => {
                    setUploadProgress(Math.round((loaded/total)*100));
                    }
                });
                if (res.data.success){
                    setUploadVideoInfo({videoUrl:res.data.data.url,publicId:res.data.data.public_id});
                    setButtonDisabled(false);
                    toast.success(res.data.message);
                   
                }
                
            } catch (error) {
                console.log(error);
                toast.error("Failed to upload video");
                
            } finally{
                setMediaProgress(false);
            }
        }
        
        
    }

    const editLectureHandler = async () => {
       await editLecture({lecturetitle,videoUrl:uploadVideoInfo.videoUrl,isFree,courseId,lectureId});

    }
    const removeLectureHandler = async () => {
        await removeLecture({lectureId});

    }
    
    useEffect(() => {
        if(isSuccess){
            toast.success(data?.message || "Lecture updated.");
        }
        if(error){
            toast.error(error?.data?.message || "Failed to update lecture.")
        }
    }, [isLoading, error, isSuccess]);

    useEffect(() => {
        if(removeSuccess){
            toast.success("Lecture removed successfully");
        }
    }, [removeSuccess]);


  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>Update Your Lecture</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button disabled={removeLoading} onClick={removeLectureHandler} variant="destructive">
            {
                removeLoading ? <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Please Wait..
                
                
                </>: "Remove Lecture"
            }

          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Title</Label>
          <Input value={lecturetitle} onChange={(e)=>setLectureTitle(e.target.value)} type="text" placeholder="Ex. introduction to HTML" />
        </div>
        <div className="my-5">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input onChange={fileChangeHandler}
            accept="video/*"
            type="file"
            placeholder="Ex. introduction to HTML"
            className="w-fit"
          />
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch  id="airplane-mode" checked={isFree} onCheckedChange={setIsFree} />
          <Label htmlFor="airplane-mode">is this video FREE</Label>
        </div>

        {mediaProgess && (
          <div className="my-4">
            <Progress value={uploadProgess} />
            <p>{uploadProgess}% uploaded</p>
          </div>
        )}
        <div className="mt-4">
            <Button disabled={isLoading} onClick={editLectureHandler}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                    </>
                ) : (
                    "Update Lecture"
                )}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
