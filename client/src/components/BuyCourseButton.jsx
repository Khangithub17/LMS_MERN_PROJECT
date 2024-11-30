import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const BuyCourseButton = (courseId) => {
  const [createCheckoutSession, {data, isLoading,isSuccess,isError,error }] =
    useCreateCheckoutSessionMutation();

  const purchaseCourseHanlder = async () => {
    await createCheckoutSession(courseId);
  };

  useEffect(() => {
    if (isSuccess) {
        if(data?.url){
            window.location.href = data.url;
        }else{
            toast.error(error?.data?.message || "Something went wrong");
        }
    }
      
    
  }, [isSuccess,data,isError,error]);



  return (
    <Button
      disabled={isLoading}
      onClick={purchaseCourseHanlder}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
        </>
      ) : (
        "Buy Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;
