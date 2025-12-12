"use client";

import { useParams } from "next/navigation";
import PersonalPage from "../page";

const PersonalPageID = () => {
  const { id: employeeId } = useParams<{ id: string }>();
  return (
   <PersonalPage params={{ employeeId }} />
  )
}

export default PersonalPageID;