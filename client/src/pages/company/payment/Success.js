import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Success = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setAparmentPaid = useCallback(() => {
    // Do async request to set Apartment paid as true.
    const apartmentID = searchParams.get("apartment");
    const token = searchParams.get("security");
    
  },[]);

  useEffect(setAparmentPaid);

  return (
    <></>
  );
}

export default Success;